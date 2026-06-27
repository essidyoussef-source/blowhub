import { useMemo, useState } from 'react'
import { LayoutGrid, Plus, Sparkles, Loader2, ArrowUpRight, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useStore } from '../store'
import { PILLARS, pillarOf, tone } from '../constants'
import { generateIdeas, AiError } from '../lib/ai'
import type { RawIdea } from '../types'

// Petite punaise (pushpin) en haut de la carte
function Pin({ hex }: { hex: string }) {
  return (
    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
      <span className="block h-4 w-4 rounded-full shadow-pin"
        style={{ background: `radial-gradient(circle at 35% 30%, #ffffff, ${hex} 70%)` }} />
      <span className="block h-2 w-[2px] mx-auto -mt-0.5 bg-slate-900/15" />
    </span>
  )
}

function MoodCard({ idea, index, onPromote, onDelete }: {
  idea: RawIdea; index: number; onPromote: () => void; onDelete: () => void
}) {
  const p = pillarOf(idea.pillar)
  // légère rotation organique déterministe
  const rot = ((index % 5) - 2) * 0.8
  return (
    <div className="relative break-inside-avoid mb-5" style={{ transform: `rotate(${rot}deg)` }}>
      <Pin hex={p.hex} />
      <div className="group relative rounded-2xl p-4 pt-5 shadow-soft border transition-all hover:-translate-y-0.5 hover:shadow-card"
        style={{ background: `${p.hex}10`, borderColor: `${p.hex}33` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-display font-bold text-lg leading-none" style={{ color: p.hex }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="chip border-transparent px-0 text-[10px]" style={{ color: p.hex }}>
            <p.Icon size={12} /> {p.label}
          </span>
        </div>
        <p className="text-[15px] leading-snug text-slate-100 font-medium">{idea.text}</p>
        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition">
          <button onClick={onPromote}
            className="text-[11px] font-bold inline-flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ color: p.hex, background: `${p.hex}18` }}
            title="Envoyer dans le pipeline">
            Pipeline <ArrowUpRight size={12} />
          </button>
          <button onClick={onDelete} className="btn-icon !h-7 !w-7 ml-auto hover:text-blow-600"><Trash2 size={13} /></button>
        </div>
      </div>
    </div>
  )
}

export default function Board({ embedded }: { embedded?: boolean } = {}) {
  const { rawIdeas, addRawIdea, deleteRawIdea, promoteRawIdea } = useStore()
  const [text, setText] = useState('')
  const [pillar, setPillar] = useState('Mindset')
  const [filter, setFilter] = useState('')
  const [aiBusy, setAiBusy] = useState(false)
  const [aiErr, setAiErr] = useState<string | null>(null)

  const ideas = useMemo(
    () => rawIdeas.filter((r) => !filter || r.pillar === filter),
    [rawIdeas, filter],
  )

  const add = () => { if (text.trim()) { addRawIdea(text.trim(), pillar); setText('') } }
  const generate = async () => {
    setAiErr(null); setAiBusy(true)
    try {
      const out = await generateIdeas(filter || pillar, 6)
      out.reverse().forEach((i) => addRawIdea(i.title, filter || pillar))
    } catch (e) { setAiErr(e instanceof AiError ? e.message : 'Erreur de génération.') }
    finally { setAiBusy(false) }
  }

  return (
    <div className={embedded ? '' : 'px-5 md:px-8'}>
      {!embedded && (
        <PageHeader
          title="Tableau d'inspiration"
          subtitle="Vide ta tête. Épingle, colore, prends du recul — puis envoie les meilleures idées dans le pipeline."
          icon={<LayoutGrid size={20} />}
          actions={
            <button className="btn bg-gradient-to-r from-blow-500 to-sunset text-white shadow-glow" onClick={generate} disabled={aiBusy}>
              {aiBusy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {aiBusy ? 'Génération…' : 'Inspire-moi (IA)'}
            </button>
          }
        />
      )}
      {embedded && (
        <div className="flex justify-end mb-3">
          <button className="btn bg-gradient-to-r from-blow-500 to-blush text-white shadow-glow" onClick={generate} disabled={aiBusy}>
            {aiBusy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {aiBusy ? 'Génération…' : 'Inspire-moi (IA)'}
          </button>
        </div>
      )}

      {/* Capture rapide */}
      <div className="card p-3 flex flex-col sm:flex-row gap-2 mb-4">
        <input className="input flex-1" placeholder="Une idée te traverse l'esprit ? Note-la ici…" value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <select className="input w-auto" value={pillar} onChange={(e) => setPillar(e.target.value)}>
          {PILLARS.slice(0, 8).map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <button className="btn-primary" onClick={add} disabled={!text.trim()}><Plus size={16} /> Épingler</button>
      </div>
      {aiErr && <p className="text-xs text-blow-600 mb-3">{aiErr}</p>}

      {/* Filtre par pilier */}
      <div className="flex items-center gap-1.5 mb-6 flex-wrap">
        <button onClick={() => setFilter('')}
          className={`chip transition ${!filter ? 'bg-slate-100 text-slate-100 border-slate-900/15' : 'border-slate-900/10 text-slate-400 hover:text-blow-600'}`}>
          Tout ({rawIdeas.length})
        </button>
        {PILLARS.slice(0, 8).map((p) => {
          const n = rawIdeas.filter((r) => r.pillar === p.id).length
          if (!n) return null
          return (
            <button key={p.id} onClick={() => setFilter(filter === p.id ? '' : p.id)}
              className={`chip border transition ${filter === p.id ? '' : 'border-slate-900/10 text-slate-400 hover:text-blow-600'}`}
              style={filter === p.id ? tone(p.hex, p.ink) : undefined}>
              <p.Icon size={12} className="shrink-0" /> {p.label} <span className="opacity-60">{n}</span>
            </button>
          )
        })}
      </div>

      {/* Moodboard masonry */}
      {ideas.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
          {ideas.map((idea, i) => (
            <MoodCard key={idea.id} idea={idea} index={i}
              onPromote={() => promoteRawIdea(idea.id)} onDelete={() => deleteRawIdea(idea.id)} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center text-slate-400">Aucune idée épinglée ici. Lance-toi !</div>
      )}
    </div>
  )
}
