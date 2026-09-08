import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import useWishlistStore from '../store/useWishlistStore';
import useCartStore from '../store/useCartStore';
import useCurrencyStore, { format } from '../store/useCurrencyStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ProductCard({ product }){
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const addToCart = useCartStore(s=>s.addToCart);
  useCurrencyStore(s=>s.currency); // subscribe so price re-renders on currency switch
  const wish = isWishlisted(product._id);

  return (
    <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="group bg-white dark:bg-zinc-900 rounded-[20px] border border-zinc-200/60 dark:border-zinc-800 overflow-hidden card-shadow hover:shadow-xl transition-all flex flex-col">
      <Link to={`/products/${product._id}`} className="relative aspect-[4/3] overflow-hidden bg-zinc-50 dark:bg-zinc-800">
        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        {product.originalPrice && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{Math.round((1-product.price/product.originalPrice)*100)}%</span>}
        {product.featured && <span className="absolute top-3 right-12 bg-white dark:bg-zinc-900 text-xs font-semibold px-2 py-1 rounded-full shadow">Featured</span>}
        <button onClick={(e)=>{e.preventDefault(); const added=toggleWishlist(product); toast[added?'success':''](added?'Added to wishlist':'Removed from wishlist');}} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 shadow grid place-items-center hover:scale-105 transition">
          <Heart size={16} className={wish ? 'fill-red-500 text-red-500' : 'text-zinc-500'}/>
        </button>
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition flex gap-2">
          <button onClick={(e)=>{e.preventDefault(); addToCart(product,1); toast.success('Added to cart')}} className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold py-2.5 rounded-full"><ShoppingBag size={16}/> Quick add</button>
        </div>
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-1 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">{product.category}</span>
          <span className="ml-auto flex items-center gap-1 text-amber-500 font-semibold"><Star size={12} className="fill-amber-500"/> {product.rating?.toFixed(1) || '5.0'} <span className="text-zinc-400 font-normal">({product.numReviews||0})</span></span>
        </div>
        <Link to={`/products/${product._id}`} className="mt-2 font-semibold leading-tight line-clamp-2 hover:text-indigo-600">{product.name}</Link>
        <p className="text-xs text-zinc-500 line-clamp-1 mt-1">{product.brand} · {product.stock>0? 'In stock':'Out of stock'}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-black">{format(product.price)}</span>
          {product.originalPrice && <span className="text-xs line-through text-zinc-400">{format(product.originalPrice)}</span>}
        </div>
      </div>
    </motion.div>
  )
}
