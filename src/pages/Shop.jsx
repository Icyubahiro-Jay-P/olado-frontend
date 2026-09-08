import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { demoShops, demoProducts } from '../utils/demoProducts';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { Store, ShieldCheck, ChevronLeft } from 'lucide-react';

export default function Shop(){
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(()=>{
    api.get(`/shops/${id}`).then(({ data })=>{
      setShop(data.shop);
      setProducts(data.products || []);
      setNotFound(false);
    }).catch(()=>{
      const found = demoShops.find(s=>s._id===id);
      if(found){
        setShop(found);
        setProducts(demoProducts.filter(p=>p.seller===found._id || p.shopName===found.name));
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }).finally(()=>setLoading(false));
  },[id]);

  if(loading){
    return (
      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 py-8">
        <Skeleton className="h-[220px] rounded-[28px] w-full"/>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
          {[1,2,3,4,5,6].map(i=> <Skeleton key={i} className="h-[340px] rounded-[20px]"/>)}
        </div>
      </div>
    )
  }

  if(notFound || !shop){
    return <EmptyState icon={Store} title="Shop not found" description="This shop may have been removed or the link is incorrect." ctaText="Browse all products" ctaTo="/products"/>;
  }

  return (
    <div>
      <div className="relative h-[220px] lg:h-[280px] overflow-hidden">
        <img src={shop.banner || shop.logo} alt="" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"/>
        <div className="relative max-w-[1300px] mx-auto px-6 lg:px-8 h-full flex flex-col justify-end pb-6">
          <Link to="/products" className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white w-fit"><ChevronLeft size={14}/> Back to shop</Link>
          <div className="flex items-end gap-4 mt-3">
            <img src={shop.logo} alt={shop.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl shrink-0 bg-white"/>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">{shop.name}</h1>
                {shop.status==='approved' && <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full"><ShieldCheck size={12}/> Verified seller</span>}
              </div>
              <p className="text-white/70 text-sm mt-1 max-w-xl line-clamp-2">{shop.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-black tracking-tight">Products from {shop.name}</h2>
          <span className="text-sm text-zinc-500">{products.length} item{products.length!==1?'s':''}</span>
        </div>
        {products.length===0 ? (
          <EmptyState icon={Store} title="No products yet" description="This shop hasn't listed anything for sale yet - check back soon."/>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
            {products.map(p=> <ProductCard key={p._id} product={p}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
