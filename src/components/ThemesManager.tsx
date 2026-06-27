import { useState } from 'react'
import { Plus, Trash2, Tag } from 'lucide-react'
import { useStore } from '../store'
import { THEME_SWATCHES } from './Themes'

export default function ThemesManager() {
  const themes = useStore((s) => s.themes)
  const contents = useStore((s) => s.contents)
  const addTheme = useStore((s) => s.addTheme)
  const updateTheme = useStore((s) => s.updateTheme)
  const deleteTheme = useStore((s) => s.deleteTheme)
  const [name, setName] = useState('')
  const [color, setColor] = useState(THEME_SWATCHES[0])

  const countFor = (id: string) => contents.filter((c) => c.themes?.includes(id)).length

  return (
    <div>
      <div className="card p-3 mb-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <input className="input flex-1" placeholder="Nouvelle thématique (ex: Coulisses business)…" value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) { addTheme(name.trim(), color); setName('') } }} />
        <div className="flex items-center gap-1.5">
          {THEME_SWATCHES.map((c) => (
            <button key={c} onClick={() => setColor(c)}
              className={`h-6 w-6 rounded-full transition ${color === c ? 'ring-2 ring-offset-2 ring-slate-300' : ''}`}
              style={{ background: c }} aria-label={c} />
          ))}
        </div>
        <button className="btn-primary" disabled={!name.trim()} onClick={() => { if (name.trim()) { addTheme(name.trim(), color); setName('') } }}>
          <Plus size={16} /> Créer
        </button>
      </div>

      {themes.length === 0 ? (
        <div className="card p-10 text-center text-slate-400 flex flex-col items-center gap-2">
          <Tag size={26} className="text-slate-300" /> Aucune thématique. Crée-en pour personnaliser ton organisation.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {themes.map((t) => (
            <div key={t.id} className="card p-3 flex items-center gap-3">
              <span className="h-9 w-9 rounded-xl shrink-0" style={{ background: `${t.color}22`, boxShadow: `inset 0 0 0 2px ${t.color}` }} />
              <div className="flex-1 min-w-0">
                <input value={t.name} onChange={(e) => updateTheme(t.id, { name: e.target.value })}
                  className="w-full bg-transparent font-semibold text-sm text-slate-100 outline-none" />
                <div className="flex items-center gap-1 mt-1">
                  {THEME_SWATCHES.slice(0, 6).map((c) => (
                    <button key={c} onClick={() => updateTheme(t.id, { color: c })}
                      className={`h-3.5 w-3.5 rounded-full ${t.color === c ? 'ring-1 ring-offset-1 ring-slate-300' : ''}`} style={{ background: c }} />
                  ))}
                  <span className="text-[11px] text-slate-400 ml-1.5">{countFor(t.id)} contenu{countFor(t.id) > 1 ? 's' : ''}</span>
                </div>
              </div>
              <button className="btn-icon hover:text-blow-600" onClick={() => { if (confirm(`Supprimer la thématique « ${t.name} » ?`)) deleteTheme(t.id) }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
