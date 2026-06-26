import { useMemo, useState } from 'react'
import { GalleryHorizontalEnd, Plus, Pencil, Maximize2, ChevronLeft, ChevronRight, X, ImageDown } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ContentModal from '../components/ContentModal'
import CarouselExport from '../components/CarouselExport'
import { useStore } from '../store'
import { PILLARS, pillarOf } from '../constants'
import { PillarBadge, StatusBadge } from '../components/Badges'
import type { Content, Slide } from '../types'

// ── Une slide carrée façon carrousel Instagram ─────────────────────────────
function SlideSquare({
  slide, index, total, hex, onChange, onFocus,
}: { slide: Slide; index: number; total: number; hex: string; onChange: (patch: Partial<Slide>) => void; onFocus: () => void }) {
  return (
    <div
      className="relative shrink-0 w-[210px] h-[210px] rounded-2xl border border-white/10 overflow-hidden group"
      style={{ background: `linear-gradient(155deg, ${hex}22, #12121d 55%)` }}
    >
      <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-2xl pointer-events-none" />
      <div className="flex items-center justify-between px-3 pt-2.5">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-black/30 text-[11px] font-bold text-white" style={{ boxShadow: `inset 0 0 0 1px ${hex}55` }}>
          {index + 1}
        </span>
        <span className="text-[10px] font-mono text-white/40">{index + 1}/{total}</span>
      </div>
      <div className="px-3 py-2 h-[150px] flex flex-col">
        {(slide.title || index === 0) && (
          <input
            value={slide.title ?? ''}
            onChange={(e) => onChange({ title: e.target.value })}
            onFocus={onFocus}
            placeholder={index === 0 ? 'HOOK' : 'Titre…'}
            className="bg-transparent text-[11px] font-extrabold uppercase tracking-wide outline-none mb-1 placeholder:text-white/25"
            style={{ color: hex }}
          />
        )}
        <textarea
          value={slide.text}
          onChange={(e) => onChange({ text: e.target.value })}
          onFocus={onFocus}
          placeholder="Texte de la slide…"
          className="flex-1 bg-transparent text-sm leading-snug text-white/90 outline-none resize-none placeholder:text-white/25 no-scrollbar"
        />
      </div>
    </div>
  )
}

