import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q:'How long does shipping take?', a:'Standard shipping takes 3–5 business days within the US and 7–14 days internationally. Express shipping delivers within 24 hours in supported regions (US, EU, UK, Japan). You will receive a tracking number as soon as your order ships.'},
  { q:'What is your return & refund policy?', a:'We offer 30-day hassle-free returns. Items must be unused and in original packaging. Refunds are processed within 3–5 business days after we receive the return. Return shipping is free for defective items.'},
  { q:'Do you ship internationally?', a:'Yes! We ship to over 80 countries. International shipping costs and delivery times vary by destination and are calculated at checkout. Duties and taxes may apply depending on your country.'},
  { q:'How can I track my order?', a:'Once your order ships, you will receive an email with a tracking number and link. You can also track your order from your profile → Order History. Contact support if your tracking does not update within 48 hours.'},
  { q:'What payment methods are accepted?', a:'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, Apple Pay and Google Pay. This demo uses a simulated payment flow - no real charges are made.'},
  { q:'Is my data secure?', a:'Absolutely. We use 256-bit SSL encryption, bcrypt password hashing, and JWT authentication. We never store full card numbers. This demo is for presentation purposes only.'},
  { q:'Can I cancel or change my order after placing it?', a:'You can cancel or modify your order within 1 hour of placing it from your Order History, as long as it has not entered “Shipped” status. After that, please initiate a return after delivery.'},
  { q:'Do you offer any discounts or loyalty program?', a:'Yes! New customers get 20% off with code WELCOME20. We also run seasonal sales and a loyalty program where you earn points on every purchase. Subscribe to our newsletter to be first to know.'},
];

export default function FAQ(){
  const [open, setOpen] = useState(0);
  return (
    <div className="max-w-[800px] mx-auto px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black tracking-tight">Frequently Asked Questions</h1>
      <p className="text-sm text-zinc-500 mt-2">Everything you need to know about shipping, returns, payments and more.</p>
      <div className="mt-8 space-y-3">
        {faqs.map((f,i)=>(
          <div key={f.q} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <button onClick={()=>setOpen(open===i? -1 : i)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="font-semibold pr-4">{f.q}</span>
              <span className={`w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center shrink-0 transition ${open===i?'rotate-180':''}`}><ChevronDown size={16}/></span>
            </button>
            {open===i && <div className="px-5 pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{f.a}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
