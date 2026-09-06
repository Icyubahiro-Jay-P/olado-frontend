import { create } from 'zustand';

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
  },
  removeFromCart: (id)=>{
    const newItems = get().items.filter(i=>i._id!==id);
    localStorage.setItem('olado_cart', JSON.stringify(newItems));
    set({ items: newItems });
  },
  updateQuantity: (id, qty)=>{
    if(qty<=0) return get().removeFromCart(id);
    const newItems = get().items.map(i=> i._id===id ? {...i, quantity: qty} : i);
    localStorage.setItem('olado_cart', JSON.stringify(newItems));
    set({ items: newItems });
  },
  clearCart: ()=>{
    localStorage.removeItem('olado_cart');
    set({ items: [] });
  },
  getTotal: ()=>{
    const items = get().items;
    const subtotal = items.reduce((a,b)=>a+b.price*b.quantity,0);
    const shipping = get().shippingMethod==='Express' ? 19 : (subtotal>100 ? 0 : 9);
    const tax = subtotal*0.08;
    return { subtotal, shipping, tax, total: subtotal+shipping+tax, count: items.reduce((a,b)=>a+b.quantity,0) };
  }
}));

export default useCartStore;