function CarouselRow({ content, onEdit, onPresent, onExport }: { content: Content; onEdit: () => void; onPresent: () => void; onExport: () => void }) {
  const update = useStore((s) => s.updateContent)
  const p = pillarOf(content.pillar)
  const setSlide = (i: number, patch: Partial<Slide>) =>
    update(content.id, { slides: content.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) })
  const addSlide = () =>
    update(content.id, { slides: [...content.slides, { n: content.slides.length + 1, title: '', text: '' }] })

  return (
    <section className="card p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <PillarBadge id={content.pillar} sm />
            <StatusBadge id={content.status} />
            <span className="text-xs text-slate-500">{content.slides.length} slides</span>
          </div>
          <h3 className="text-lg font-display font-bold text-white truncate">{content.title}</h3>
          {content.hook && content.hook !== content.title && (
            <p className="text-sm text-slate-400 line-clamp-1">{content.hook}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {content.slides.length > 0 && (
            <>
              <button className="btn-ghost !py-1.5 !px-2.5 text-xs" onClick={onExport}><ImageDown size={14} /> Exporter</button>
              <button className="btn-ghost !py-1.5 !px-2.5 text-xs" onClick={onPresent}><Maximize2 size={14} /> Présenter</button>
            </>
          )}
          <button className="btn-ghost !py-1.5 !px-2.5 text-xs" onClick={onEdit}><Pencil size={14} /> Éditer</button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {content.slides.map((s, i) => (
          <SlideSquare key={i} slide={s} index={i} total={content.slides.length} hex={p.hex}
            onChange={(patch) => setSlide(i, patch)} onFocus={() => {}} />
        ))}
        <button
          onClick={addSlide}
          className="shrink-0 w-[210px] h-[210px] rounded-2xl border-2 border-dashed border-white/10 grid place-items-center text-slate-600 hover:text-slate-300 hover:border-white/25 transition"
        >
          <span className="flex flex-col items-center gap-1 text-sm"><Plus size={22} /> Ajouter une slide</span>
        </button>
      </div>
    </section>
  )
}

// ── Mode présentation plein écran ──────────────────────────────────────────
function Presenter({ content, onClose }: { content: Content; onClose: () => void }) {
  const [i, setI] = useState(0)
  const p = pillarOf(content.pillar)
  const slide = content.slides[i]
  const prev = () => setI((x) => Math.max(0, x - 1))
  const next = () => setI((x) => Math.min(content.slides.length - 1, x + 1))
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur grid place-items-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 btn-icon" onClick={onClose}><X size={22} /></button>
      <div className="text-center mb-4 text-sm text-slate-400">{content.title}</div>
      <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <button className="btn-icon h-12 w-12 disabled:opacity-20" onClick={prev} disabled={i === 0}><ChevronLeft size={28} /></button>
        <div
          className="relative w-[min(80vw,460px)] aspect-square rounded-3xl border border-white/10 overflow-hidden p-7 flex flex-col"
          style={{ background: `linear-gradient(155deg, ${p.hex}33, #0b0b13 60%)` }}
        >
          <div className="flex justify-between text-xs font-mono text-white/40">
            <span>{p.emoji} {content.pillar}</span><span>{i + 1}/{content.slides.length}</span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {slide?.title && <div className="text-sm font-extrabold uppercase tracking-wider mb-3" style={{ color: p.hex }}>{slide.title}</div>}
            <div className="text-xl md:text-2xl font-semibold leading-snug text-white whitespace-pre-wrap">{slide?.text}</div>
          </div>
        </div>
        <button className="btn-icon h-12 w-12 disabled:opacity-20" onClick={next} disabled={i === content.slides.length - 1}><ChevronRight size={28} /></button>
      </div>
      <div className="flex gap-1.5 mt-5" onClick={(e) => e.stopPropagation()}>
        {content.slides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`} />
        ))}
      </div>
    </div>
  )
}

export default function Carousels() {
  const contents = useStore((s) => s.contents)
  const addContent = useStore((s) => s.addContent)
  const [editId, setEditId] = useState<string | null>(null)
  const [presentId, setPresentId] = useState<string | null>(null)
  const [exportId, setExportId] = useState<string | null>(null)
  const [pillar, setPillar] = useState('')

  const carousels = useMemo(
    () => contents.filter((c) => c.format === 'Carrousel' && (!pillar || c.pillar === pillar))
      .sort((a, b) => b.slides.length - a.slides.length),
    [contents, pillar],
  )
  const present = presentId ? contents.find((c) => c.id === presentId) : null
  const exportContent = exportId ? contents.find((c) => c.id === exportId) : null

  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title="Carrousels"
        subtitle="Chaque slide en carré, visible une par une — comme dans le feed. Édite directement dans les cases."
        icon={<GalleryHorizontalEnd size={20} />}
        actions={
          <button className="btn-primary" onClick={() => {
            const id = addContent({ format: 'Carrousel', status: 'a-scripter', slides: [{ n: 1, title: 'HOOK', text: '' }] })
            setEditId(id)
          }}>
            <Plus size={16} /> Nouveau carrousel
          </button>
        }
      />

      <div className="flex items-center gap-1.5 mb-5 flex-wrap">
        <button onClick={() => setPillar('')}
          className={`chip transition ${!pillar ? 'bg-white/10 text-white border-white/20' : 'border-white/10 text-slate-400 hover:text-white'}`}>
          Tous
        </button>
        {PILLARS.slice(0, 8).map((p) => (
          <button key={p.id} onClick={() => setPillar(pillar === p.id ? '' : p.id)}
            className={`chip transition ${pillar === p.id ? `${p.bg} ${p.text} ${p.border}` : 'border-white/10 text-slate-400 hover:text-white'}`}>
            {p.emoji} {p.label}
          </button>
        ))}
        <span className="text-xs text-slate-500 ml-auto">{carousels.length} carrousels</span>
      </div>

      <div className="space-y-5">
        {carousels.map((c) => (
          <CarouselRow key={c.id} content={c} onEdit={() => setEditId(c.id)} onPresent={() => setPresentId(c.id)} onExport={() => setExportId(c.id)} />
        ))}
        {carousels.length === 0 && (
          <div className="card p-12 text-center text-slate-500">Aucun carrousel pour ce filtre.</div>
        )}
      </div>

      {editId && <ContentModal id={editId} onClose={() => setEditId(null)} />}
      {present && <Presenter content={present} onClose={() => setPresentId(null)} />}
      {exportContent && <CarouselExport content={exportContent} onClose={() => setExportId(null)} />}
    </div>
  )
}
