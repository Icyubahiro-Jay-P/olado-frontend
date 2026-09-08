import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, MessageCircle, Mail } from 'lucide-react';

const team = [
  { name:'Amara Uwase', role:'Founder & CEO', bio:'Ex-fintech operator turned marketplace builder. Obsessed with making cross-border commerce feel effortless for African sellers.', img:'https://i.pravatar.cc/400?img=32' },
  { name:'Jean-Paul Habimana', role:'Head of Product', bio:'Designs the flows that get sellers from signup to first sale in minutes. Believes the best interface is the one you forget you\'re using.', img:'https://i.pravatar.cc/400?img=12' },
  { name:'Grace Mutesi', role:'Lead Engineer', bio:'Keeps OLADO fast and boring in the best way. Previously scaled payments infrastructure across three currencies.', img:'https://i.pravatar.cc/400?img=47' },
  { name:'David Nshimiyimana', role:'Head of Partnerships', bio:'Spends his days onboarding shops and negotiating shipping rates so sellers don\'t have to. Coffee-powered.', img:'https://i.pravatar.cc/400?img=51' },
  { name:'Liliane Ingabire', role:'Customer Success Lead', bio:'The voice behind every "how do I..." email. Turns confused first-time sellers into confident repeat ones.', img:'https://i.pravatar.cc/400?img=45' },
  { name:'Eric Bizimana', role:'Growth & Marketing', bio:'Tells the OLADO story across channels and makes sure the right shoppers find the right shops.', img:'https://i.pravatar.cc/400?img=14' },
];

export default function Team(){
  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-14">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block text-xs font-bold tracking-widest px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600">THE PEOPLE BEHIND OLADO</span>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight mt-4">Small team, <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">big marketplace.</span></h1>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">We're a handful of builders based in Kigali, working with sellers across the continent. Every name below is fictional - this is a demo team for a demo marketplace - but the roles are exactly what a real one would need.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
        {team.map((m,i)=>(
          <motion.div
            key={m.name}
            initial={{ opacity:0, y:16 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:'-40px' }}
            transition={{ duration:0.4, delay:(i%3)*0.08 }}
            className="group bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200/60 dark:border-zinc-800 overflow-hidden card-shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg">{m.name}</h3>
              <p className="text-xs font-semibold text-indigo-600 mt-0.5">{m.role}</p>
              <p className="text-sm text-zinc-500 mt-3 leading-relaxed">{m.bio}</p>
              <div className="flex gap-2 mt-4">
                <span className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-zinc-400"><Briefcase size={14}/></span>
                <span className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-zinc-400"><MessageCircle size={14}/></span>
                <span className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-zinc-400"><Mail size={14}/></span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 rounded-[28px] bg-gradient-to-br from-zinc-900 to-indigo-900 text-white p-8 lg:p-12 text-center">
        <h3 className="text-2xl lg:text-3xl font-black">Want to sell alongside us?</h3>
        <p className="text-white/70 mt-2 max-w-md mx-auto">Open a shop on OLADO in minutes - no fees to join, auto-approved for demo purposes.</p>
        <Link to="/become-seller" className="inline-block mt-6 px-7 py-3 rounded-full bg-white text-zinc-900 font-semibold">Become a seller</Link>
      </div>
    </div>
  )
}
