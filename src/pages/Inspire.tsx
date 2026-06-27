import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Bookmark, Check, X } from 'lucide-react'
import { useStore, detectPlatform } from '../store'
import { platformOf } from '../constants'

// Cible de partage : "Partager → Blow Hub" depuis les réseaux.
// Reçoit url / text / title et sauvegarde une inspiration.
function extractUrl(...vals: (string | null)[]): string | null {
  for (const v of vals) {
    if (!v) continue
    const m = v.match(/https?:\/\/[^\s]+/)
    if (m) return m[0]
  }
  return null
}

export default function Inspire() {
  const [params] = useSearchParams()
  const add = useStore((s) => s.addInspiration)
  const navigate = useNavigate()
  const done = useRef(false)
  const [saved, setSaved] = useState<{ url: string; platform: string } | null>(null)

  useEffect(() => {
    if (done.current) return
    done.current = true
    const url = extractUrl(params.get('url'), params.get('text'), params.get('title'))
    const title = (params.get('title') || '').slice(0, 140)
    if (url) {
      add({ url, platform: detectPlatform(url), title })
      setSaved({ url, platform: detectPlatform(url) })
      const t = setTimeout(() => navigate('/inspirations', { replace: true }), 1400)
      return () => clearTimeout(t)
    }
  }, [params, add, navigate])

  const p = saved ? platformOf(saved.platform as any) : null

  return (
    <div className="px-5 md:px-8 grid place-items-center min-h-[70vh]">
      <div className="card p-10 text-center max-w-sm w-full">
        {saved ? (
          <>
            <div className="grid h-14 w-14 place-items-center rounded-2xl mx-auto mb-4" style={{ background: `${p!.hex}18`, color: p!.hex }}>
              <Check size={28} />
            </div>
            <h2 className="font-display font-bold text-lg text-slate-100">Inspiration sauvée !</h2>
            <p className="text-sm text-slate-400 mt-1">Depuis {p!.label}. Redirection vers ta veille…</p>
          </>
        ) : (
          <>
            <div className="grid h-14 w-14 place-items-center rounded-2xl mx-auto mb-4 bg-slate-900/[0.04] text-slate-400"><X size={28} /></div>
            <h2 className="font-display font-bold text-lg text-slate-100">Aucun lien détecté</h2>
            <p className="text-sm text-slate-400 mt-1">Le partage ne contenait pas d'URL.</p>
            <button className="btn-primary mx-auto mt-4" onClick={() => navigate('/inspirations')}><Bookmark size={16} /> Aller aux inspirations</button>
          </>
        )}
      </div>
    </div>
  )
}
