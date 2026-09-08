import useCurrencyStore from '../store/useCurrencyStore';

export default function CurrencySwitcher({ className='' }){
  const { currency, setCurrency } = useCurrencyStore();
  return (
    <div className={`flex items-center rounded-full bg-zinc-100 dark:bg-zinc-900 p-0.5 text-xs font-bold ${className}`} role="group" aria-label="Currency">
      {['USD','RWF'].map(c=>(
        <button
          key={c}
          type="button"
          onClick={()=>setCurrency(c)}
          aria-pressed={currency===c}
          className={`px-2.5 py-1.5 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${currency===c ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
        >{c}</button>
      ))}
    </div>
  )
}
