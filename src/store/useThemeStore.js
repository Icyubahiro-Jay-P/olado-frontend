import { create } from 'zustand';

const useThemeStore = create((set)=>({
  dark: localStorage.getItem('olado_theme')==='dark' || (!localStorage.getItem('olado_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  toggle: ()=> set(s=>{
    const dark = !s.dark;
    localStorage.setItem('olado_theme', dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', dark);
    return { dark };
  }),
  init: ()=>{
    const dark = localStorage.getItem('olado_theme')==='dark' || (!localStorage.getItem('olado_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    set({ dark });
  }
}));

export default useThemeStore;
