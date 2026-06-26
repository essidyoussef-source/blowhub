import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft } from 'lucide-react'
import { useStore } from '../store'
import { pillarOf, formatOf } from '../constants'
import ContentModal from './ContentModal'

const PAGES = [
  { label: 'Dashboard', to: '/' },
  { label: 'Idées', to: '/ideas' },
  { label: 'Calendrier', to: '/calendar' },
  { label: 'Carrousels', to: '/carousels' },
  { label: 'Séries', to: '/series' },
  { label: 'Production', to: '/production' },
  { label: 'Bibliothèque', to: '/library' },
  { label: 'Réglages', to: '/settings' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const contents = useStore((s) => s.contents)
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setOpen((v) => !v); setQ('')
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const pages = PAGES.filter((p) => !term || p.label.toLowerCase().includes(term))
    const items = !term
      ? []
      : contents
          .filter((c) => `${c.title} ${c.hook} ${c.pillar} ${c.description}`.toLowerCase().includes(term))
          .slice(0, 8)
    return { pages: term ? pages.slice(0, 4) : pages, items }
  }, [q, contents])

  if (!open && !openId) return null

  return (
    <>
      {open && createPortal(
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-xl rounded-2xl bg-ink-900 border border-white/10 shadow-2xl overflow-hidden animate-fade-in">
            <div className="flex items-center gap-3 px-4 border-b border-white/5">
              <Search size={18} className="text-slate-500" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un contenu, une page…"
                className="flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-slate-500"
              />
              <kbd className="text-[10px] text-slate-500 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
            </div>
            <div className="max-h-[55vh] overflow-y-auto p-2">
              {results.pages.length > 0 && (
                <>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">Pages</div>
                  {results.pages.map((p) => (
                    <button key={p.to} onClick={() => { navigate(p.to); setOpen(false) }}
                      className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/5 text-left">
                      <CornerDownLeft size={14} className="text-slate-500" /> {p.label}
                    </button>
                  ))}
                </>
              )}
              {results.items.length > 0 && (
                <>
                  <div className="px-2 py-1 mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">Contenus</div>
                  {results.items.map((c) => {
                    const p = pillarOf(c.pillar); const f = formatOf(c.format)
                    return (
                      <button key={c.id} onClick={() => { setOpen(false); setOpenId(c.id) }}
                        className="w-full flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5 text-left">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: p.hex }} />
                        <span className="text-sm text-slate-200 truncate flex-1">{c.title}</span>
                        <span className="text-[10px] text-slate-500">{f.emoji} {p.label}</span>
                      </button>
                    )
                  })}
                </>
              )}
              {q && results.items.length === 0 && results.pages.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-slate-500">Aucun résultat.</div>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
      {openId && <ContentModal id={openId} onClose={() => setOpenId(null)} />}
    </>
  )
}
