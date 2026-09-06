import { useState } from 'react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Check, CreditCard, Truck, User, MapPin } from 'lucide-react';

const steps = ['Cart Review','Shipping Information','Shipping Method','Payment','Confirmation'];

export default function Checkout(){
  const { items, getTotal, clearCart, shippingMethod, setShipping } = useCartStore();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { subtotal, shipping, tax, total } = getTotal();
  const [form, setForm] = useState({ fullName: user?.name||'', address:'', city:'', postalCode:'', country:'USA', phone:'' });
  const [pay, setPay] = useState({ card:'4242 4242 4242 4242', expiry:'12/28', cvv:'123', name: user?.name||'' });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  if(items.length===0 && !orderId) return <div className="text-center py-20"><p className="font-semibold">Cart empty</p><Link to="/products" className="text-indigo-600 underline">Shop now</Link></div>;

  const next = ()=> setStep(s=> Math.min(s+1,5));
  const placeOrder = async () =>{
    if(!token) { toast.error('Please login first'); navigate('/login'); return; }
    setLoading(true);
    try{
      const payload = {
        orderItems: items.map(i=>({ product: i._id, name:i.name, image: i.image||i.images?.[0], price:i.price, quantity: i.quantity })),
        shippingAddress: form, shippingMethod, shippingPrice: shipping, itemsPrice: subtotal, totalPrice: total, paymentMethod: 'Card (Demo)'
      };
      const { data } = await api.post('/orders', payload);
      setOrderId(data._id);
      setStep(5);
      clearCart();
      toast.success('Order placed!');
    }catch(err){
      // demo fallback - simulate success
      const fakeId = 'DEMO-' + Math.random().toString(36).slice(2,9).toUpperCase();
      setOrderId(fakeId);
      setStep(5);
      clearCart();
      toast.success('Order placed (demo mode)');
    } finally{ setLoading(false); }
  };

  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-8 py-8">
      {/* stepper */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((s,i)=>(
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold ${i+1<step?'bg-emerald-500 text-white': i+1===step?'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900':'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>{i+1<step? <Check size={16}/> : i+1}</div>
            <span className={`text-xs font-semibold hidden sm:block ${i+1===step?'text-zinc-900 dark:text-white':'text-zinc-500'}`}>{s}</span>
            {i<4 && <div className={`w-6 sm:w-12 h-0.5 ${i+1<step?'bg-emerald-500':'bg-zinc-200 dark:bg-zinc-800'}`}/>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8">
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 p-6">
          {step===1 && (
            <div>
              <h2 className="text-xl font-black flex items-center gap-2"><ShoppingIcon/> Cart Review</h2>
              <div className="mt-6 space-y-3">
                {items.map(i=>(
                  <div key={i._id} className="flex gap-3 items-center border border-zinc-100 dark:border-zinc-800 rounded-xl p-3">
                    <img src={i.image||i.images?.[0]} className="w-16 h-16 rounded-lg object-cover" alt=""/>
                    <div className="flex-1"><p className="text-sm font-semibold">{i.name}</p><p className="text-xs text-zinc-500">Qty {i.quantity} · ${i.price}</p></div>
                    <span className="font-bold text-sm">${(i.price*i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <button onClick={next} className="w-full mt-6 py-3 rounded-full bg-zinc-900 text-white font-semibold dark:bg-white dark:text-zinc-900">Continue to shipping</button>
            </div>
          )}
          {step===2 && (
            <div>
              <h2 className="text-xl font-black flex items-center gap-2"><MapPin size={18}/> Shipping Information</h2>
              <div className="grid gap-3 mt-6">
                {[
                  ['fullName','Full Name'],['address','Street Address'],['city','City'],['postalCode','Postal Code'],['country','Country'],['phone','Phone']
                ].map(([k,label])=>(
                  <label key={k} className="text-sm"><span className="font-medium">{label} *</span><input required value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></label>
                ))}
              </div>
              <div className="flex gap-3 mt-6"><button onClick={()=>setStep(1)} className="flex-1 py-3 rounded-full border border-zinc-200 dark:border-zinc-700 font-semibold">Back</button><button onClick={()=>{ if(!form.address||!form.city) return toast.error('Fill address'); next();}} className="flex-1 py-3 rounded-full bg-zinc-900 text-white font-semibold dark:bg-white dark:text-zinc-900">Continue</button></div>
            </div>
          )}
          {step===3 && (
            <div>
              <h2 className="text-xl font-black flex items-center gap-2"><Truck size={18}/> Shipping Method</h2>
              <div className="mt-6 space-y-3">
                <label onClick={()=>setShipping('Standard')} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer ${shippingMethod==='Standard'?'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800':'border-zinc-200 dark:border-zinc-700'}`}>
                  <input type="radio" checked={shippingMethod==='Standard'} readOnly/>
                  <div className="flex-1"><p className="font-semibold text-sm">Standard Delivery</p><p className="text-xs text-zinc-500">3–5 business days · Free over $100</p></div>
                  <span className="font-bold">{subtotal>100?'Free':'$9.00'}</span>
                </label>
                <label onClick={()=>setShipping('Express')} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer ${shippingMethod==='Express'?'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800':'border-zinc-200 dark:border-zinc-700'}`}>
                  <input type="radio" checked={shippingMethod==='Express'} readOnly/>
                  <div className="flex-1"><p className="font-semibold text-sm">Express Delivery</p><p className="text-xs text-zinc-500">24 hours · Priority handling</p></div>
                  <span className="font-bold">$19.00</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6"><button onClick={()=>setStep(2)} className="flex-1 py-3 rounded-full border font-semibold">Back</button><button onClick={next} className="flex-1 py-3 rounded-full bg-zinc-900 text-white font-semibold dark:bg-white dark:text-zinc-900">Continue to payment</button></div>
            </div>
          )}
          {step===4 && (
            <div>
              <h2 className="text-xl font-black flex items-center gap-2"><CreditCard size={18}/> Payment (Demo)</h2>
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mt-3">Demo simulation - no real payment. Use any test card.</p>
              <div className="grid gap-3 mt-6">
                <label className="text-sm"><span className="font-medium">Card number</span><input value={pay.card} onChange={e=>setPay({...pay,card:e.target.value})} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"/></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm"><span className="font-medium">Expiry</span><input value={pay.expiry} onChange={e=>setPay({...pay,expiry:e.target.value})} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"/></label>
                  <label className="text-sm"><span className="font-medium">CVV</span><input value={pay.cvv} onChange={e=>setPay({...pay,cvv:e.target.value})} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"/></label>
                </div>
                <label className="text-sm"><span className="font-medium">Name on card</span><input value={pay.name} onChange={e=>setPay({...pay,name:e.target.value})} className="mt-1 w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"/></label>
              </div>
              <div className="flex gap-3 mt-6"><button onClick={()=>setStep(3)} className="flex-1 py-3 rounded-full border font-semibold">Back</button><button onClick={placeOrder} disabled={loading} className="flex-1 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50">{loading?'Processing...':'Pay $'+total.toFixed(2)}</button></div>
            </div>
          )}
          {step===5 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white grid place-items-center mx-auto"><Check size={28}/></div>
              <h2 className="text-2xl font-black mt-4">Order confirmed!</h2>
              <p className="text-sm text-zinc-500 mt-2">Order ID: <span className="font-mono font-bold text-zinc-900 dark:text-white">{orderId}</span></p>
              <p className="text-sm text-zinc-500 mt-1">A confirmation email has been sent (demo).</p>
              <div className="flex gap-3 mt-8 justify-center">
                <Link to="/products" className="px-6 py-3 rounded-full bg-zinc-900 text-white font-semibold dark:bg-white dark:text-zinc-900">Continue shopping</Link>
                <Link to="/profile" className="px-6 py-3 rounded-full border font-semibold">View orders</Link>
              </div>
            </div>
          )}
        </div>

        {/* summary */}
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 p-6 h-fit sticky top-[90px]">
          <h3 className="font-bold">Order summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Shipping ({shippingMethod})</span><span>${shipping.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-black text-base border-t pt-3 mt-3"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <p className="text-xs text-zinc-400 mt-4 text-center">🔒 Encrypted · 30-day returns</p>
        </div>
      </div>
    </div>
  )
}
function ShoppingIcon(){ return <span className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 grid place-items-center text-xs">1</span> }
