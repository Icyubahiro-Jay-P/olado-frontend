import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { demoProducts } from '../utils/demoProducts';
import useCartStore from '../store/useCartStore';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { Heart, Star, Minus, Plus, ShoppingBag, ShieldCheck, Truck, RotateCcw, ChevronLeft } from 'lucide-react';

export default function ProductDetail(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating:5, comment:'' });
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore(s=>s.addToCart);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { user, token } = useAuthStore();

  useEffect(()=>{
    api.get(`/products/${id}`).then(r=>setProduct(r.data)).catch(()=>{
      const found = demoProducts.find(p=>p._id===id);
      if(found) setProduct(found);
    }).finally(()=>setLoading(false));
  },[id]);

  const submitReview = async (e)=>{
    e.preventDefault();
    if(!token) return toast.error('Please login to review');
    try{
      const { data } = await api.post(`/products/${id}/reviews`, reviewForm);
      toast.success('Review added!');
      setProduct(p=> ({...p, reviews: data.reviews, numReviews: data.reviews.length, rating: data.reviews.reduce((a,b)=>a+b.rating,0)/data.reviews.length }));
      setReviewForm({ rating:5, comment:'' });
    }catch(err){
      toast.error(err.response?.data?.message || 'Failed to review');
    }
  };

  if(loading) return <div className="max-w-[1300px] mx-auto px-6 py-20"><div className="h-[500px] bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-3xl"/></div>;
  if(!product) return <div className="text-center py-20">Product not found. <Link to="/products" className="text-indigo-600 underline">Go back</Link></div>;

  const wish = isWishlisted(product._id);

  return (
    <div className="max-w-[1300px] mx-auto px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><ChevronLeft size={16}/> Back to products</Link>

      <div className="grid lg:grid-cols-2 gap-10 mt-6">
        {/* images */}
        <div>
          <div className="aspect-square rounded-[24px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <img src={product.images?.[activeImg] || product.images?.[0]} alt={product.name} className="w-full h-full object-cover"/>
          </div>
          <div className="flex gap-3 mt-4">
            {(product.images || []).map((img,i)=>(
              <button key={i} onClick={()=>setActiveImg(i)} className={`w-20 h-20 rounded-2xl overflow-hidden border-2 ${i===activeImg?'border-zinc-900 dark:border-white':'border-transparent'}`}>
                <img src={img} alt="" className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <span className="inline-block text-xs font-semibold tracking-widest px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600">{product.category} · {product.brand}</span>
          <h1 className="text-3xl font-black tracking-tight mt-3">{product.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-amber-500 font-bold"><Star size={16} className="fill-amber-500"/>{product.rating?.toFixed(1)} </span>
            <span className="text-sm text-zinc-500">({product.numReviews} reviews)</span>
            <span className={`ml-2 text-xs px-2.5 py-1 rounded-full font-semibold ${product.stock>0?'bg-emerald-50 text-emerald-700 dark:bg-emerald-950':'bg-red-50 text-red-600'}`}>{product.stock>0?`In stock (${product.stock})`:'Out of stock'}</span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">{product.description}</p>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-3xl font-black">${product.price}</span>
            {product.originalPrice && <><span className="text-lg line-through text-zinc-400">${product.originalPrice}</span><span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Save ${(product.originalPrice-product.price).toFixed(0)}</span></>}
          </div>

          {/* qty + cart */}
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full p-1">
              <button onClick={()=>setQty(Math.max(1, qty-1))} className="w-9 h-9 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 grid place-items-center"><Minus size={16}/></button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button onClick={()=>setQty(Math.min(product.stock, qty+1))} className="w-9 h-9 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 grid place-items-center"><Plus size={16}/></button>
            </div>
            <button onClick={()=>{addToCart(product,qty); toast.success('Added to cart');}} disabled={product.stock===0} className="flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3.5 rounded-full bg-zinc-900 text-white font-semibold hover:bg-black dark:bg-white dark:text-zinc-900 disabled:opacity-50"><ShoppingBag size={18}/> Add to Cart</button>
            <button onClick={()=>{ const added=toggleWishlist(product); toast[added?'success':''](added?'Added to wishlist':'Removed');}} className={`w-12 h-12 rounded-full border grid place-items-center ${wish?'bg-red-50 border-red-200 text-red-500 dark:bg-red-950':'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'}`}><Heart size={18} className={wish?'fill-red-500':''}/></button>
          </div>

          {/* trust */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              {icon:Truck, t:'Free shipping', d:'Over $100'},
              {icon:ShieldCheck, t:'2-year warranty', d:'Secure payment'},
              {icon:RotateCcw, t:'30-day returns', d:'Hassle-free'},
            ].map(x=>(
              <div key={x.t} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 text-center">
                <x.icon size={18} className="mx-auto text-indigo-600"/>
                <p className="text-xs font-semibold mt-1">{x.t}</p><p className="text-[11px] text-zinc-500">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* reviews */}
      <section className="mt-14 bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 p-6 lg:p-8">
        <div className="flex flex-wrap gap-6 items-start justify-between">
          <div>
            <h3 className="text-xl font-black">Customer Reviews</h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-4xl font-black">{product.rating?.toFixed(1) || '5.0'}</span>
              <div>
                <div className="flex text-amber-500">{[1,2,3,4,5].map(i=> <Star key={i} size={16} className={i<=Math.round(product.rating||5)?'fill-amber-500':'text-zinc-300'}/>)}</div>
                <p className="text-xs text-zinc-500">{product.numReviews} reviews</p>
              </div>
            </div>
          </div>
          {/* review form */}
          <form onSubmit={submitReview} className="w-full lg:w-[420px] bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-5">
            <h4 className="font-semibold text-sm">Write a review</h4>
            {!token && <p className="text-xs text-amber-600 mt-1">Please <Link to="/login" className="underline">login</Link> to review. Demo: demo@olado.com / demo123</p>}
            <div className="flex gap-1 mt-3">
              {[1,2,3,4,5].map(n=>(
                <button type="button" key={n} onClick={()=>setReviewForm({...reviewForm, rating:n})} className={`w-8 h-8 rounded-full grid place-items-center ${reviewForm.rating>=n?'bg-amber-400 text-white':'bg-white dark:bg-zinc-700 border'}`}><Star size={14} className={reviewForm.rating>=n?'fill-white':''}/></button>
              ))}
            </div>
            <textarea required value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm, comment:e.target.value})} placeholder="Share your experience..." rows={3} className="mt-3 w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            <button disabled={!token} className="mt-3 w-full py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold hover:bg-black dark:bg-white dark:text-zinc-900 disabled:opacity-50">Submit review</button>
          </form>
        </div>

        <div className="mt-8 space-y-4">
          {(product.reviews||[]).length===0 ? <p className="text-sm text-zinc-500 text-center py-8">No reviews yet - be the first!</p> : product.reviews.map(r=>(
            <div key={r._id} className="border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 flex gap-3">
              <img src={`https://i.pravatar.cc/100?u=${r.name}`} alt="" className="w-9 h-9 rounded-full"/>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{r.name}</span>
                  <span className="flex text-amber-500">{[1,2,3,4,5].map(i=> <Star key={i} size={12} className={i<=r.rating?'fill-amber-500':'text-zinc-300'}/>)}</span>
                  <span className="ml-auto text-xs text-zinc-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
