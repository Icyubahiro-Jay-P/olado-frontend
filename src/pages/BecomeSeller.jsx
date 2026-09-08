import { useEffect, useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { Store, Percent, ArrowRight } from 'lucide-react';

export default function BecomeSeller(){
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ shopName:'', shopDescription:'', logo:'' });
  const [loading, setLoading] = useState(false);
  const [commission, setCommission] = useState(10);

  useEffect(()=>{
    api.get('/settings/commission').then(({data})=>{
      const rate = data?.commissionRate ?? data?.rate;
      if(typeof rate === 'number') setCommission(rate);
    }).catch(()=>{ /* keep default 10% - demo fallback */ });
  },[]);

  // Guard: only plain customers may open a shop from here.
  if(user?.role==='seller') return <Navigate to="/seller/dashboard" replace/>;
  if(user?.role==='admin') return <Navigate to="/admin" replace/>;

  const submit = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const { data } = await api.post('/shops', { name: form.shopName, description: form.shopDescription, logo: form.logo });
      if(data?.user) updateUser(data.user);
      else updateUser({ ...user, role:'seller' });
      toast.success('Shop created! Welcome to seller mode.');
      navigate('/seller/dashboard');
    }catch{
      // demo fallback - simulate becoming a seller locally
      updateUser({ ...user, role:'seller', shop: { name: form.shopName, description: form.shopDescription, logo: form.logo } });
      toast.success('Shop created (demo mode)');
      navigate('/seller/dashboard');
    } finally{ setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-6 py-12">
      <div className="w-full max-w-[520px]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 grid place-items-center text-white mx-auto"><Store size={20}/></div>
          <h1 className="text-2xl font-black mt-4">Become a seller</h1>
          <p className="text-sm text-zinc-500 mt-1">Open your shop on OLADO and start selling in minutes.</p>
        </div>

        <div className="mt-6 flex items-start gap-3 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 text-xs leading-relaxed">
          <Percent size={16} className="text-indigo-600 shrink-0 mt-0.5"/>
          <p>OLADO takes a <b>{commission}% commission</b> on each sale, deducted automatically at checkout - you always see your gross, commission and net earnings broken down in your Seller Dashboard. No fees to join, and this demo auto-approves your shop instantly.</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4 bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-zinc-800 p-8 card-shadow">
          <label className="block text-sm"><span className="font-medium">Shop name</span><input required value={form.shopName} onChange={e=>setForm({...form,shopName:e.target.value})} placeholder="e.g. Urban Threads" className="mt-1 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>
          <label className="block text-sm"><span className="font-medium">Shop description</span><textarea required rows={3} value={form.shopDescription} onChange={e=>setForm({...form,shopDescription:e.target.value})} placeholder="What do you sell?" className="mt-1 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>
          <label className="block text-sm"><span className="font-medium">Logo URL <span className="text-zinc-400 font-normal">(optional)</span></span><input value={form.logo} onChange={e=>setForm({...form,logo:e.target.value})} placeholder="https://..." className="mt-1 w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>
          <button disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-zinc-900 text-white font-semibold hover:bg-black dark:bg-white dark:text-zinc-900 disabled:opacity-50">{loading?'Creating shop...':<>Open my shop <ArrowRight size={16}/></>}</button>
        </form>
        <p className="text-center text-xs text-zinc-400 mt-4">Changed your mind? <Link to="/profile" className="text-indigo-600 underline">Back to profile</Link></p>
      </div>
    </div>
  )
}
