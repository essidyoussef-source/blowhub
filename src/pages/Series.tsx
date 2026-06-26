import { useMemo, useState } from 'react'
import { Tv, Plus, Hash } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ContentCard from '../components/ContentCard'
import ContentModal from '../components/ContentModal'
import { useStore } from '../store'
import type { Content } from '../types'

export default function SeriesPage() {
  const contents = useStore((s) => s.contents)
  const addContent = useStore((s) => s.addContent)
  const [openId, setOpenId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')

  const series = useMemo(() => {
    const map: Record<string, Content[]> = {}
    for (const c of contents) {
      if (c.series) (map[c.series] = map[c.series] ?? []).push(c)
    }
    for (const k of Object.keys(map)) map[k].sort((a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt))
    return map
  }, [contents])

  const names = Object.keys(series)

  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title="Séries"
        subtitle="Tes formats récurrents, numérotés automatiquement. Construis une marque, pas juste des posts."
        icon={<Tv size={20} />}
        actions={
          <div className="flex items-center gap-2">
            <input className="input w-52 !py-2" placeholder="Nom d'une nouvelle série…" value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newName.trim()) { const id = addContent({ series: newName.trim(), format: 'Série', title: `${newName.trim()} #01` }); setNewName(''); setOpenId(id) } }} />
            <button className="btn-primary" disabled={!newName.trim()}
              onClick={() => { if (newName.trim()) { const id = addContent({ series: newName.trim(), format: 'Série', title: `${newName.trim()} #01` }); setNewName(''); setOpenId(id) } }}>
              <Plus size={16} /> Série
            </button>
          </div>
        }
      />

      {names.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          Aucune série pour l'instant. Crée-en une ci-dessus, ou ajoute le nom d'une série dans un contenu.
        </div>
      ) : (
        <div className="space-y-6">
          {names.map((name) => {
            const episodes = series[name]
            return (
              <section key={name} className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blow-500/15 text-blow-400"><Tv size={18} /></div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-white">{name}</h3>
                      <p className="text-xs text-slate-500">{episodes.length} épisode{episodes.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <button className="btn-ghost !py-1.5 text-xs"
                    onClick={() => { const id = addContent({ series: name, format: episodes[0]?.format ?? 'Carrousel', pillar: episodes[0]?.pillar, title: `${name} #${String(episodes.length + 1).padStart(2, '0')}` }); setOpenId(id) }}>
                    <Plus size={14} /> Épisode
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {episodes.map((c, i) => (
                    <div key={c.id} className="relative">
                      <span className="absolute -top-2 -left-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-blow-500 text-white text-xs font-bold shadow-glow">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <ContentCard content={c} onClick={() => setOpenId(c.id)} />
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {openId && <ContentModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}
