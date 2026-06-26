import type { ReactNode } from 'react'

export default function PageHeader({
  title, subtitle, icon, actions,
}: { title: string; subtitle?: string; icon?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="sticky top-0 z-30 -mx-5 md:-mx-8 px-5 md:px-8 py-4 bg-ink-950/70 backdrop-blur-xl border-b border-white/5 mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {icon && <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-blow-400">{icon}</div>}
          <div>
            <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-white">{title}</h1>
            {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
