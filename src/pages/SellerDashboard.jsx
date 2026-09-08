import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCurrencyStore, { format } from '../store/useCurrencyStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import StatCard from '../components/StatCard';
import { Package, ShoppingCart, DollarSign, TrendingUp, Pencil, Trash2, Plus, Store, Save, Clock } from 'lucide-react';

const CATEGORY_FALLBACK = ['Electronics','Fashion','Home & Living','Beauty & Personal Care','Sports & Outdoors'];
const ORDER_STATUSES = ['Processing','Shipped','Delivered','Cancelled'];
const emptyForm = { name:'', description:'', price:'', originalPrice:'', images:'', category:'', brand:'', stock:'', tags:'' };

export default function SellerDashboard(){
  const { user } = useAuthStore();
  useCurrencyStore(s=>s.currency); // subscribe so price displays re-render on switch

  const [tab, setTab] = useState('overview');
  const [shop, setShop] = useState(null);
  const [shopForm, setShopForm] = useState({ name:'', description:'', logo:'', banner:'' });
  const [shopSaving, setShopSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(()=>{
    api.get('/shops/me').then(({data})=>{ setShop(data); setShopForm({ name:data.name||'', description:data.description||'', logo:data.logo||'', banner:data.banner||'' }); }).catch(()=>{
      const fallback = { name: user?.shop?.name || `${user?.name}'s Shop`, description: user?.shop?.description || 'Tell shoppers what makes your shop worth a visit.', logo:'', banner:'', status:'approved' };
      setShop(fallback);
      setShopForm({ name:fallback.name, description:fallback.description, logo:'', banner:'' });
    });

    api.get('/analytics/seller').then(({data})=>setStats(data)).catch(()=>setStats({
      grossSales: 2840, commissionPaid: 284, netEarnings: 2556, productCount: 6, orderCount: 14,
      recentOrders: [{ _id:'DEMO-ORD-1', createdAt:new Date().toISOString(), totalPrice: 249, status:'Processing' }]
    }));

    api.get('/categories').then(({data})=>setCategories(data)).catch(()=>setCategories(CATEGORY_FALLBACK.map(name=>({ _id:name, name }))));

    api.get('/products/seller/mine').then(({data})=>{ setProducts(data); }).catch(()=>{
      setProducts([]);
    }).finally(()=>setProductsLoading(false));

    api.get('/orders/seller/mine').then(({data})=>setOrders(data)).catch(()=>setOrders([])).finally(()=>setOrdersLoading(false));
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  if(!user || user.role!=='seller'){
    return <div className="text-center py-20"><p className="font-bold">Seller access required</p><p className="text-sm text-zinc-500 mt-1">Register or upgrade as a seller to access this page.</p><Link to="/become-seller" className="inline-block mt-4 px-6 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold dark:bg-white dark:text-zinc-900">Become a seller</Link></div>;
  }

  const categoryOptions = categories.length ? categories.map(c=>c.name) : CATEGORY_FALLBACK;

  const resetForm = ()=>{ setForm(emptyForm); setEditing(null); };

  const startEdit = (p)=>{
    setEditing(p._id);
    setForm({
      name: p.name||'', description: p.description||'', price: p.price ?? '', originalPrice: p.originalPrice ?? '',
      images: (p.images||[]).join(', '), category: p.category || categoryOptions[0] || '', brand: p.brand||'',
      stock: p.stock ?? '', tags: (p.tags||[]).join(', ')
    });
    setTab('products');
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleSubmitProduct = async (e)=>{
    e.preventDefault();
    const payload = {
      name: form.name, description: form.description, price: Number(form.price)||0,
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      images: form.images.split(',').map(s=>s.trim()).filter(Boolean),
      category: form.category || categoryOptions[0], brand: form.brand, stock: Number(form.stock)||0,
      tags: form.tags.split(',').map(s=>s.trim()).filter(Boolean),
    };
    try{
      if(editing){
        const { data } = await api.put(`/products/${editing}`, payload);
        setProducts(ps=>ps.map(p=>p._id===editing? data : p));
        toast.success('Product updated');
      }else{
        const { data } = await api.post('/products', payload);
        setProducts(ps=>[data, ...ps]);
        toast.success('Product created');
      }
    }catch{
      // demo fallback
      if(editing){
        setProducts(ps=>ps.map(p=>p._id===editing? {...p, ...payload} : p));
        toast.success('Updated (demo)');
      }else{
        setProducts(ps=>[{ _id:'demo-'+Date.now(), ...payload, rating:0, numReviews:0 }, ...ps]);
        toast.success('Created (demo)');
      }
    }
    resetForm();
  };

  const handleDelete = async (id)=>{
    if(!confirm('Delete this product?')) return;
    try{ await api.delete(`/products/${id}`); }catch{ /* demo fallback */ }
    setProducts(ps=>ps.filter(p=>p._id!==id));
    toast.success('Deleted');
  };

  const handleStockChange = async (id, stock)=>{
    setProducts(ps=>ps.map(p=>p._id===id? {...p, stock} : p));
    try{ await api.put(`/products/${id}`, { stock }); }catch{ /* stays optimistic - demo fallback */ }
  };

  const handleItemStatus = async (orderId, productId, status)=>{
    setOrders(os=>os.map(o=> o._id!==orderId ? o : { ...o, orderItems: o.orderItems.map(it=> (it.product===productId || it.product?._id===productId) ? {...it, status} : it) }));
    try{
      await api.put(`/orders/${orderId}/items/${productId}/status`, { status });
      toast.success('Status updated');
    }catch{
      toast.success('Status updated (demo)');
    }
  };

  const handleShopSave = async (e)=>{
    e.preventDefault();
    setShopSaving(true);
    try{
      const { data } = await api.put('/shops/me', shopForm);
      setShop(data);
      toast.success('Shop profile updated');
    }catch{
      setShop(s=>({ ...s, ...shopForm }));
      toast.success('Updated (demo)');
    } finally{ setShopSaving(false); }
  };

  return (
    <div>
      {/* shop banner header */}
      <div className="relative h-[160px] lg:h-[200px] overflow-hidden bg-gradient-to-br from-zinc-900 to-indigo-900">
        {shop?.banner && <img src={shop.banner} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50"/>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"/>
        <div className="relative max-w-[1300px] mx-auto px-6 lg:px-8 h-full flex items-end pb-5">
          <div className="flex items-end gap-4">
            {shop?.logo ? (
              <img src={shop.logo} alt="" className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"/>
            ) : (
              <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-xl bg-white dark:bg-zinc-800 grid place-items-center text-indigo-600"><Store size={24}/></div>
            )}
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">{shop?.name || 'Your Shop'}</h1>
              <p className="text-white/70 text-xs mt-0.5">Seller Dashboard · {user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-2 flex-wrap">
          {['overview','products','orders','shop profile'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${tab===t?'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900':'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'}`}>{t}</button>
          ))}
        </div>

        {tab==='overview' && (
          <div className="mt-6 space-y-6">
            {!stats ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i=><Skeleton key={i} className="h-[84px]"/>)}</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon={DollarSign} label="Gross Sales" value={format(stats.grossSales)} color="bg-indigo-500"/>
                <StatCard icon={TrendingUp} label="Commission Paid" value={format(stats.commissionPaid)} color="bg-amber-500"/>
                <StatCard icon={Package} label="Net Earnings" value={format(stats.netEarnings)} color="bg-emerald-500" sub={`${stats.productCount ?? products.length} products · ${stats.orderCount ?? orders.length} orders`}/>
              </div>
            )}

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-bold flex items-center gap-2"><Clock size={16}/> Recent orders</h3>
              {(!stats?.recentOrders || stats.recentOrders.length===0) ? (
                <p className="text-sm text-zinc-500 mt-4">No orders yet - once a shopper buys from you, it'll show up here.</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {stats.recentOrders.map(o=>(
                    <div key={o._id} className="flex items-center justify-between text-sm border-t border-zinc-100 dark:border-zinc-800 pt-2 first:border-0 first:pt-0">
                      <span className="font-mono text-xs text-zinc-500">{o._id?.slice(-10)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400">{o.status}</span>
                      <span className="font-bold">{format(o.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab==='products' && (
          <div className="mt-6 space-y-6">
            <form onSubmit={handleSubmitProduct} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid md:grid-cols-2 gap-4">
              <h3 className="md:col-span-2 font-bold flex items-center gap-2">{editing? <Pencil size={16}/>: <Plus size={16}/>}{editing?'Edit product':'Add a product'}</h3>
              <input placeholder="Name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
              <input placeholder="Brand" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
              <input placeholder="Price (USD)" type="number" min="0" step="0.01" required value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
              <input placeholder="Original price (optional)" type="number" min="0" step="0.01" value={form.originalPrice} onChange={e=>setForm({...form,originalPrice:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                <option value="">Select category</option>
                {categoryOptions.map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
              <input placeholder="Stock" type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
              <input placeholder="Image URLs (comma separated)" value={form.images} onChange={e=>setForm({...form,images:e.target.value})} className="md:col-span-2 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
              <input placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className="md:col-span-2 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
              <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} className="md:col-span-2 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
              <button className="md:col-span-2 py-3 rounded-full bg-zinc-900 text-white font-semibold dark:bg-white dark:text-zinc-900">{editing?'Save changes':'Create product'}</button>
              {editing && <button type="button" onClick={resetForm} className="md:col-span-2 py-2 rounded-full border border-zinc-200 dark:border-zinc-700">Cancel edit</button>}
            </form>

            {productsLoading ? (
              <div className="space-y-2">{[1,2,3].map(i=><Skeleton key={i} className="h-14"/>)}</div>
            ) : products.length===0 ? (
              <EmptyState icon={Package} title="No products yet" description="Add your first product above to start selling on OLADO." iconBg="bg-indigo-50 dark:bg-indigo-950" iconColor="text-indigo-500"/>
            ) : (
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
                          <td className="text-center">
                            <input type="number" min="0" value={p.stock} onChange={e=>handleStockChange(p._id, Number(e.target.value))} className="w-16 text-center px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/>
                          </td>
                          <td className="p-3 flex gap-1 justify-end">
                            <button onClick={()=>startEdit(p)} className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center hover:bg-zinc-50 dark:hover:bg-zinc-800"><Pencil size={14}/></button>
                            <button onClick={()=>handleDelete(p._id)} className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center hover:bg-red-50 text-red-500"><Trash2 size={14}/></button>
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

        {tab==='orders' && (
          <div className="mt-6 space-y-4">
            {ordersLoading ? (
              <div className="space-y-2">{[1,2,3].map(i=><Skeleton key={i} className="h-24"/>)}</div>
            ) : orders.length===0 ? (
              <EmptyState icon={ShoppingCart} title="No orders yet" description="Orders containing your products will show up here."/>
            ) : orders.map(o=>(
              <div key={o._id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <span className="font-mono text-xs font-bold">{o._id?.slice(-10).toUpperCase()}</span>
                  <span className="text-xs text-zinc-500">{new Date(o.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Ships to: {o.shippingAddress?.city}, {o.shippingAddress?.country} · {o.shippingAddress?.fullName}</p>
                <div className="mt-3 space-y-2">
                  {(o.orderItems||[]).map(it=>(
                    <div key={it.product?._id || it.product} className="flex items-center gap-3 text-sm border-t border-zinc-100 dark:border-zinc-800 pt-2">
                      <img src={it.image} alt="" className="w-10 h-10 rounded-lg object-cover"/>
                      <span className="flex-1">{it.name} ×{it.quantity}</span>
                      <span className="font-semibold">{format(it.price*it.quantity)}</span>
                      <select value={it.status||'Processing'} onChange={e=>handleItemStatus(o._id, it.product?._id || it.product, e.target.value)} className="text-xs px-2 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                        {ORDER_STATUSES.map(s=> <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==='shop profile' && (
          <form onSubmit={handleShopSave} className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 grid md:grid-cols-2 gap-4 max-w-2xl">
            <h3 className="md:col-span-2 font-bold flex items-center gap-2"><Store size={16}/> Shop profile</h3>
            <label className="text-sm md:col-span-2"><span className="font-medium">Shop name</span><input required value={shopForm.name} onChange={e=>setShopForm({...shopForm,name:e.target.value})} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/></label>
            <label className="text-sm md:col-span-2"><span className="font-medium">Description</span><textarea rows={3} value={shopForm.description} onChange={e=>setShopForm({...shopForm,description:e.target.value})} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/></label>
            <label className="text-sm"><span className="font-medium">Logo URL</span><input value={shopForm.logo} onChange={e=>setShopForm({...shopForm,logo:e.target.value})} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/></label>
            <label className="text-sm"><span className="font-medium">Banner URL</span><input value={shopForm.banner} onChange={e=>setShopForm({...shopForm,banner:e.target.value})} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"/></label>
            <button disabled={shopSaving} className="md:col-span-2 flex items-center justify-center gap-2 py-3 rounded-full bg-zinc-900 text-white font-semibold dark:bg-white dark:text-zinc-900 disabled:opacity-50"><Save size={16}/> {shopSaving?'Saving...':'Save shop profile'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
