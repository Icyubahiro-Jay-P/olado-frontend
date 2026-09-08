import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import CurrencySwitcher from './CurrencySwitcher';
import { useState, useEffect } from 'react';

export default function Navbar(){
  const { getTotal } = useCartStore();
  const { items: wish } = useWishlistStore();
  const { user, logout } = useAuthStore();
  const { dark, toggle, init } = useThemeStore();
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { count } = getTotal();

  useEffect(()=>{ init() },[]);

  const onSearch = (e)=>{
    e.preventDefault();
    if(q.trim()) navigate(`/products?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/80 backdrop-blur-xl dark:bg-zinc-950/80 dark:border-zinc-800">
      {/* top bar */}
      <div className="bg-[#0f0f2e] text-white text-xs text-center py-2 hidden md:block">
        <span className="opacity-80">Free shipping over $100 · 30-day returns · Secure checkout</span>
        <span className="ml-2 bg-white/15 px-2 py-0.5 rounded-full">New: Express 24h delivery</span>
      </div>
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[64px] flex items-center gap-4">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-lg">C</div>
            <span className="text-xl font-black tracking-tight">OLADO</span>
            <span className="hidden sm:inline text-[10px] leading-none ml-1 px-1.5 py-0.5 rounded bg-amber-400 text-zinc-900 font-bold">DEMO</span>
          </Link>

          {/* nav */}
          <nav className="hidden lg:flex items-center gap-6 ml-6 text-sm font-medium">
            <Link to="/products" className="hover:text-indigo-600">Shop</Link>
            <Link to="/products?category=Electronics" className="hover:text-indigo-600">Electronics</Link>
            <Link to="/products?category=Fashion" className="hover:text-indigo-600">Fashion</Link>
            <Link to="/about" className="hover:text-indigo-600">About</Link>
            <Link to="/team" className="hover:text-indigo-600">Team</Link>
            <Link to="/faq" className="hover:text-indigo-600">FAQ</Link>
            {user?.role==='seller' && <Link to="/seller/dashboard" className="text-indigo-600">Seller Dashboard</Link>}
            {user?.role==='admin' && <Link to="/admin" className="text-amber-600">Admin</Link>}
          </nav>

          {/* search desktop */}
          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products, brands..." className="w-full pl-9 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent" />
          </form>

          {/* actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <CurrencySwitcher className="hidden sm:flex mr-1"/>
            <button onClick={toggle} className="w-9 h-9 grid place-items-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900">
              {dark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
            <Link to="/wishlist" className="relative w-9 h-9 grid place-items-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900">
              <Heart size={18} className={wish.length?'fill-red-500 text-red-500':''}/>
              {wish.length>0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full grid place-items-center">{wish.length}</span>}
            </Link>
            <Link to="/cart" className="relative w-9 h-9 grid place-items-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900">
              <ShoppingBag size={18}/>
              {count>0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[11px] font-bold rounded-full grid place-items-center">{count}</span>}
            </Link>
            {user ? (
              <div className="hidden sm:flex items-center gap-2 ml-1 pl-3 border-l border-zinc-200 dark:border-zinc-800">
                <Link to="/profile" className="flex items-center gap-2 text-sm">
                  <img src={`https://i.pravatar.cc/100?u=${user.email}`} alt="" className="w-8 h-8 rounded-full object-cover"/>
                  <span className="hidden xl:block font-medium max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button onClick={logout} className="text-xs px-3 py-1.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex items-center gap-1.5 ml-1 text-sm font-semibold px-4 py-2 rounded-full bg-zinc-900 text-white dark:hover:bg-zinc-200 hover:bg-black dark:bg-white dark:text-zinc-900">
                <User size={16}/> Sign in
              </Link>
            )}
            
            <button onClick={()=>setMobile(!mobile)} className="lg:hidden w-9 h-9 grid place-items-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900">
              {mobile ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>

        {/* mobile search */}
        <form onSubmit={onSearch} className="md:hidden pb-3 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 -mt-1.5 text-zinc-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </form>
      </div>

      {/* mobile menu */}
      {mobile && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4 space-y-3">
          <Link to="/products" onClick={()=>setMobile(false)} className="block py-2 font-medium">All Products</Link>
          <Link to="/products?category=Electronics" onClick={()=>setMobile(false)} className="block py-2">Electronics</Link>
          <Link to="/products?category=Fashion" onClick={()=>setMobile(false)} className="block py-2">Fashion</Link>
          <Link to="/products?category=Home & Living" onClick={()=>setMobile(false)} className="block py-2">Home & Living</Link>
          <Link to="/about" onClick={()=>setMobile(false)} className="block py-2">About</Link>
          <Link to="/team" onClick={()=>setMobile(false)} className="block py-2">Team</Link>
          <Link to="/faq" onClick={()=>setMobile(false)} className="block py-2">FAQ</Link>
          {user?.role==='seller' && <Link to="/seller/dashboard" onClick={()=>setMobile(false)} className="block py-2 text-indigo-600 font-semibold">Seller Dashboard</Link>}
          {user?.role==='user' && <Link to="/become-seller" onClick={()=>setMobile(false)} className="block py-2 text-indigo-600 font-semibold">Become a Seller</Link>}
          <div className="pt-2"><CurrencySwitcher/></div>
          {!user && <Link to="/login" onClick={()=>setMobile(false)} className="block mt-3 text-center py-3 rounded-full bg-zinc-900 text-white font-semibold">Sign in / Register</Link>}
        </div>
      )}
    </header>
  )
}
