import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { demoProducts, demoShops } from '../utils/demoProducts';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const categories = ['All','Electronics','Fashion','Home & Living','Beauty & Personal Care','Sports & Outdoors'];

export default function Products(){
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search')||'',
    category: searchParams.get('category')||'All',
    seller: searchParams.get('seller')||'',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(()=>{
    api.get('/shops').then(({data})=>setShops(data)).catch(()=>setShops(demoShops));
  },[]);

  const fetch = async () =>{
    setLoading(true);
    try{
      const params = new URLSearchParams();
      if(filters.search) params.set('search', filters.search);
      if(filters.category!=='All') params.set('category', filters.category);
      if(filters.seller) params.set('seller', filters.seller);
      if(filters.minPrice) params.set('minPrice', filters.minPrice);
      if(filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if(filters.sort==='price-asc') params.set('sort','price-asc');
      if(filters.sort==='price-desc') params.set('sort','price-desc');
      if(filters.sort==='rating') params.set('sort','rating');
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data);
    }catch{
      // fallback to demoProducts filter client-side
      let filtered = [...demoProducts];
      if(filters.search) filtered = filtered.filter(p=> p.name.toLowerCase().includes(filters.search.toLowerCase()));
      if(filters.category!=='All') filtered = filtered.filter(p=> p.category===filters.category);
      if(filters.seller) filtered = filtered.filter(p=> p.seller===filters.seller);
      if(filters.minPrice) filtered = filtered.filter(p=> p.price>=Number(filters.minPrice));
      if(filters.maxPrice) filtered = filtered.filter(p=> p.price<=Number(filters.maxPrice));
      if(filters.sort==='price-asc') filtered.sort((a,b)=>a.price-b.price);
      if(filters.sort==='price-desc') filtered.sort((a,b)=>b.price-a.price);
      if(filters.sort==='rating') filtered.sort((a,b)=>b.rating-a.rating);
      setProducts(filtered);
    } finally{ setLoading(false); }
  };

  useEffect(()=>{
    // deferred so no state is set synchronously within the effect body itself
    const t = setTimeout(fetch, 0);
    return ()=>clearTimeout(t);
    // eslint-disable-next-line
  },[filters.category, filters.seller, filters.sort]);

  useEffect(()=>{
    const t = setTimeout(()=>{
      const s = searchParams.get('search');
      const c = searchParams.get('category');
      if(s!==null) setFilters(f=>({...f, search:s}));
      if(c!==null) setFilters(f=>({...f, category:c}));
    }, 0);
    return ()=>clearTimeout(t);
  },[searchParams]);

  const onSearchSubmit = (e)=>{
    e.preventDefault();
    fetch();
    const p = new URLSearchParams(searchParams);
    if(filters.search) p.set('search', filters.search); else p.delete('search');
    setSearchParams(p);
  };

  return (
    <div className="max-w-[1300px] mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Products</h1>
          <p className="text-sm text-zinc-500 mt-1">{loading ? 'Loading...' : `${products.length} products`} · Crafted for every lifestyle</p>
        </div>
        <form onSubmit={onSearchSubmit} className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-[320px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
            <input value={filters.search} onChange={e=>setFilters({...filters, search:e.target.value})} placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold dark:bg-white dark:text-zinc-900">Search</button>
          <button type="button" onClick={()=>setShowFilters(!showFilters)} className="lg:hidden px-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"><SlidersHorizontal size={16}/></button>
        </form>
      </div>

      <div className="mt-6 flex gap-6">
        {/* sidebar */}
        <aside className={`${showFilters?'block':'hidden'} lg:block w-full lg:w-[260px] shrink-0`}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 sticky top-[80px] space-y-6">
            <div>
              <h3 className="font-semibold text-sm">Category</h3>
              <div className="mt-3 space-y-1.5">
                {categories.map(c=>(
                  <button key={c} onClick={()=>setFilters({...filters, category:c})} className={`w-full text-left px-3 py-2 rounded-xl text-sm ${filters.category===c ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>{c}</button>
                ))}
              </div>
            </div>
            {shops.length>0 && (
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                <h3 className="font-semibold text-sm">Shop</h3>
                <select value={filters.seller} onChange={e=>setFilters({...filters, seller:e.target.value})} className="mt-3 w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-sm">
                  <option value="">All shops</option>
                  {shops.map(s=> <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            )}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <h3 className="font-semibold text-sm">Price range</h3>
              <div className="flex gap-2 mt-3">
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={e=>setFilters({...filters, minPrice:e.target.value})} className="w-1/2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-sm"/>
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e=>setFilters({...filters, maxPrice:e.target.value})} className="w-1/2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-sm"/>
              </div>
              <button onClick={fetch} className="mt-3 w-full py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">Apply</button>
            </div>
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <h3 className="font-semibold text-sm">Sort by</h3>
              <select value={filters.sort} onChange={e=>setFilters({...filters, sort:e.target.value})} className="mt-3 w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-sm">
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <button onClick={()=>{setFilters({search:'',category:'All',seller:'',minPrice:'',maxPrice:'',sort:'newest'}); setSearchParams({})}} className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><X size={14}/> Clear filters</button>
          </div>
        </aside>

        {/* grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i=> <Skeleton key={i} className="h-[340px] rounded-[20px]"/>)}
            </div>
          ) : products.length===0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-5xl">🛍️</p><p className="mt-3 font-semibold">No products found</p><p className="text-sm text-zinc-500">Try adjusting filters or search</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map(p=> <ProductCard key={p._id} product={p}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
