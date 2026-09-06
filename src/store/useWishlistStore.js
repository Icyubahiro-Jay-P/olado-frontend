import { create } from 'zustand';

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
    return !exists;
  },
  remove: (id)=>{
    const newItems = get().items.filter(i=>i._id!==id);
    localStorage.setItem('olado_wishlist', JSON.stringify(newItems));
    set({ items: newItems });
  },
  isWishlisted: (id)=> get().items.some(i=>i._id===id),
}));

export default useWishlistStore;
