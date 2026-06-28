// Petit sélecteur segmenté (toggle) — pour imbriquer des vues dans une page.
export default function Segmented<T extends string>({
  value, onChange, options,
}: { value: T; onChange: (v: T) => void; options: { id: T; label: string; icon?: any }[] }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-ink-800 border border-ink-700 p-0.5">
      {options.map((o) => {
        const on = value === o.id
        return (
          <button key={o.id} onClick={() => onChange(o.id)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              on ? 'bg-white text-slate-100 shadow-soft' : 'text-slate-400 hover:text-slate-200'
            }`}>
            {o.icon && <o.icon size={14} />} {o.label}
          </button>
        )
      })}
    </div>
  )
}
