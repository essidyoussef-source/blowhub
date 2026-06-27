import { useStore } from '../store'
import type { Theme } from '../types'

export const THEME_SWATCHES = ['#ec1763', '#7c3aed', '#0284c7', '#059669', '#d97706', '#f37826', '#0d9488', '#c026d3', '#5568af']

export function useThemes(): Theme[] {
  return useStore((s) => s.themes)
}
export function themeById(themes: Theme[], id: string) {
  return themes.find((t) => t.id === id)
}

/** Petites pastilles colorées des thématiques d'un contenu */
export function ThemeTags({ ids, sm }: { ids?: string[]; sm?: boolean }) {
  const themes = useThemes()
  if (!ids?.length) return null
  return (
    <>
      {ids.map((id) => {
        const t = themeById(themes, id)
        if (!t) return null
        return (
          <span key={id} className={`chip border-transparent ${sm ? 'text-[10px] px-2 py-0' : ''}`}
            style={{ color: t.color, background: `${t.color}18` }}>
            {t.name}
          </span>
        )
      })}
    </>
  )
}

/** Rangée de filtres par thématique */
export function ThemeFilter({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const themes = useThemes()
  if (!themes.length) return null
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button onClick={() => onChange('')}
        className={`chip transition ${!value ? 'bg-slate-100 text-slate-100 border-slate-900/15' : 'border-slate-900/10 text-slate-400 hover:text-blow-600'}`}>
        Toutes thématiques
      </button>
      {themes.map((t) => (
        <button key={t.id} onClick={() => onChange(value === t.id ? '' : t.id)}
          className="chip transition border"
          style={value === t.id
            ? { color: t.color, background: `${t.color}18`, borderColor: `${t.color}55` }
            : { color: '#736d88', borderColor: 'rgba(26,20,48,0.10)' }}>
          <span className="h-2 w-2 rounded-full" style={{ background: t.color }} /> {t.name}
        </button>
      ))}
    </div>
  )
}

/** Sélecteur multiple de thématiques (éditeur de contenu) */
export function ThemePicker({ value, onChange }: { value: string[]; onChange: (ids: string[]) => void }) {
  const themes = useThemes()
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id])
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {themes.map((t) => {
        const on = value.includes(t.id)
        return (
          <button key={t.id} type="button" onClick={() => toggle(t.id)}
            className="chip transition border"
            style={on
              ? { color: t.color, background: `${t.color}18`, borderColor: `${t.color}55` }
              : { color: '#736d88', borderColor: 'rgba(26,20,48,0.10)' }}>
            <span className="h-2 w-2 rounded-full" style={{ background: t.color }} /> {t.name}
          </button>
        )
      })}
      {themes.length === 0 && <span className="text-xs text-slate-400">Crée des thématiques dans l'onglet Thématiques.</span>}
    </div>
  )
}

/** URL de prévisualisation (cover) d'un lien — service de capture, sans backend */
export function coverUrl(url: string, custom?: string): string {
  if (custom) return custom
  return `https://image.thum.io/get/width/640/crop/420/noanimate/${url}`
}
