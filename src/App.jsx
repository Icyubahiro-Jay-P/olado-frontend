import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import FAQ from './pages/FAQ';
import About from './pages/About';
import useAuthStore from './store/useAuthStore';

function Protected({ children }){
  const token = useAuthStore(s=>s.token);
  if(!token) return <Navigate to="/login" replace/>;
  return children;
}
function AdminRoute({ children }){
  const { user, token } = useAuthStore();
  if(!token) return <Navigate to="/login" replace/>;
  if(user?.role!=='admin') return <div className="text-center py-20">Admin only. Login as admin@olado.com / admin123</div>;
  return children;
}

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#fcfcfd] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <Navbar/>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/products" element={<Products/>}/>
            <Route path="/products/:id" element={<ProductDetail/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/wishlist" element={<Wishlist/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
            <Route path="/login" element={<Auth mode="login"/>}/>
            <Route path="/register" element={<Auth mode="register"/>}/>
            <Route path="/profile" element={<Protected><Profile/></Protected>}/>
            <Route path="/admin" element={<AdminRoute><Admin/></AdminRoute>}/>
            <Route path="/faq" element={<FAQ/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="*" element={<div className="text-center py-20"><h2 className="text-2xl font-black">404 - Not found</h2><p className="text-zinc-500">Go back <a href="/" className="text-indigo-600 underline">home</a></p></div>}/>
          </Routes>
        </main>
        <Footer/>
        <Toaster position="bottom-right" toastOptions={{ style:{ borderRadius:'999px', background:'#18181b', color:'#fff', fontSize:'13px' }}}/>
      </div>
    </BrowserRouter>
  )
}
