import { create } from 'zustand';

// RWF per USD - must match the backend's hardcoded rate exactly.
const RATE = 1300;

const useCurrencyStore = create((set)=>({
  currency: localStorage.getItem('olado_currency') || 'USD',
  rate: RATE,
  setCurrency: (currency)=>{
    localStorage.setItem('olado_currency', currency);
    set({ currency });
  },
}));

// Format a USD amount into the currently-selected display currency.
// Call this from inside a component that also subscribes to `currency`
// (e.g. `useCurrencyStore(s=>s.currency)`) so it re-renders on switch.
export function format(usdAmount){
  const { currency, rate } = useCurrencyStore.getState();
  const amount = Number(usdAmount) || 0;
  if(currency === 'RWF'){
    const converted = Math.round(amount * rate);
    return converted.toLocaleString('en-US') + ' RWF';
  }
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default useCurrencyStore;
