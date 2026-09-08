import { create } from 'zustand';
import api from '../api/axios';
import useAuthStore from './useAuthStore';

// Fire-and-forget account sync - never blocks or throws into the UI.
const syncCart = (items)=>{
  const token = useAuthStore.getState().token;
  if(!token) return;
  api.put('/users/cart', { items: items.map(i=>({ product: i._id, quantity: i.quantity })) }).catch(()=>{});
};

const useCartStore = create((set, get)=>({
  items: JSON.parse(localStorage.getItem('olado_cart') || '[]'),
  shippingMethod: localStorage.getItem('olado_shipping') || 'Standard',
  setShipping: (method)=>{
    localStorage.setItem('olado_shipping', method);
    set({ shippingMethod: method });
  },
  addToCart: (product, qty=1)=>{
    const items = get().items;
    const existing = items.find(i=>i._id===product._id);
    let newItems;
    if(existing){
      newItems = items.map(i=> i._id===product._id ? {...i, quantity: Math.min(i.quantity+qty, product.stock)} : i);
    }else{
      newItems = [...items, {...product, quantity: qty, image: product.images?.[0]}];
    }
    localStorage.setItem('olado_cart', JSON.stringify(newItems));
    set({ items: newItems });
    syncCart(newItems);
  },
  removeFromCart: (id)=>{
    const newItems = get().items.filter(i=>i._id!==id);
    localStorage.setItem('olado_cart', JSON.stringify(newItems));
    set({ items: newItems });
    syncCart(newItems);
  },
  updateQuantity: (id, qty)=>{
    if(qty<=0) return get().removeFromCart(id);
    const newItems = get().items.map(i=> i._id===id ? {...i, quantity: qty} : i);
    localStorage.setItem('olado_cart', JSON.stringify(newItems));
    set({ items: newItems });
    syncCart(newItems);
  },
  clearCart: ()=>{
    localStorage.removeItem('olado_cart');
    set({ items: [] });
    syncCart([]);
  },
  getTotal: ()=>{
    const items = get().items;
    const subtotal = items.reduce((a,b)=>a+b.price*b.quantity,0);
    const shipping = get().shippingMethod==='Express' ? 19 : (subtotal>100 ? 0 : 9);
    const tax = subtotal*0.08;
    return { subtotal, shipping, tax, total: subtotal+shipping+tax, count: items.reduce((a,b)=>a+b.quantity,0) };
  },
  // Pull the account's saved cart (GET /users/me), merge it with whatever is
  // already in local state (union by product id, summing quantities where an
  // id exists on both sides), persist the merge, then push it back up so
  // both sides reconcile. Silently no-ops on any failure - demo-resilience.
  hydrateFromAccount: async ()=>{
    try{
      const token = useAuthStore.getState().token;
      if(!token) return;
      const { data } = await api.get('/users/me');
      const accountCart = Array.isArray(data?.cart) ? data.cart : [];
      const merged = [...get().items];
      accountCart.forEach(entry=>{
        const prod = entry?.product;
        const pid = (prod && typeof prod === 'object') ? prod._id : prod;
        if(!pid) return;
        const qty = entry.quantity || 1;
        const idx = merged.findIndex(i=>i._id===pid);
        if(idx>=0){
          merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + qty };
        } else if(prod && typeof prod === 'object'){
          merged.push({ ...prod, quantity: qty, image: prod.images?.[0] });
        }
      });
      localStorage.setItem('olado_cart', JSON.stringify(merged));
      set({ items: merged });
      syncCart(merged);
    }catch{
      // offline / backend down - keep whatever is already in local state
    }
  }
}));

export default useCartStore;
