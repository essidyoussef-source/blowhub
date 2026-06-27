// Petit sélecteur segmenté (toggle) — pour imbriquer des vues dans une page.
export default function Segmented<T extends string>({
  value, onChange, options,
}: { value: T; onChange: (v: T) => void; options: { id: T; label: string; icon?: any }[] }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/60 border border-white/70 p-1 backdrop-blur-md shadow-soft">
      {options.map((o) => {
        const on = value === o.id
        return (
          <button key={o.id} onClick={() => onChange(o.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
              on ? 'text-white shadow-glow' : 'text-slate-300 hover:text-blow-600'
            }`}
            style={on ? { backgroundImage: 'linear-gradient(135deg,#9d85f4,#6a54ee)' } : undefined}>
            {o.icon && <o.icon size={14} />} {o.label}
          </button>
        )
      })}
    </div>
  )
}
