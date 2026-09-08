import { Link } from 'react-router-dom';
import useWishlistStore from '../store/useWishlistStore';
import useCartStore from '../store/useCartStore';
import useCurrencyStore, { format } from '../store/useCurrencyStore';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function Wishlist(){
  const { items, remove } = useWishlistStore();
  const addToCart = useCartStore(s=>s.addToCart);
  useCurrencyStore(s=>s.currency); // subscribe so prices re-render on currency switch

  if(items.length===0){
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it here."
        ctaText="Explore products"
        ctaTo="/products"
        iconBg="bg-red-50 dark:bg-red-950"
        iconColor="text-red-400"
      />
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-black tracking-tight">Wishlist <span className="text-zinc-400 font-normal text-lg">({items.length})</span></h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {items.map(p=>(
          <div key={p._id} className="bg-white dark:bg-zinc-900 rounded-[20px] border border-zinc-200 dark:border-zinc-800 overflow-hidden card-shadow flex flex-col">
            <Link to={`/products/${p._id}`} className="aspect-[4/3] overflow-hidden bg-zinc-50 dark:bg-zinc-800">
              <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition"/>
            </Link>
            <div className="p-4 flex-1 flex flex-col">
              <Link to={`/products/${p._id}`} className="font-semibold line-clamp-2 hover:text-indigo-600">{p.name}</Link>
              <p className="text-sm font-black mt-2">{format(p.price)}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={()=>{addToCart(p,1); toast.success('Moved to cart');}} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold dark:bg-white dark:text-zinc-900"><ShoppingBag size={14}/> Move to cart</button>
                <button onClick={()=>remove(p._id)} className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 grid place-items-center hover:bg-red-50 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
