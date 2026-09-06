import { Heart, Leaf, Award, Users, Mail, Code2, Briefcase, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About(){
  return (
    <div className="max-w-[1000px] mx-auto px-6 lg:px-8 py-12">
      <div className="text-center">
        <span className="inline-block text-xs font-bold tracking-widest px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600">OUR STORY</span>
        <h1 className="text-4xl font-black tracking-tight mt-4">We built OLADO to show<br/>what a store <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">should feel like.</span></h1>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4 max-w-2xl mx-auto">OLADO is a demo e-commerce platform - but every pixel is production-grade. Born from the idea that shopping should be calm, beautiful and fast, we curated products across five lifestyles and wrapped them in a Shopify-meets-Apple shell.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {[
          {icon: Award, title:'Mission', desc:'Make online shopping feel as premium as unboxing. No clutter, no dark patterns - just clarity and craft.'},
          {icon: Leaf, title:'Values', desc:'Sustainability, transparency and human support. We highlight recycled materials, fair pricing and honest reviews.'},
          {icon: Users, title:'Community', desc:'12k+ demo shoppers, 4.8/5 average rating. Built for clients who need to see conversion before they commit.'},
        ].map(v=>(
          <div key={v.title} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 grid place-items-center mx-auto"><v.icon size={20}/></div>
            <h3 className="font-bold mt-4">{v.title}</h3>
            <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 bg-gradient-to-br from-zinc-900 to-indigo-900 rounded-[28px] p-8 lg:p-12 text-white flex flex-col lg:flex-row gap-8 items-center">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" alt="" className="w-full lg:w-[360px] h-[260px] object-cover rounded-2xl"/>
        <div>
          <h3 className="text-2xl font-black">A store that sells itself</h3>
          <p className="text-white/70 mt-3 leading-relaxed">From Framer Motion micro-interactions to persistent cart & wishlist sync, JWT auth and an admin that actually manages products - OLADO is ready to run with <code className="bg-white/15 px-1.5 py-0.5 rounded">npm install</code>.</p>
          <Link to="/products" className="inline-block mt-6 px-7 py-3 rounded-full bg-white text-zinc-900 font-semibold">Explore the store</Link>
        </div>
      </div>

      <div className="mt-14">
        <h3 className="text-xl font-black text-center">Get in touch</h3>
        <p className="text-center text-sm text-zinc-500 mt-1">Replace these placeholders with your real links.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            {icon: Mail, label:'Email', value:'hello@olado.demo', href:'mailto:hello@olado.demo'},
            {icon: Briefcase, label:'LinkedIn', value:'linkedin.com/in/yourprofile', href:'https://linkedin.com'},
            {icon: Camera, label:'Instagram', value:'@olado.demo', href:'https://instagram.com'},
            {icon: Code2, label:'GitHub', value:'github.com/yourhandle', href:'https://github.com'},
          ].map(c=>(
            <a key={c.label} href={c.href} target="_blank" className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 flex gap-3 items-center hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 grid place-items-center"><c.icon size={18}/></div>
              <div><p className="text-xs text-zinc-500">{c.label}</p><p className="text-sm font-semibold truncate max-w-[140px]">{c.value}</p></div>
            </a>
          ))}
        </div>
        <p className="text-center text-xs text-zinc-400 mt-8">Made with <Heart size={12} className="inline fill-red-500 text-red-500"/> for demo clients. Replace placeholder links in <code>src/pages/About.jsx</code>.</p>
      </div>
    </div>
  )
}
