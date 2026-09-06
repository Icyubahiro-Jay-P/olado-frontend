import { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';
import { demoProducts } from '../utils/demoProducts';
import toast from 'react-hot-toast';
import { Package, ShoppingCart, DollarSign, Star, Trash2, Pencil, Plus } from 'lucide-react';

export default function Admin(){
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', price:'', category:'Electronics', stock:'', images:'', description:'' });

  useEffect(()=>{
    api.get('/products').then(r=>setProducts(r.data)).catch(()=>setProducts(demoProducts));
    api.get('/analytics').then(r=>setStats(r.data)).catch(()=>setStats({ totalProducts: demoProducts.length, totalOrders: 12, revenue: 5420, totalUsers: 84, totalReviews: 210 }));
    api.get('/orders').then(r=>setOrders(r.data)).catch(()=>setOrders([
      { _id:'ORD-1', totalPrice: 249, status:'Processing', createdAt: new Date().toISOString(), user:{name:'Demo User', email:'demo@olado.com'}, orderItems:[{name:'Aurora Headphones', quantity:1, price:199}] }
    ]));
  },[]);

  if(!user || user.role!=='admin') return <div className="text-center py-20"><p className="font-bold">Admin access required</p><p className="text-sm text-zinc-500">Login as admin@olado.com / admin123</p></div>;

  const handleCreate = async (e)=>{
    e.preventDefault();
    const payload = { name: form.name, price: Number(form.price), category: form.category, stock: Number(form.stock), images: form.images.split(',').map(s=>s.trim()).filter(Boolean), description: form.description, brand:'OLADO', rating:4.5, numReviews:0 };
    try{
      if(editing){
        const { data } = await api.put(`/products/${editing}`, payload);
        setProducts(p=>p.map(x=>x._id===editing? data : x));
        toast.success('Updated');
      } else {
        const { data } = await api.post('/products', payload);
        setProducts(p=>[data,...p]);
        toast.success('Created');
      }
    }catch{
      // demo fallback
      const newP = { _id: 'demo-'+Date.now(), ...payload };
      if(editing) setProducts(p=>p.map(x=>x._id===editing? {...x,...payload}:x));
      else setProducts(p=>[newP,...p]);
      toast.success(editing?'Updated (demo)':'Created (demo)');
    }
    setForm({ name:'', price:'', category:'Electronics', stock:'', images:'', description:'' });
    setEditing(null);
  };

  const handleDelete = async (id)=>{
    if(!confirm('Delete product?')) return;
    try{ await api.delete(`/products/${id}`); setProducts(p=>p.filter(x=>x._id!==id)); toast.success('Deleted'); }catch{ setProducts(p=>p.filter(x=>x._id!==id)); toast.success('Deleted (demo)'); }
  };

  return (
    <div className="max-w-[1300px] mx-auto px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
      <p className="text-sm text-zinc-500">Manage products, orders and reviews</p>

      <div className="flex gap-2 mt-6">
        {['overview','products','orders','reviews'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${tab===t?'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900':'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'}`}>{t}</button>
        ))}
      </div>

      {tab==='overview' && stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            {label:'Total Products', value: stats.totalProducts, icon: Package, color:'bg-indigo-500'},
            {label:'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color:'bg-emerald-500'},
            {label:'Revenue', value: '$'+Number(stats.revenue).toLocaleString(), icon: DollarSign, color:'bg-amber-500'},
            {label:'Total Reviews', value: stats.totalReviews, icon: Star, color:'bg-violet-500'},
          ].map(s=>(
            <div key={s.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${s.color} text-white grid place-items-center`}><s.icon size={18}/></div>
              <div><p className="text-2xl font-black">{s.value}</p><p className="text-xs text-zinc-500">{s.label}</p></div>
            </div>
          ))}
        </div>
      )}

      {tab==='products' && (
        <div className="mt-6 space-y-6">
          <form onSubmit={handleCreate} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid md:grid-cols-2 gap-4">
            <h3 className="md:col-span-2 font-bold flex items-center gap-2">{editing? <Pencil size={16}/>: <Plus size={16}/>}{editing?'Edit product':'Create product'}</h3>
            <input placeholder="Name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            <input placeholder="Price" type="number" required value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
              {['Electronics','Fashion','Home & Living','Beauty & Personal Care','Sports & Outdoors'].map(c=> <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Stock" type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            <input placeholder="Image URLs (comma separated)" value={form.images} onChange={e=>setForm({...form,images:e.target.value})} className="md:col-span-2 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} className="md:col-span-2 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            <button className="md:col-span-2 py-3 rounded-full bg-zinc-900 text-white font-semibold dark:bg-white dark:text-zinc-900">{editing?'Update':'Create'}</button>
            {editing && <button type="button" onClick={()=>{setEditing(null); setForm({ name:'', price:'', category:'Electronics', stock:'', images:'', description:'' })}} className="md:col-span-2 py-2 rounded-full border">Cancel</button>}
          </form>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500"><tr><th className="text-left p-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
                <tbody>
                  {products.map(p=>(
                    <tr key={p._id} className="border-t border-zinc-100 dark:border-zinc-800">
                      <td className="p-3 flex items-center gap-3"><img src={p.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover"/>{p.name}</td>
                      <td className="text-center text-xs">{p.category}</td>
                      <td className="text-center font-semibold">${p.price}</td>
                      <td className="text-center">{p.stock}</td>
                      <td className="p-3 flex gap-1 justify-end">
                        <button onClick={()=>{setEditing(p._id); setForm({ name:p.name, price:p.price, category:p.category, stock:p.stock, images:(p.images||[]).join(','), description:p.description })}} className="w-8 h-8 rounded-full border grid place-items-center hover:bg-zinc-50"><Pencil size={14}/></button>
                        <button onClick={()=>handleDelete(p._id)} className="w-8 h-8 rounded-full border grid place-items-center hover:bg-red-50 text-red-500"><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab==='orders' && (
        <div className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500"><tr><th className="text-left p-3">Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {orders.map(o=>(
                  <tr key={o._id} className="border-t border-zinc-100 dark:border-zinc-800"><td className="p-3 font-mono text-xs">{o._id?.slice(-10)}</td><td className="p-3">{o.user?.name||'Guest'}<br/><span className="text-xs text-zinc-500">{o.user?.email}</span></td><td className="p-3 font-bold">${o.totalPrice?.toFixed(2)}</td><td className="p-3"><span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">{o.status}</span></td><td className="p-3 text-xs text-zinc-500">{new Date(o.createdAt).toLocaleDateString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='reviews' && (
        <div className="mt-6 space-y-3">
          {products.filter(p=>p.reviews?.length).slice(0,10).map(p=>(
            <div key={p._id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
              <p className="font-semibold text-sm">{p.name} · {p.reviews.length} reviews</p>
              <div className="mt-2 space-y-2">
                {p.reviews.map(r=>(
                  <div key={r._id} className="flex gap-3 text-sm border-t border-zinc-100 dark:border-zinc-800 pt-2">
                    <span className="flex-1"><b>{r.name}</b> - {r.comment} <span className="text-amber-500">★{r.rating}</span></span>
                    <button onClick={async()=>{
                      if(!confirm('Delete review?')) return;
                      try{ await api.delete(`/products/${p._id}/reviews/${r._id}`); toast.success('Deleted'); setProducts(ps=>ps.map(x=> x._id===p._id ? {...x, reviews: x.reviews.filter(y=>y._id!==r._id)}:x)); }catch{ toast.success('Deleted (demo)'); setProducts(ps=>ps.map(x=> x._id===p._id ? {...x, reviews: x.reviews.filter(y=>y._id!==r._id)}:x)); }
                    }} className="text-red-500"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {products.filter(p=>p.reviews?.length).length===0 && <p className="text-sm text-zinc-500 text-center py-10">No reviews yet.</p>}
        </div>
      )}
    </div>
  )
}
