import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function Auth({ mode }){
  const isLogin = mode==='login';
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(s=>s.setAuth);
  const navigate = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      const { data } = await api.post(endpoint, payload);
      setAuth({ _id:data._id, name:data.name, email:data.email, role:data.role }, data.token);
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      navigate('/');
    }catch(err){
      // demo fallback: allow login without backend
      if(isLogin && (form.email==='demo@olado.com' && form.password==='demo123') || (form.email==='admin@olado.com' && form.password==='admin123')){
        const fake = { _id:'demo', name: form.email.includes('admin')?'Admin':'Demo User', email: form.email, role: form.email.includes('admin')?'admin':'user' };
        setAuth(fake, 'demo-token-'+Date.now());
        toast.success('Logged in (demo mode)');
        navigate(fake.role==='admin'?'/admin':'/');
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
        <form onSubmit={submit} className="mt-6 space-y-4">
          {!isLogin && <label className="block text-sm"><span className="font-medium">Name</span><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>}
          <label className="block text-sm"><span className="font-medium">Email</span><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@email.com" className="mt-1 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>
          <label className="block text-sm"><span className="font-medium">Password</span><input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" className="mt-1 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>
          <button disabled={loading} className="w-full py-3.5 rounded-full bg-zinc-900 text-white font-semibold hover:bg-black dark:bg-white dark:text-zinc-900 disabled:opacity-50">{loading?'Please wait...': isLogin?'Sign in':'Create account'}</button>
        </form>
        <p className="text-center text-sm text-zinc-500 mt-6">
          {isLogin ? <>No account? <Link to="/register" className="text-indigo-600 font-semibold">Create one</Link></> : <>Already have an account? <Link to="/login" className="text-indigo-600 font-semibold">Sign in</Link></>}
        </p>
      </div>
    </div>
  )
}
