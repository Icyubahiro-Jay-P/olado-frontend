export default function StatCard({ icon:Icon, label, value, color='bg-indigo-500', sub }){
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 flex items-center gap-4 card-shadow">
      <div className={`w-10 h-10 rounded-xl ${color} text-white grid place-items-center shrink-0`}><Icon size={18}/></div>
      <div className="min-w-0">
        <p className="text-2xl font-black truncate">{value}</p>
        <p className="text-xs text-zinc-500">{label}</p>
        {sub && <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
