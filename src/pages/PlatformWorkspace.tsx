import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LayoutDashboard, Lightbulb, Bookmark, Tag, Plus, Search, Send } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ContentCard from '../components/ContentCard'
import ContentModal from '../components/ContentModal'
import InspirationGrid from '../components/InspirationGrid'
import ThemesManager from '../components/ThemesManager'
import { ThemeFilter } from '../components/Themes'
import { useStore } from '../store'
import { STATUSES, PILLARS, platformOf } from '../constants'
import type { Platform } from '../types'

type Tab = 'vue' | 'idees' | 'inspos' | 'themes'

export default function PlatformWorkspace() {
  const { id } = useParams()
  const platform = (platformOf(id as Platform).id) as Platform
  const def = platformOf(platform)
  const contents = useStore((s) => s.contents)
  const inspirations = useStore((s) => s.inspirations)
  const addContent = useStore((s) => s.addContent)
  const [tab, setTab] = useState<Tab>('vue')
  const [openId, setOpenId] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [tFilter, setTFilter] = useState('')

  const mine = useMemo(() => contents.filter((c) => c.platform === platform), [contents, platform])
  const inspoCount = inspirations.filter((i) => i.platform === platform).length

  const byStatus = useMemo(() => {
    const m: Record<string, number> = {}
    mine.forEach((c) => { m[c.status] = (m[c.status] ?? 0) + 1 })
    return m
  }, [mine])
  const byPillar = useMemo(() => {
    const m: Record<string, number> = {}
    mine.forEach((c) => { m[c.pillar] = (m[c.pillar] ?? 0) + 1 })
    return m
  }, [mine])
  const upcoming = useMemo(
    () => mine.filter((c) => c.publishDate).sort((a, b) => (a.publishDate! < b.publishDate! ? -1 : 1)).slice(0, 5),
    [mine],
  )
  const maxStatus = Math.max(1, ...STATUSES.map((s) => byStatus[s.id] ?? 0))
  const maxPillar = Math.max(1, ...PILLARS.map((p) => byPillar[p.id] ?? 0))

  const ideas = useMemo(
    () => mine.filter((c) => (!tFilter || c.themes?.includes(tFilter)) &&
      (!q || `${c.title} ${c.hook}`.toLowerCase().includes(q.toLowerCase()))),
    [mine, q, tFilter],
  )

  const TABS: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: 'vue', label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: 'idees', label: 'Idées', icon: Lightbulb, count: mine.length },
    { id: 'inspos', label: 'Inspirations', icon: Bookmark, count: inspoCount },
    { id: 'themes', label: 'Thématiques', icon: Tag },
  ]

  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title={def.label}
        subtitle={`Ton espace ${def.label} — vue d'ensemble, idées, inspirations et thématiques.`}
        icon={<def.Icon size={20} />}
        actions={
          <button className="btn-primary" onClick={() => { const cid = addContent({ platform, status: 'idee' }); setOpenId(cid) }}>
            <Plus size={16} /> Nouvelle idée
          </button>
        }
      />

      {/* Sous-onglets */}
      <div className="flex items-center gap-1.5 mb-5 flex-wrap">
        {TABS.map(({ id: t, label, icon: Icon, count }) => (
          <button key={t} onClick={() => setTab(t)}
            className={`btn ${tab === t ? 'text-white shadow-soft' : 'text-slate-400 hover:text-slate-100 bg-white border border-slate-900/[0.08]'}`}
            style={tab === t ? { background: def.hex } : undefined}>
            <Icon size={16} /> {label}{count != null && <span className="opacity-70 text-xs">{count}</span>}
          </button>
        ))}
      </div>

      {/* VUE D'ENSEMBLE */}
      {tab === 'vue' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid grid-cols-2 gap-3 lg:col-span-2">
            <Stat label="Contenus" value={mine.length} hex={def.hex} icon={<def.Icon size={18} />} />
            <Stat label="Programmés" value={byStatus['programme'] ?? 0} hex="#4f46e5" icon={<Send size={18} />} />
            <Stat label="Publiés" value={byStatus['publie'] ?? 0} hex="#059669" icon={<LayoutDashboard size={18} />} />
            <Stat label="Inspirations" value={inspoCount} hex="#f37826" icon={<Bookmark size={18} />} />
          </div>

          <div className="card p-5">
            <h3 className="font-display font-bold text-slate-100 mb-4">Pipeline {def.label}</h3>
            <div className="space-y-2.5">
              {STATUSES.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-slate-400 flex items-center gap-1.5 shrink-0"><span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}</div>
                  <div className="flex-1 h-2.5 rounded-full bg-slate-900/[0.05] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${((byStatus[s.id] ?? 0) / maxStatus) * 100}%`, background: s.hex }} />
                  </div>
                  <div className="w-6 text-right text-xs font-mono text-slate-300">{byStatus[s.id] ?? 0}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-bold text-slate-100 mb-4">Prochaines publications</h3>
            {upcoming.length ? (
              <div className="space-y-2">
                {upcoming.map((c) => (
                  <button key={c.id} onClick={() => setOpenId(c.id)} className="w-full flex items-center gap-3 rounded-xl p-2 hover:bg-slate-900/[0.03] text-left">
                    <span className="text-xs font-mono text-slate-400 w-20 shrink-0">{c.publishDate}</span>
                    <span className="text-sm text-slate-100 truncate">{c.title}</span>
                  </button>
                ))}
              </div>
            ) : <p className="text-sm text-slate-400">Rien de programmé. Va dans le Calendrier pour planifier.</p>}
            <h3 className="font-display font-bold text-slate-100 mt-6 mb-3">Par pilier</h3>
            <div className="space-y-2">
              {PILLARS.filter((p) => byPillar[p.id]).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-slate-400 flex items-center gap-1.5 shrink-0"><p.Icon size={12} /> {p.label}</div>
                  <div className="flex-1 h-2 rounded-full bg-slate-900/[0.05] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(byPillar[p.id] / maxPillar) * 100}%`, background: p.hex }} />
                  </div>
                  <div className="w-6 text-right text-xs font-mono text-slate-300">{byPillar[p.id]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* IDÉES */}
      {tab === 'idees' && (
        <div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input className="input pl-9 w-56" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <ThemeFilter value={tFilter} onChange={setTFilter} />
          </div>
          {ideas.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ideas.map((c) => <ContentCard key={c.id} content={c} onClick={() => setOpenId(c.id)} />)}
            </div>
          ) : <div className="card p-12 text-center text-slate-400">Aucune idée {def.label} pour ce filtre.</div>}
        </div>
      )}

      {/* INSPIRATIONS */}
      {tab === 'inspos' && <InspirationGrid platform={platform} />}

      {/* THÉMATIQUES */}
      {tab === 'themes' && <ThemesManager />}

      {openId && <ContentModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}

function Stat({ label, value, hex, icon }: { label: string; value: number; hex: string; icon: React.ReactNode }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-xl shrink-0" style={{ background: `${hex}18`, color: hex }}>{icon}</div>
      <div>
        <div className="text-2xl font-display font-extrabold text-slate-100 leading-none">{value}</div>
        <div className="text-xs text-slate-400 mt-1">{label}</div>
      </div>
    </div>
  )
}
