import { create } from 'zustand';

const useAuthStore = create((set, get)=>({
  user: JSON.parse(localStorage.getItem('olado_user') || 'null'),
  token: localStorage.getItem('olado_token') || null,
  setAuth: (user, token)=>{
    localStorage.setItem('olado_user', JSON.stringify(user));
    localStorage.setItem('olado_token', token);
    set({ user, token });
  },
  logout: ()=>{
    localStorage.removeItem('olado_user');
    localStorage.removeItem('olado_token');
    set({ user:null, token:null });
  },
  isAdmin: ()=> get().user?.role === 'admin',
}));

export default useAuthStore;
