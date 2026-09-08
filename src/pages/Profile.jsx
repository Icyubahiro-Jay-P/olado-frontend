import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCurrencyStore, { format } from '../store/useCurrencyStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Package, Store, Coins } from 'lucide-react';

export default function Profile(){
  const { user, token } = useAuthStore();
  const { currency, setCurrency } = useCurrencyStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(!!token);
  const [savingCurrency, setSavingCurrency] = useState(false);

  useEffect(()=>{
    if(!token) return;
    api.get('/orders/myorders').then(r=>setOrders(r.data)).catch(()=>setOrders(JSON.parse(localStorage.getItem('olado_demo_orders')||'[]'))).finally(()=>setLoading(false));
  },[token]);

  if(!user) return <div className="text-center py-20">Please <a href="/login" className="text-indigo-600 underline">login</a> to view profile.</div>;

  const changeCurrency = async (c)=>{
    setCurrency(c);
    setSavingCurrency(true);
    try{ await api.put('/users/currency', { currency: c }); }
    catch{ /* demo-resilience: local preference is already saved */ }
    finally{ setSavingCurrency(false); toast.success(`Currency set to ${c}`); }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 p-6 flex gap-4 items-center flex-wrap">
        <img src={`https://i.pravatar.cc/200?u=${user.email}`} alt="" className="w-16 h-16 rounded-full"/>
        <div>
          <h1 className="text-xl font-black">{user.name}</h1>
          <p className="text-sm text-zinc-500">{user.email} · <span className="capitalize">{user.role}</span></p>
        </div>
        <span className="ml-auto hidden sm:block text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">Member since {new Date().toLocaleDateString()}</span>
      </div>

      <div className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 grid place-items-center"><Coins size={18}/></div>
          <div>
            <p className="font-semibold text-sm">Currency preference</p>
            <p className="text-xs text-zinc-500">Prices display in {currency}{savingCurrency ? ' · saving...' : ''}</p>
          </div>
        </div>
        <div className="flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 p-1 text-sm font-bold">
          {['USD','RWF'].map(c=>(
            <button key={c} onClick={()=>changeCurrency(c)} className={`px-4 py-1.5 rounded-full transition ${currency===c ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500'}`}>{c}</button>
          ))}
        </div>
      </div>

      {user.role==='user' && (
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-indigo-900 text-white p-6 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center"><Store size={18}/></div>
            <div>
              <p className="font-bold">Start selling on OLADO</p>
              <p className="text-sm text-white/70">Open a shop in minutes - no fees to join.</p>
            </div>
          </div>
          <Link to="/become-seller" className="px-5 py-2.5 rounded-full bg-white text-zinc-900 font-semibold text-sm shrink-0">Become a Seller</Link>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-black flex items-center gap-2"><Package size={18}/> Order history</h2>
        {loading ? <p className="text-sm text-zinc-500 mt-4">Loading...</p> : orders.length===0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 mt-4">
            <p className="font-semibold">No orders yet</p><p className="text-sm text-zinc-500">Your orders will appear here after checkout.</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {orders.map(o=>(
              <div key={o._id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
                <div className="flex flex-wrap gap-2 justify-between">
                  <span className="font-mono text-sm font-bold">{o._id?.slice(-8).toUpperCase()}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${o.status==='Delivered'?'bg-emerald-50 text-emerald-700': o.status==='Cancelled'?'bg-red-50 text-red-600':'bg-amber-50 text-amber-700'}`}>{o.status}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{new Date(o.createdAt).toLocaleString()} · {format(o.totalPrice)} · {o.shippingMethod}</p>
                <div className="mt-3 space-y-2">
                  {(o.orderItems||[]).map(it=>(
                    <div key={it.product} className="flex gap-3 text-sm">
                      <img src={it.image} alt="" className="w-10 h-10 rounded-lg object-cover"/>
                      <span className="flex-1">{it.name} ×{it.quantity}</span><span>{format(it.price*it.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
