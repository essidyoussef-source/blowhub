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

// Orb glossy "liquid glass" — bulle dégradée avec reflet, façon iOS 26.
function Stat({ icon, label, value, from, to }: { icon: React.ReactNode; label: string; value: number | string; from: string; to: string }) {
  return (
    <div className="widget flex flex-col items-center text-center gap-3 py-5">
      <div className="relative grid h-24 w-24 place-items-center rounded-full shrink-0"
        style={{ backgroundImage: `radial-gradient(120% 120% at 30% 22%, ${from}, ${to})`, boxShadow: `0 16px 30px -10px ${to}aa, inset 0 2px 6px rgba(255,255,255,0.55)` }}>
        {/* reflet vitré */}
        <span className="absolute left-3 top-2.5 h-7 w-10 rounded-full bg-white/55 blur-[6px]" />
        <span className="absolute inset-1.5 rounded-full border border-white/40" />
        <div className="relative leading-none">
          <div className="text-2xl font-display font-extrabold text-white drop-shadow-sm">{value}</div>
          <div className="mt-1 grid place-items-center text-white/90">{icon}</div>
        </div>
      </div>
      <div className="text-xs font-bold text-slate-200">{label}</div>
    </div>
  )
}

function Panel({ accent, title, action, children }: { accent: string; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-4xl" style={{ background: accent }} />
      <div className="flex items-center justify-between mb-4 mt-1">
        <h3 className="font-display font-bold text-slate-100">{title}</h3>
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

      {/* Stats — orbs glossy "liquid glass" */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat icon={<Sparkles size={16} />} label="Contenus au total" value={stats.total} from="#f3a7d6" to="#b07cf0" />
        <Stat icon={<GalleryHorizontalEnd size={16} />} label={`Carrousels · ${stats.slides} slides`} value={stats.carousels} from="#9fc0f7" to="#7a6cf0" />
        <Stat icon={<Lightbulb size={16} />} label="Idées en réserve" value={rawIdeas.length} from="#f9c9a0" to="#f08fb6" />
        <Stat icon={<TrendingUp size={16} />} label="Déjà publiés" value={published} from="#9fe6c2" to="#5fc6c2" />
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
                  <div className="flex-1 h-2.5 rounded-full bg-white/70 overflow-hidden">
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
                  <div className="flex-1 h-2.5 rounded-full bg-white/70 overflow-hidden">
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
