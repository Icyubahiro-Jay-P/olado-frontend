import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useCurrencyStore, { format } from '../store/useCurrencyStore';
import EmptyState from '../components/ui/EmptyState';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart(){
  const { items, updateQuantity, removeFromCart, getTotal, setShipping, shippingMethod } = useCartStore();
  useCurrencyStore(s=>s.currency); // subscribe so prices re-render on currency switch
  const { subtotal, tax, total, count } = getTotal();
  const navigate = useNavigate();

  if(items.length===0){
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Add some products to get started. Free shipping over $100!"
        ctaText="Browse products"
        ctaTo="/products"
      />
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-black tracking-tight">Shopping Cart <span className="text-zinc-400 font-normal text-lg">({count} items)</span></h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8">
        <div className="space-y-4">
          {items.map(item=>(
            <div key={item._id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex gap-4">
              <Link to={`/products/${item._id}`}><img src={item.image || item.images?.[0]} alt={item.name} className="w-24 h-24 rounded-xl object-cover"/></Link>
              <div className="flex-1">
                <Link to={`/products/${item._id}`} className="font-semibold hover:text-indigo-600 line-clamp-1">{item.name}</Link>
                <p className="text-xs text-zinc-500">{item.category} · {format(item.price)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={()=>updateQuantity(item._id, item.quantity-1)} className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center hover:bg-zinc-50"><Minus size={14}/></button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button onClick={()=>updateQuantity(item._id, item.quantity+1)} className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center hover:bg-zinc-50"><Plus size={14}/></button>
                  <button onClick={()=>removeFromCart(item._id)} className="ml-auto text-xs text-red-500 hover:text-red-600 flex items-center gap-1"><Trash2 size={14}/> Remove</button>
                </div>
              </div>
              <span className="font-black">{format(item.price*item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 p-6 h-fit sticky top-[90px]">
          <h3 className="font-bold">Order summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span className="font-semibold">{format(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Tax (8%)</span><span className="font-semibold">{format(tax)}</span></div>
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <p className="font-semibold text-sm mb-2">Shipping</p>
              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${shippingMethod==='Standard'?'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800':'border-zinc-200 dark:border-zinc-700'}`}>
                <input type="radio" checked={shippingMethod==='Standard'} onChange={()=>setShipping('Standard')} className="accent-zinc-900"/>
                <span className="flex-1 text-sm"><b>Standard</b> <span className="text-zinc-500">3–5 days</span></span>
                <span className="text-sm font-bold">{subtotal>100?'Free':format(9)}</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer mt-2 ${shippingMethod==='Express'?'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800':'border-zinc-200 dark:border-zinc-700'}`}>
                <input type="radio" checked={shippingMethod==='Express'} onChange={()=>setShipping('Express')} className="accent-zinc-900"/>
                <span className="flex-1 text-sm"><b>Express</b> <span className="text-zinc-500">24 hours</span></span>
                <span className="text-sm font-bold">{format(19)}</span>
              </label>
            </div>
            <div className="flex justify-between text-base font-black border-t border-zinc-100 dark:border-zinc-800 pt-3"><span>Total</span><span>{format(total)}</span></div>
          </div>
          <button onClick={()=>navigate('/checkout')} className="w-full mt-6 py-3.5 rounded-full bg-zinc-900 text-white font-semibold hover:bg-black dark:bg-white dark:text-zinc-900 flex items-center justify-center gap-2">Proceed to checkout <ArrowRight size={16}/></button>
          <Link to="/products" className="block text-center mt-3 text-sm text-zinc-500 hover:text-zinc-900">Continue shopping</Link>
          <p className="text-xs text-center text-zinc-400 mt-4">🔒 Secure checkout · 30-day returns</p>
        </div>
      </div>
    </div>
  )
}
