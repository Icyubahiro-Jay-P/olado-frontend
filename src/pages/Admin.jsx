import { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import useCurrencyStore, { format } from '../store/useCurrencyStore';
import api from '../api/axios';
import { demoProducts, demoShops } from '../utils/demoProducts';
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { Package, ShoppingCart, DollarSign, Star, Trash2, Pencil, Plus, Store, ShieldCheck, ShieldOff, Percent, TrendingUp, Save, Tags } from 'lucide-react';

const CATEGORY_FALLBACK = ['Electronics','Fashion','Home & Living','Beauty & Personal Care','Sports & Outdoors'];
const emptyCategoryForm = { name:'', slug:'', image:'', description:'' };

export default function Admin(){
  const { user } = useAuthStore();
  useCurrencyStore(s=>s.currency); // subscribe so prices re-render on currency switch

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [editingCategory, setEditingCategory] = useState(null);
  const [commissionRate, setCommissionRate] = useState(10);
  const [commissionInput, setCommissionInput] = useState('10');
  const [commissionSaving, setCommissionSaving] = useState(false);

  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', price:'', category:'Electronics', stock:'', images:'', description:'' });

  useEffect(()=>{
    api.get('/products').then(r=>setProducts(r.data)).catch(()=>setProducts(demoProducts));
    api.get('/analytics').then(r=>setStats(r.data)).catch(()=>setStats({ totalProducts: demoProducts.length, totalOrders: 12, revenue: 5420, totalUsers: 84, totalReviews: 210, totalCommissionEarned: 542 }));
    api.get('/orders').then(r=>setOrders(r.data)).catch(()=>setOrders([
      { _id:'ORD-1', totalPrice: 249, status:'Processing', createdAt: new Date().toISOString(), user:{name:'Demo User', email:'demo@olado.com'}, orderItems:[{name:'Aurora Headphones', quantity:1, price:199, shopName:'TechHub Kigali', commissionAmount:19.9, netAmount:179.1}] }
    ]));
    api.get('/shops/admin/all').then(r=>setSellers(r.data)).catch(()=>setSellers(demoShops.map(s=>({ ...s, owner:{ name:'Demo Seller', email:'seller@olado.com' } })))).finally(()=>setSellersLoading(false));
    api.get('/categories').then(r=>setCategories(r.data)).catch(()=>setCategories(CATEGORY_FALLBACK.map((name,i)=>({ _id:'cat-'+i, name, slug:name.toLowerCase().replace(/[^a-z0-9]+/g,'-'), description:'', image:'' })))).finally(()=>setCategoriesLoading(false));
    api.get('/settings/commission').then(({data})=>{
      const rate = data?.commissionRate ?? data?.rate;
      if(typeof rate==='number'){ setCommissionRate(rate); setCommissionInput(String(rate)); }
    }).catch(()=>{ /* keep default 10% - demo fallback */ });
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

  const handleShopStatus = async (id, status)=>{
    setSellers(ss=>ss.map(s=>s._id===id? {...s, status} : s));
    try{ await api.put(`/shops/${id}`, { status }); toast.success(`Shop ${status}`); }
    catch{ toast.success(`Shop ${status} (demo)`); }
  };

  const resetCategoryForm = ()=>{ setCategoryForm(emptyCategoryForm); setEditingCategory(null); };
  const startEditCategory = (c)=>{
    setEditingCategory(c._id);
    setCategoryForm({ name:c.name||'', slug:c.slug||'', image:c.image||'', description:c.description||'' });
  };
  const handleCategorySubmit = async (e)=>{
    e.preventDefault();
    const slug = categoryForm.slug || categoryForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    const payload = { name: categoryForm.name, slug, image: categoryForm.image, description: categoryForm.description };
    try{
      if(editingCategory){
        const { data } = await api.put(`/categories/${editingCategory}`, payload);
        setCategories(cs=>cs.map(c=>c._id===editingCategory? data : c));
        toast.success('Category updated');
      }else{
        const { data } = await api.post('/categories', payload);
        setCategories(cs=>[data, ...cs]);
        toast.success('Category created');
      }
    }catch{
      if(editingCategory){
        setCategories(cs=>cs.map(c=>c._id===editingCategory? {...c, ...payload} : c));
        toast.success('Updated (demo)');
      }else{
        setCategories(cs=>[{ _id:'cat-'+Date.now(), ...payload }, ...cs]);
        toast.success('Created (demo)');
      }
    }
    resetCategoryForm();
  };
  const handleCategoryDelete = async (id)=>{
    if(!confirm('Delete category?')) return;
    try{ await api.delete(`/categories/${id}`); }catch{ /* demo fallback */ }
    setCategories(cs=>cs.filter(c=>c._id!==id));
    toast.success('Deleted');
  };

  const handleCommissionSave = async (e)=>{
    e.preventDefault();
    const rate = Number(commissionInput);
    setCommissionSaving(true);
    try{
      await api.put('/settings/commission', { commissionRate: rate });
      setCommissionRate(rate);
      toast.success('Commission rate updated');
    }catch{
      setCommissionRate(rate);
      toast.success('Updated (demo)');
    } finally{ setCommissionSaving(false); }
  };

  return (
    <div className="max-w-[1300px] mx-auto px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
      <p className="text-sm text-zinc-500">Manage products, orders, sellers and platform settings</p>

      <div className="flex gap-2 mt-6 flex-wrap">
        {['overview','products','orders','sellers','categories','commission','reviews'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${tab===t?'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900':'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'}`}>{t}</button>
        ))}
      </div>

      {tab==='overview' && (
        !stats ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">{[1,2,3,4].map(i=><Skeleton key={i} className="h-[84px]"/>)}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="bg-indigo-500"/>
            <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} color="bg-emerald-500"/>
            <StatCard icon={DollarSign} label="Revenue" value={format(stats.revenue)} color="bg-amber-500"/>
            <StatCard icon={Star} label="Total Reviews" value={stats.totalReviews} color="bg-violet-500"/>
            <StatCard icon={TrendingUp} label="Total Platform Commission Earned" value={format(stats.totalCommissionEarned ?? 0)} color="bg-rose-500"/>
          </div>
        )
      )}

      {tab==='products' && (
        <div className="mt-6 space-y-6">
          <form onSubmit={handleCreate} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid md:grid-cols-2 gap-4">
            <h3 className="md:col-span-2 font-bold flex items-center gap-2">{editing? <Pencil size={16}/>: <Plus size={16}/>}{editing?'Edit product':'Create product'}</h3>
            <input placeholder="Name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            <input placeholder="Price" type="number" required value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
              {(categories.length?categories.map(c=>c.name):CATEGORY_FALLBACK).map(c=> <option key={c}>{c}</option>)}
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
                      <td className="text-center font-semibold">{format(p.price)}</td>
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
        <div className="mt-6 space-y-4">
          {orders.map(o=>(
            <div key={o._id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <span className="font-mono text-xs font-bold">{o._id?.slice(-10)}</span>
                <span>{o.user?.name||'Guest'} <span className="text-xs text-zinc-500">({o.user?.email})</span></span>
                <span className="font-bold">{format(o.totalPrice)}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">{o.status}</span>
                <span className="text-xs text-zinc-500">{new Date(o.createdAt).toLocaleDateString()}</span>
              </div>
              {(o.orderItems||[]).length>0 && (
                <div className="mt-3 space-y-1.5">
                  {o.orderItems.map((it,i)=>(
                    <div key={i} className="flex flex-wrap items-center gap-3 text-xs border-t border-zinc-100 dark:border-zinc-800 pt-2">
                      <span className="flex-1 font-medium text-zinc-700 dark:text-zinc-300">{it.name} ×{it.quantity}</span>
                      {it.shopName && <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">{it.shopName}</span>}
                      <span className="text-zinc-500">Gross {format(it.price*it.quantity)}</span>
                      {it.commissionAmount!=null && <span className="text-amber-600 dark:text-amber-400">Commission {format(it.commissionAmount)}</span>}
                      {it.netAmount!=null && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Net {format(it.netAmount)}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab==='sellers' && (
        <div className="mt-6">
          {sellersLoading ? (
            <div className="space-y-2">{[1,2,3].map(i=><Skeleton key={i} className="h-16"/>)}</div>
          ) : sellers.length===0 ? (
            <EmptyState icon={Store} title="No sellers yet" description="Shops will show up here once sellers join the marketplace."/>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500"><tr><th className="text-left p-3">Shop</th><th>Owner</th><th>Category</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {sellers.map(s=>(
                      <tr key={s._id} className="border-t border-zinc-100 dark:border-zinc-800">
                        <td className="p-3 flex items-center gap-3"><img src={s.logo} alt="" className="w-9 h-9 rounded-lg object-cover bg-zinc-100 dark:bg-zinc-800"/>{s.name}</td>
                        <td className="text-center text-xs">{s.owner?.name||'—'}<br/><span className="text-zinc-400">{s.owner?.email}</span></td>
                        <td className="text-center text-xs">{s.category||'—'}</td>
                        <td className="text-center"><span className={`text-xs px-2 py-1 rounded-full font-semibold ${s.status==='approved'?'bg-emerald-50 text-emerald-700 dark:bg-emerald-950':s.status==='suspended'?'bg-red-50 text-red-600 dark:bg-red-950':'bg-amber-50 text-amber-700 dark:bg-amber-950'}`}>{s.status||'pending'}</span></td>
                        <td className="p-3 flex gap-1 justify-end">
                          {s.status!=='approved' && <button onClick={()=>handleShopStatus(s._id,'approved')} title="Approve" className="w-8 h-8 rounded-full border grid place-items-center hover:bg-emerald-50 text-emerald-600"><ShieldCheck size={14}/></button>}
                          {s.status!=='suspended' && <button onClick={()=>handleShopStatus(s._id,'suspended')} title="Suspend" className="w-8 h-8 rounded-full border grid place-items-center hover:bg-red-50 text-red-500"><ShieldOff size={14}/></button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab==='categories' && (
        <div className="mt-6 space-y-6">
          <form onSubmit={handleCategorySubmit} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid md:grid-cols-2 gap-4">
            <h3 className="md:col-span-2 font-bold flex items-center gap-2"><Tags size={16}/> {editingCategory?'Edit category':'New category'}</h3>
            <input placeholder="Name" required value={categoryForm.name} onChange={e=>setCategoryForm({...categoryForm,name:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            <input placeholder="Slug (auto if left blank)" value={categoryForm.slug} onChange={e=>setCategoryForm({...categoryForm,slug:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            <input placeholder="Image URL" value={categoryForm.image} onChange={e=>setCategoryForm({...categoryForm,image:e.target.value})} className="md:col-span-2 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            <textarea placeholder="Description" rows={2} value={categoryForm.description} onChange={e=>setCategoryForm({...categoryForm,description:e.target.value})} className="md:col-span-2 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            <button className="md:col-span-2 py-3 rounded-full bg-zinc-900 text-white font-semibold dark:bg-white dark:text-zinc-900">{editingCategory?'Save changes':'Create category'}</button>
            {editingCategory && <button type="button" onClick={resetCategoryForm} className="md:col-span-2 py-2 rounded-full border">Cancel</button>}
          </form>

          {categoriesLoading ? (
            <div className="space-y-2">{[1,2,3].map(i=><Skeleton key={i} className="h-14"/>)}</div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500"><tr><th className="text-left p-3">Name</th><th>Slug</th><th></th></tr></thead>
                  <tbody>
                    {categories.map(c=>(
                      <tr key={c._id} className="border-t border-zinc-100 dark:border-zinc-800">
                        <td className="p-3 flex items-center gap-3">{c.image && <img src={c.image} alt="" className="w-9 h-9 rounded-lg object-cover"/>}{c.name}</td>
                        <td className="text-center text-xs font-mono text-zinc-500">{c.slug}</td>
                        <td className="p-3 flex gap-1 justify-end">
                          <button onClick={()=>startEditCategory(c)} className="w-8 h-8 rounded-full border grid place-items-center hover:bg-zinc-50"><Pencil size={14}/></button>
                          <button onClick={()=>handleCategoryDelete(c._id)} className="w-8 h-8 rounded-full border grid place-items-center hover:bg-red-50 text-red-500"><Trash2 size={14}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab==='commission' && (
        <div className="mt-6 space-y-6 max-w-xl">
          <StatCard icon={TrendingUp} label="Total Platform Commission Earned" value={format(stats?.totalCommissionEarned ?? 0)} color="bg-rose-500"/>
          <form onSubmit={handleCommissionSave} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2"><Percent size={16}/> Global commission rate</h3>
            <p className="text-xs text-zinc-500">Applied automatically to every sale across all shops. Current rate: <b>{commissionRate}%</b>.</p>
            <label className="text-sm block"><span className="font-medium">New rate (%)</span>
              <input type="number" min="0" max="100" step="0.5" value={commissionInput} onChange={e=>setCommissionInput(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
            </label>
            <button disabled={commissionSaving} className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-zinc-900 text-white font-semibold dark:bg-white dark:text-zinc-900 disabled:opacity-50"><Save size={16}/> {commissionSaving?'Saving...':'Save rate'}</button>
          </form>
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
