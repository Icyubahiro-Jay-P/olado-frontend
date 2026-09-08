import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import toast from 'react-hot-toast';
import { User, Store } from 'lucide-react';

export default function Auth({ mode }){
  const isLogin = mode==='login';
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'user', shopName:'', shopDescription:'' });
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(s=>s.setAuth);
  const hydrateCart = useCartStore(s=>s.hydrateFromAccount);
  const hydrateWishlist = useWishlistStore(s=>s.hydrateFromAccount);
  const navigate = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : (
        form.role==='seller'
          ? { name: form.name, email: form.email, password: form.password, role: form.role, shopName: form.shopName, shopDescription: form.shopDescription }
          : { name: form.name, email: form.email, password: form.password, role: form.role }
      );
      const { data } = await api.post(endpoint, payload);
      const user = { _id:data._id, name:data.name, email:data.email, role:data.role };
      setAuth(user, data.token);
      hydrateCart();
      hydrateWishlist();
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      if(isLogin){
        navigate(user.role==='admin' ? '/admin' : user.role==='seller' ? '/seller/dashboard' : '/');
      } else {
        navigate(user.role==='seller' ? '/seller/dashboard' : '/');
      }
    }catch(err){
      // demo fallback: allow login without backend
      if(isLogin && (form.email==='demo@olado.com' && form.password==='demo123') || (form.email==='admin@olado.com' && form.password==='admin123')){
        const fake = { _id:'demo', name: form.email.includes('admin')?'Admin':'Demo User', email: form.email, role: form.email.includes('admin')?'admin':'user' };
        setAuth(fake, 'demo-token-'+Date.now());
        hydrateCart();
        hydrateWishlist();
        toast.success('Logged in (demo mode)');
        navigate(fake.role==='admin'?'/admin':'/');
        return;
      }
      if(!isLogin){
        // demo fallback: simulate account creation, including becoming a seller
        const fake = { _id:'demo-'+Date.now(), name: form.name, email: form.email, role: form.role };
        setAuth(fake, 'demo-token-'+Date.now());
        hydrateCart();
        hydrateWishlist();
        toast.success('Account created (demo mode)');
        navigate(fake.role==='seller' ? '/seller/dashboard' : '/');
        return;
      }
      toast.error(err.response?.data?.message || 'Failed. Try demo@olado.com / demo123');
    } finally{ setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-6 py-12">
      <div className="w-full max-w-[440px] bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-zinc-800 p-8 card-shadow">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 grid place-items-center text-white font-black mx-auto">C</div>
          <h1 className="text-2xl font-black mt-4">{isLogin?'Welcome back':'Create account'}</h1>
          <p className="text-sm text-zinc-500 mt-1">{isLogin?'Sign in to continue shopping':'Join OLADO in seconds'}</p>
        </div>
        <div className="mt-6 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs leading-relaxed">
          <b>Demo credentials:</b><br/>
          User: demo@olado.com / demo123<br/>
          Admin: admin@olado.com / admin123
        </div>

        {!isLogin && (
          <div className="mt-6 flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 p-1 text-sm font-semibold">
            <button type="button" onClick={()=>setForm({...form, role:'user'})} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full transition ${form.role==='user'?'bg-white dark:bg-zinc-900 shadow':'text-zinc-500'}`}><User size={14}/> Customer</button>
            <button type="button" onClick={()=>setForm({...form, role:'seller'})} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full transition ${form.role==='seller'?'bg-white dark:bg-zinc-900 shadow':'text-zinc-500'}`}><Store size={14}/> Seller</button>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {!isLogin && <label className="block text-sm"><span className="font-medium">Name</span><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>}
          <label className="block text-sm"><span className="font-medium">Email</span><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com" className="mt-1 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>
          <label className="block text-sm"><span className="font-medium">Password</span><input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" className="mt-1 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>
          {!isLogin && form.role==='seller' && (
            <>
              <label className="block text-sm"><span className="font-medium">Shop name</span><input required value={form.shopName} onChange={e=>setForm({...form,shopName:e.target.value})} placeholder="e.g. Urban Threads" className="mt-1 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>
              <label className="block text-sm"><span className="font-medium">Shop description</span><textarea required rows={2} value={form.shopDescription} onChange={e=>setForm({...form,shopDescription:e.target.value})} placeholder="What will you sell?" className="mt-1 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>
            </>
          )}
          <button disabled={loading} className="w-full py-3.5 rounded-full bg-zinc-900 text-white font-semibold hover:bg-black dark:bg-white dark:text-zinc-900 disabled:opacity-50">{loading?'Please wait...': isLogin?'Sign in':(form.role==='seller'?'Create seller account':'Create account')}</button>
        </form>
        <p className="text-center text-sm text-zinc-500 mt-6">
          {isLogin ? <>No account? <Link to="/register" className="text-indigo-600 font-semibold">Create one</Link></> : <>Already have an account? <Link to="/login" className="text-indigo-600 font-semibold">Sign in</Link></>}
        </p>
      </div>
    </div>
  )
}
