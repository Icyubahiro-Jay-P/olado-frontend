import { Link } from 'react-router-dom';

export default function EmptyState({ icon:Icon, title, description, ctaText, ctaTo, ctaOnClick, iconBg='bg-zinc-100 dark:bg-zinc-900', iconColor='text-zinc-400', className='' }){
  return (
    <div className={`max-w-[700px] mx-auto px-6 py-20 text-center ${className}`}>
      {Icon && (
        <div className={`w-20 h-20 rounded-full ${iconBg} grid place-items-center mx-auto`}>
          <Icon size={28} className={iconColor}/>
        </div>
      )}
      <h2 className="text-2xl font-black mt-6">{title}</h2>
      {description && <p className="text-sm text-zinc-500 mt-2">{description}</p>}
      {ctaText && (
        ctaTo ? (
          <Link to={ctaTo} className="inline-block mt-6 px-7 py-3 rounded-full bg-zinc-900 text-white font-semibold dark:bg-white dark:text-zinc-900">{ctaText}</Link>
        ) : (
          <button onClick={ctaOnClick} className="inline-block mt-6 px-7 py-3 rounded-full bg-zinc-900 text-white font-semibold dark:bg-white dark:text-zinc-900">{ctaText}</button>
        )
      )}
    </div>
  )
}
