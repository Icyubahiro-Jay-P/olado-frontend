import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { demoProducts } from '../utils/demoProducts';
import { Truck, ShieldCheck, RefreshCcw, Headphones, ArrowUpRight } from 'lucide-react';

const categories = [
  { name:'Electronics', image:'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600' },
  { name:'Fashion', image:'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600' },
  { name:'Home & Living', image:'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600' },
  { name:'Beauty & Personal Care', image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600' },
  { name:'Sports & Outdoors', image:'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600' },
];

export default function Home(){
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  useEffect(()=>{
    api.get('/products?featured=true&limit=8').then(r=>setFeatured(r.data)).catch(()=>setFeatured(demoProducts.filter(p=>p.featured).slice(0,8))).finally(()=>setLoading(false));
    // Featured shops - if this fails, we just hide the section entirely (demo-resilience).
    api.get('/shops?featured=true').then(r=>setShops(r.data)).catch(()=>setShops([]));
  },[]);

  return (
    <div>
      <Hero/>

      {/* trust badges */}
      <section className="max-w-[1300px] mx-auto px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {icon: Truck, title:'Free Shipping', desc:'Over $100, worldwide'},
            {icon: ShieldCheck, title:'Secure Payment', desc:'256-bit SSL encrypted'},
            {icon: RefreshCcw, title:'Easy Returns', desc:'30-day hassle-free'},
            {icon: Headphones, title:'Support 24/7', desc:'Chat & email support'},
          ].map(b=>(
            <div key={b.title} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-zinc-800 p-4 flex gap-3 items-center card-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 grid place-items-center text-indigo-600 shrink-0"><b.icon size={18}/></div>
              <div><p className="text-sm font-semibold">{b.title}</p><p className="text-xs text-zinc-500">{b.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* categories */}
      <section className="max-w-[1300px] mx-auto px-6 lg:px-8 mt-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-black tracking-tight">Shop by category</h2>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          {categories.map(c=>(
            <Link key={c.name} to={`/products?category=${encodeURIComponent(c.name)}`} className="group relative rounded-[20px] overflow-hidden h-[180px] card-shadow">
              <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"/>
              <span className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-zinc-900/90 backdrop-blur text-center py-2 rounded-full text-sm font-semibold">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* featured shops */}
      {shops.length>0 && (
        <section className="max-w-[1300px] mx-auto px-6 lg:px-8 mt-14">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Featured shops</h2>
              <p className="text-sm text-zinc-500 mt-1">Independent sellers building on OLADO</p>
            </div>
            <Link to="/team" className="hidden sm:inline text-sm font-semibold text-indigo-600 hover:underline">Meet the team →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {shops.slice(0,4).map(s=>(
              <Link key={s._id} to={`/shops/${s._id}`} className="group relative rounded-[20px] overflow-hidden h-[160px] card-shadow bg-zinc-100 dark:bg-zinc-900">
                <img src={s.banner||s.logo} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
                <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
                  {s.logo && <img src={s.logo} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/40"/>}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{s.name}</p>
                    <p className="text-white/70 text-[11px] truncate">{s.category}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"/>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* featured */}
      <section className="max-w-[1300px] mx-auto px-6 lg:px-8 mt-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-black tracking-tight">Featured products</h2>
          <Link to="/products" className="hidden sm:inline-flex px-5 py-2 rounded-full bg-zinc-900 text-white text-sm font-semibold dark:bg-white dark:text-zinc-900">Browse all</Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {[1,2,3,4].map(i=> <Skeleton key={i} className="h-[360px] rounded-[20px]"/>)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {featured.map(p=> <ProductCard key={p._id||p.name} product={p}/>)}
          </div>
        )}
      </section>

      {/* promo banner */}
      <section className="max-w-[1300px] mx-auto px-6 lg:px-8 mt-14">
        <div className="rounded-[28px] overflow-hidden bg-gradient-to-br from-zinc-900 to-indigo-900 text-white p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-amber-400 text-sm font-bold tracking-widest">LIMITED OFFER</p>
            <h3 className="text-3xl lg:text-4xl font-black mt-2">Get 20% off your first order</h3>
            <p className="text-white/70 mt-2">Use code <span className="bg-white text-zinc-900 px-2 py-0.5 rounded font-mono text-sm font-bold">WELCOME20</span> at checkout.</p>
            <Link to="/products" className="inline-block mt-6 px-7 py-3 rounded-full bg-white text-zinc-900 font-semibold">Shop now</Link>
          </div>
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600" className="w-full lg:w-[420px] h-[240px] object-cover rounded-2xl" alt=""/>
        </div>
      </section>
    </div>
  )
}
