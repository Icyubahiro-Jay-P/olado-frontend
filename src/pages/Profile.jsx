import { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';
import { Package, User as UserIcon } from 'lucide-react';

export default function Profile(){
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(!token) { setLoading(false); return; }
    api.get('/orders/myorders').then(r=>setOrders(r.data)).catch(()=>setOrders(JSON.parse(localStorage.getItem('olado_demo_orders')||'[]'))).finally(()=>setLoading(false));
  },[token]);

  if(!user) return <div className="text-center py-20">Please <a href="/login" className="text-indigo-600 underline">login</a> to view profile.</div>;

  return (
    <div className="max-w-[1000px] mx-auto px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 p-6 flex gap-4 items-center">
        <img src={`https://i.pravatar.cc/200?u=${user.email}`} alt="" className="w-16 h-16 rounded-full"/>
        <div>
          <h1 className="text-xl font-black">{user.name}</h1>
          <p className="text-sm text-zinc-500">{user.email} · <span className="capitalize">{user.role}</span></p>
        </div>
        <span className="ml-auto hidden sm:block text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">Member since {new Date().toLocaleDateString()}</span>
      </div>

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
                <p className="text-xs text-zinc-500 mt-1">{new Date(o.createdAt).toLocaleString()} · ${o.totalPrice?.toFixed(2)} · {o.shippingMethod}</p>
                <div className="mt-3 space-y-2">
                  {(o.orderItems||[]).map(it=>(
                    <div key={it.product} className="flex gap-3 text-sm">
                      <img src={it.image} alt="" className="w-10 h-10 rounded-lg object-cover"/>
                      <span className="flex-1">{it.name} ×{it.quantity}</span><span>${(it.price*it.quantity).toFixed(2)}</span>
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
