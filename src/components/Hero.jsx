import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero(){
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-violet-50 to-amber-50 dark:from-zinc-900 dark:via-indigo-950/30 dark:to-zinc-900" />
      <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-gradient-to-br from-violet-400/20 to-indigo-400/20 blur-3xl rounded-full" />
      <div className="relative max-w-[1300px] mx-auto px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{duration:0.6}}>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> NEW COLLECTION 2026 <span className="hidden sm:inline text-zinc-400">· Up to 40% off</span>
          </div>
          <h1 className="mt-6 text-4xl lg:text-6xl font-black tracking-tight leading-[0.9]">
            Curated goods <br/>
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">that feel</span><br/>
            premium.
          </h1>
          <p className="mt-5 text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">OLADO is a demo store built to impress - Shopify-grade conversion, Apple-grade aesthetics. Explore 16+ handpicked products across 5 categories. Add to cart, wishlist, review - everything works.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900 text-white font-semibold hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-lg">Shop collection <ArrowRight size={18}/></Link>
            <Link to="/about" className="px-7 py-3.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-semibold hover:bg-zinc-50">Our story</Link>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i=> <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900" alt=""/>)}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500"><Star size={14} className="fill-amber-500"/><Star size={14} className="fill-amber-500"/><Star size={14} className="fill-amber-500"/><Star size={14} className="fill-amber-500"/><Star size={14} className="fill-amber-500"/><span className="ml-1 text-zinc-900 dark:text-white font-bold">4.8/5</span></div>
              <p className="text-xs text-zinc-500">Trusted by 12k+ demo shoppers</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 border-l pl-6">
              <ShieldCheck size={18} className="text-emerald-600"/> Secure checkout
            </div>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} transition={{duration:0.6, delay:0.1}} className="relative">
          <div className="relative rounded-[30px] overflow-hidden bg-white dark:bg-zinc-900 p-3 card-shadow">
            <div className="rounded-[20px] overflow-hidden grid grid-cols-2 gap-3">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700" className="h-[280px] w-full object-cover rounded-2xl" alt=""/>
              <div className="space-y-3">
                <img src="https://images.unsplash.com/photo-1527443224157-c4a3942d3acf?w=700" className="h-[135px] w-full object-cover rounded-2xl" alt=""/>
                <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700" className="h-[135px] w-full object-cover rounded-2xl" alt=""/>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur rounded-2xl p-4 flex items-center gap-4 shadow-xl">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" className="w-14 h-14 rounded-xl object-cover" alt=""/>
              <div className="flex-1">
                <p className="text-sm font-bold">Trail Runner GTX</p>
                <p className="text-xs text-zinc-500">New drop · 4.5 ★ (98)</p>
              </div>
              <span className="text-lg font-black">$149</span>
            </div>
          </div>
          {/* floating badges */}
          <div className="absolute -top-3 -right-2 bg-amber-400 text-zinc-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg rotate-3">Free shipping</div>
          <div className="absolute -bottom-2 -left-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full shadow flex items-center gap-2 text-xs font-semibold"><Truck size={16} className="text-indigo-600"/> 24h Express</div>
        </motion.div>
      </div>
    </section>
  )
}
