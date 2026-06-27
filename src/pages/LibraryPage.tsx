import { useMemo, useState } from 'react'
import { Library, Quote as QuoteIcon, Sparkle, Lightbulb, Type, Plus, ArrowUpRight, Trash2, Copy, Check, Sparkles, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store'
import { PILLARS, pillarOf, tone } from '../constants'
import { generateIdeas, AiError } from '../lib/ai'

type Tab = 'quotes' | 'anecdotes' | 'ideas' | 'captions'

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      className="btn-icon"
      title="Copier"
      onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1200) }}
    >{done ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
  )
}

export default function LibraryPage({ embedded }: { embedded?: boolean } = {}) {
  const { quotes, anecdotes, rawIdeas, captions, addRawIdea, deleteRawIdea, promoteRawIdea } = useStore()
  const [tab, setTab] = useState<Tab>('ideas')
  const [newIdea, setNewIdea] = useState('')
  const [newPillar, setNewPillar] = useState('Mindset')
  const [pillarFilter, setPillarFilter] = useState('')
  const [aiBusy, setAiBusy] = useState(false)
  const [aiErr, setAiErr] = useState<string | null>(null)

  const genIdeas = async () => {
    setAiErr(null); setAiBusy(true)
    try {
      const ideas = await generateIdeas(newPillar, 6)
      ideas.reverse().forEach((i) => addRawIdea(i.title, newPillar))
    } catch (e) {
      setAiErr(e instanceof AiError ? e.message : 'Erreur lors de la génération.')
    } finally { setAiBusy(false) }
  }

  const TABS: { id: Tab; label: string; icon: any; count: number }[] = [
    { id: 'ideas', label: 'Idées brutes', icon: Lightbulb, count: rawIdeas.length },
    { id: 'quotes', label: 'Punchlines & citations', icon: QuoteIcon, count: quotes.length },
    { id: 'anecdotes', label: 'Anecdotes', icon: Sparkle, count: anecdotes.length },
    { id: 'captions', label: 'Captions prêtes', icon: Type, count: captions.length },
  ]

  const filteredIdeas = useMemo(
    () => rawIdeas.filter((r) => !pillarFilter || r.pillar === pillarFilter),
    [rawIdeas, pillarFilter],
  )
  const anecdoteSets = useMemo(() => {
    const m: Record<string, typeof anecdotes> = {}
    anecdotes.forEach((a) => { const k = a.category || 'Autre'; (m[k] = m[k] || []).push(a) })
    return m
  }, [anecdotes])

  return (
    <div className={embedded ? '' : 'px-5 md:px-8'}>
      {!embedded && (
        <PageHeader
          title="Bibliothèque"
          subtitle="Ta réserve de munitions : idées brutes, punchlines, anecdotes et captions."
          icon={<Library size={20} />}
        />
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 mb-5 flex-wrap">
        {TABS.map(({ id, label, icon: Icon, count }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`btn ${tab === id ? 'bg-blow-50 text-blow-700 shadow-[inset_0_0_0_1px_rgba(255,45,119,0.3)]' : 'text-slate-400 hover:text-blow-600 hover:bg-slate-900/[0.04]'}`}>
            <Icon size={16} /> {label}
            <span className="ml-1 text-xs text-slate-500">{count}</span>
          </button>
        ))}
      </div>

      {/* IDÉES BRUTES */}
      {tab === 'ideas' && (
        <div className="space-y-4">
          <div className="card p-3 flex flex-col sm:flex-row gap-2">
            <input className="input flex-1" placeholder="Note une idée qui te passe par la tête…" value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newIdea.trim()) { addRawIdea(newIdea.trim(), newPillar); setNewIdea('') } }} />
            <select className="input w-auto" value={newPillar} onChange={(e) => setNewPillar(e.target.value)}>
              {PILLARS.slice(0, 8).map((p) => <option key={p.id} value={p.id}><p.Icon size={12} className="shrink-0" /> {p.label}</option>)}
            </select>
            <button className="btn-primary" disabled={!newIdea.trim()}
              onClick={() => { if (newIdea.trim()) { addRawIdea(newIdea.trim(), newPillar); setNewIdea('') } }}>
              <Plus size={16} /> Ajouter
            </button>
            <button
              className="btn bg-gradient-to-r from-blow-500/20 to-violet-500/20 text-blow-300 border border-blow-500/30 hover:from-blow-500/30 hover:to-violet-500/30"
              onClick={genIdeas} disabled={aiBusy} title={`Générer 6 idées « ${newPillar} » avec l'IA`}>
              {aiBusy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {aiBusy ? 'Génération…' : 'Générer (IA)'}
            </button>
          </div>
          {aiErr && <p className="text-xs text-rose-400 -mt-2">{aiErr}</p>}

          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => setPillarFilter('')} className={`chip ${!pillarFilter ? 'bg-slate-100 text-slate-100 border-slate-900/15' : 'border-slate-900/10 text-slate-400'}`}>Tous</button>
            {PILLARS.slice(0, 8).map((p) => (
              <button key={p.id} onClick={() => setPillarFilter(pillarFilter === p.id ? '' : p.id)}
                className={`chip border transition ${pillarFilter === p.id ? '' : 'border-slate-900/10 text-slate-400 hover:text-blow-600'}`}
                style={pillarFilter === p.id ? tone(p.hex, p.ink) : undefined}>
                <p.Icon size={12} className="shrink-0" /> {p.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredIdeas.map((idea) => {
              const p = pillarOf(idea.pillar)
              return (
                <div key={idea.id} className="group rounded-xl bg-ink-850 border border-slate-900/[0.06] p-3 relative overflow-hidden">
                  <span className="absolute left-0 top-0 h-full w-1" style={{ background: p.hex }} />
                  <div className="flex items-start justify-between gap-2 pl-1.5">
                    <p className="text-sm text-slate-200 leading-snug">{idea.text}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2.5 pl-1.5">
                    <span className="chip border-transparent px-0 text-[10px]" style={{ color: p.hex }}><p.Icon size={12} className="shrink-0" /> {p.label}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button className="text-[11px] font-semibold text-blow-400 hover:text-blow-300 inline-flex items-center gap-1"
                        title="Envoyer dans le pipeline Idées"
                        onClick={() => promoteRawIdea(idea.id)}>
                        Pipeline <ArrowUpRight size={12} />
                      </button>
                      <button className="btn-icon hover:text-rose-400" onClick={() => deleteRawIdea(idea.id)}><Trash2 size={13} /></button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* QUOTES */}
      {tab === 'quotes' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quotes.map((q) => (
            <div key={q.id} className="card p-4 flex flex-col gap-2">
              <QuoteIcon size={16} className="text-blow-400" />
              <p className="text-sm text-slate-200 leading-relaxed flex-1">{q.text}</p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">{q.set}{q.angle && q.angle !== q.set ? ` · ${q.angle}` : ''}</span>
                <CopyBtn text={q.text} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ANECDOTES */}
      {tab === 'anecdotes' && (
        <div className="space-y-6">
          {Object.entries(anecdoteSets).map(([cat, list]) => (
            <div key={cat}>
              <h3 className="label !text-slate-400">{cat} · {list.length}</h3>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {list.map((a) => (
                  <div key={a.id} className="rounded-xl bg-ink-850 border border-slate-900/[0.06] p-3 flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-200 leading-snug">{a.text}</p>
                    <CopyBtn text={a.text} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CAPTIONS */}
      {tab === 'captions' && (
        <div className="space-y-3">
          {captions.map((c) => (
            <div key={c.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-slate-100">{c.post}</h3>
                <CopyBtn text={`${c.caption}\n\n${c.hashtags ?? ''}`} />
              </div>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{c.caption}</p>
              {c.hashtags && <p className="text-xs text-blow-400/80 mt-2">{c.hashtags}</p>}
            </div>
          ))}
          {captions.length === 0 && <div className="card p-12 text-center text-slate-500">Aucune caption enregistrée.</div>}
        </div>
      )}
    </div>
  )
}
