import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Sparkles, Flame, GalleryHorizontalEnd, Lightbulb, TrendingUp, ArrowRight, RotateCcw,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ContentCard from '../components/ContentCard'
import ContentModal from '../components/ContentModal'
import { useStore } from '../store'
import { STATUSES, PILLARS, statusOf, pillarOf } from '../constants'

// Stat : icône en pastille dégradée + grand chiffre, dans une carte flottante.
function Stat({ icon, label, value, from, to }: { icon: React.ReactNode; label: string; value: number | string; from: string; to: string }) {
  return (
    <div className="card p-4 flex items-center gap-3.5">
      <div className="grid h-12 w-12 place-items-center rounded-2xl text-white shrink-0 shadow-soft"
        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}>{icon}</div>
      <div className="min-w-0">
        <div className="text-2xl font-display font-bold text-slate-100 leading-none tabular-nums">{value}</div>
        <div className="text-xs text-slate-400 mt-1 font-medium truncate">{label}</div>
      </div>
    </div>
  )
}

function Panel({ title, action, children }: { accent?: string; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-slate-100">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}

export default function Dashboard() {
  const contents = useStore((s) => s.contents)
  const rawIdeas = useStore((s) => s.rawIdeas)
  const resetDemo = useStore((s) => s.resetDemo)
  const navigate = useNavigate()
  const [openId, setOpenId] = useState<string | null>(null)

  const stats = useMemo(() => {
    const byStatus = Object.fromEntries(STATUSES.map((s) => [s.id, 0])) as Record<string, number>
    const byPillar: Record<string, number> = {}
    let carousels = 0, slides = 0
    for (const c of contents) {
      byStatus[c.status]++
      byPillar[c.pillar] = (byPillar[c.pillar] ?? 0) + 1
      if (c.format === 'Carrousel') carousels++
      slides += c.slides.length
    }
    return { byStatus, byPillar, carousels, slides, total: contents.length }
  }, [contents])

  const maxStatus = Math.max(1, ...STATUSES.map((s) => stats.byStatus[s.id]))
  const maxPillar = Math.max(1, ...Object.values(stats.byPillar))
  const priority = contents.filter((c) => c.priority === 'haute' && c.status !== 'publie').slice(0, 6)
  const published = stats.byStatus['publie']

  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title="Bienvenue sur Blow Hub"
        subtitle="Le QG de ton contenu — de l'étincelle d'idée jusqu'au post publié."
        icon={<LayoutDashboard size={20} />}
        actions={
          <button className="btn-ghost text-xs" onClick={() => { if (confirm('Recharger les données de démo ? Tes modifications locales seront écrasées.')) resetDemo() }}>
            <RotateCcw size={14} /> Réinitialiser la démo
          </button>
        }
      />

      {/* Stats — cartes minimalistes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat icon={<Sparkles size={20} />} label="Contenus au total" value={stats.total} from="#9d85f4" to="#6a54ee" />
        <Stat icon={<GalleryHorizontalEnd size={20} />} label={`Carrousels · ${stats.slides} slides`} value={stats.carousels} from="#7c9bf2" to="#5b73d6" />
        <Stat icon={<Lightbulb size={20} />} label="Idées en réserve" value={rawIdeas.length} from="#f6b87a" to="#ef9350" />
        <Stat icon={<TrendingUp size={20} />} label="Déjà publiés" value={published} from="#5fcdb6" to="#3fa07f" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        {/* Pipeline funnel */}
        <Panel accent="#7c9bf2" title="Ton pipeline"
          action={<button className="text-xs text-blow-600 hover:text-blow-700 inline-flex items-center gap-1 font-semibold" onClick={() => navigate('/ideas')}>Ouvrir le board <ArrowRight size={13} /></button>}>
          <div className="space-y-2.5">
            {STATUSES.map((s) => {
              const v = stats.byStatus[s.id]
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-slate-300 flex items-center gap-1.5 shrink-0">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.hex }} /> {s.label}
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-ink-800 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(v / maxStatus) * 100}%`, background: s.hex }} />
                  </div>
                  <div className="w-6 text-right text-xs font-mono text-slate-200">{v}</div>
                </div>
              )
            })}
          </div>
        </Panel>

        {/* Pillars */}
        <Panel accent="#b9a7f7" title="Répartition par pilier"
          action={<button className="text-xs text-blow-600 hover:text-blow-700 inline-flex items-center gap-1 font-semibold" onClick={() => navigate('/carousels')}>Voir les carrousels <ArrowRight size={13} /></button>}>
          <div className="space-y-2.5">
            {PILLARS.filter((p) => stats.byPillar[p.id]).sort((a, b) => (stats.byPillar[b.id] ?? 0) - (stats.byPillar[a.id] ?? 0)).map((p) => {
              const v = stats.byPillar[p.id] ?? 0
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-slate-300 flex items-center gap-1.5 shrink-0"><p.Icon size={12} className="shrink-0" style={{ color: p.hex }} /> {p.label}</div>
                  <div className="flex-1 h-2 rounded-full bg-ink-800 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(v / maxPillar) * 100}%`, background: p.hex }} />
                  </div>
                  <div className="w-6 text-right text-xs font-mono text-slate-200">{v}</div>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>

      {/* Priorités */}
      <Panel accent="#f6a978" title="Tes priorités du moment">
        {priority.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {priority.map((c) => <ContentCard key={c.id} content={c} onClick={() => setOpenId(c.id)} />)}
          </div>
        ) : (
          <p className="text-sm text-slate-300">Aucune priorité haute en attente. Passe des contenus en priorité « Haute »</p>
        )}
      </Panel>

      {openId && <ContentModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}
