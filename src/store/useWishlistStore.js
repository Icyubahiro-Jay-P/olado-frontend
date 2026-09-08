import { create } from 'zustand';
import api from '../api/axios';
import useAuthStore from './useAuthStore';

// Fire-and-forget account sync - never blocks or throws into the UI.
const syncWishlist = (items)=>{
  const token = useAuthStore.getState().token;
  if(!token) return;
  api.put('/users/wishlist', { productIds: items.map(i=>i._id) }).catch(()=>{});
};

const useWishlistStore = create((set,get)=>({
  items: JSON.parse(localStorage.getItem('olado_wishlist') || '[]'),
  toggleWishlist: (product)=>{
    const items = get().items;
    const exists = items.find(i=>i._id===product._id);
    let newItems;
    if(exists) newItems = items.filter(i=>i._id!==product._id);
    else newItems = [...items, product];
    localStorage.setItem('olado_wishlist', JSON.stringify(newItems));
    set({ items: newItems });
    syncWishlist(newItems);
    return !exists;
  },
  remove: (id)=>{
    const newItems = get().items.filter(i=>i._id!==id);
    localStorage.setItem('olado_wishlist', JSON.stringify(newItems));
    set({ items: newItems });
    syncWishlist(newItems);
  },
  isWishlisted: (id)=> get().items.some(i=>i._id===id),
  // Pull the account's saved wishlist (GET /users/me), union it with local
  // state by product id, persist the merge, then push it back up. Silently
  // no-ops on any failure - demo-resilience.
  hydrateFromAccount: async ()=>{
    try{
      const token = useAuthStore.getState().token;
      if(!token) return;
      const { data } = await api.get('/users/me');
      const accountWishlist = Array.isArray(data?.wishlist) ? data.wishlist : [];
      const merged = [...get().items];
      accountWishlist.forEach(p=>{
        const pid = (p && typeof p === 'object') ? p._id : p;
        if(!pid) return;
        if(!merged.find(i=>i._id===pid) && p && typeof p === 'object'){
          merged.push(p);
        }
      });
      localStorage.setItem('olado_wishlist', JSON.stringify(merged));
      set({ items: merged });
      syncWishlist(merged);
    }catch{
      // offline / backend down - keep whatever is already in local state
    }
  }
}));

export default useWishlistStore;
