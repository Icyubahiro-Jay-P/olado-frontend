import { Link } from 'react-router-dom';
import { Mail, Code2, Briefcase, Camera, ArrowUpRight } from 'lucide-react';

export default function Footer(){
  return (
    <footer className="bg-[#0a0a1a] text-zinc-300 mt-20">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 text-white">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 grid place-items-center font-black">C</div>
              <span className="text-xl font-black tracking-tight">OLADO</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">A curated demo e-commerce experience. Premium products, Apple-grade design, Shopify-grade conversion. Built to impress clients.</p>
            <div className="flex gap-2 mt-6">
              <a href="mailto:hello@olado.demo" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center"><Mail size={16}/></a>
              <a href="https://github.com" target="_blank" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center"><Code2 size={16}/></a>
              <a href="https://linkedin.com" target="_blank" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center"><Briefcase size={16}/></a>
              <a href="https://instagram.com" target="_blank" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center"><Camera size={16}/></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li><Link to="/products" className="hover:text-white">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-white">Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-white">Fashion</Link></li>
              <li><Link to="/products?category=Home & Living" className="hover:text-white">Home & Living</Link></li>
              <li><Link to="/products?category=Beauty & Personal Care" className="hover:text-white">Beauty</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Help</h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li><Link to="/faq" className="hover:text-white">FAQ & Shipping</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
              <li><span className="hover:text-white cursor-pointer">Returns & Refunds</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-zinc-400">Get 10% off your first order + early access.</p>
            <form onSubmit={e=>e.preventDefault()} className="mt-4 flex gap-2">
              <input placeholder="you@email.com" className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"/>
              <button className="px-5 py-2.5 rounded-full bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100">Join</button>
            </form>
            <p className="text-xs text-zinc-500 mt-3">Demo only - no emails sent.</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row gap-3 justify-between text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} OLADO Demo. All rights reserved. Crafted for presentation.</span>
          <span className="flex gap-4"><span>Privacy</span><span>Terms</span><span>Cookies</span></span>
        </div>
      </div>
    </footer>
  )
}
