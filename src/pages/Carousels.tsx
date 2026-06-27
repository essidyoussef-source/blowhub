import { useMemo, useState } from 'react'
import {
  GalleryHorizontalEnd, Plus, Pencil, Maximize2, ChevronLeft, ChevronRight, X,
  ImageDown, ChevronDown, Trash2, FolderOpen, Tv,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ContentModal from '../components/ContentModal'
import CarouselExport from '../components/CarouselExport'
import SeriesPage from './Series'
import Segmented from '../components/Segmented'
import { useStore } from '../store'
import { PILLARS, pillarOf } from '../constants'
import { PillarBadge, StatusBadge } from '../components/Badges'
import type { Content, Slide } from '../types'

// ── Une slide carrée façon carrousel Instagram (thème clair) ───────────────
function SlideSquare({
  slide, index, total, hex, onChange, onRemove,
}: { slide: Slide; index: number; total: number; hex: string; onChange: (patch: Partial<Slide>) => void; onRemove: () => void }) {
  return (
    <div className="relative shrink-0 w-[208px] h-[208px] rounded-2xl bg-white border border-slate-900/10 shadow-soft overflow-hidden group">
      <div className="h-1.5 w-full" style={{ background: hex }} />
      <div className="flex items-center justify-between px-3 pt-2.5">
        <span className="grid h-6 w-6 place-items-center rounded-lg text-[11px] font-bold text-white" style={{ background: hex }}>
          {index + 1}
        </span>
        <span className="text-[10px] font-mono text-slate-500">{index + 1}/{total}</span>
        <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 btn-icon !h-6 !w-6 hover:text-blow-600 transition"><Trash2 size={13} /></button>
      </div>
      <div className="px-3 py-2 h-[150px] flex flex-col">
        <input
          value={slide.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder={index === 0 ? 'HOOK' : 'Titre…'}
          className="bg-transparent text-[11px] font-extrabold uppercase tracking-wide outline-none mb-1 placeholder:text-slate-300"
          style={{ color: hex }}
        />
        <textarea
          value={slide.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Texte de la slide…"
          className="flex-1 bg-transparent text-sm leading-snug text-slate-200 outline-none resize-none placeholder:text-slate-400 no-scrollbar"
        />
      </div>
    </div>
  )
}

// ── Vue "dossier" fermé : aperçu fanné des slides ──────────────────────────
function FolderPreview({ content, hex }: { content: Content; hex: string }) {
  const peek = content.slides.slice(0, 3)
  return (
    <div className="relative h-28 mb-3">
      {/* cartes qui dépassent */}
      <div className="absolute inset-x-6 top-0 flex justify-center">
        {(peek.length ? peek : [null, null]).map((s, i) => {
          const rot = (i - (peek.length ? peek.length - 1 : 1) / 2) * 7
          return (
            <div key={i}
              className="absolute w-20 h-24 rounded-xl bg-white border border-slate-900/10 shadow-soft p-2 overflow-hidden"
              style={{ transform: `rotate(${rot}deg) translateX(${rot * 1.6}px)`, transformOrigin: 'bottom center', zIndex: i }}>
              <div className="h-1 w-full rounded-full mb-1.5" style={{ background: hex }} />
              <div className="text-[7px] leading-tight text-slate-300 line-clamp-5">{(s as Slide | null)?.text ?? ''}</div>
            </div>
          )
        })}
      </div>
      {/* pochette du dossier */}
      <div className="absolute bottom-0 inset-x-0 h-16 rounded-2xl border-2"
        style={{ background: `${hex}10`, borderColor: `${hex}40` }} />
    </div>
  )
}

function CarouselFolder({ content, expanded, onToggle, onEdit, onExport, onPresent }: {
  content: Content; expanded: boolean; onToggle: () => void
  onEdit: () => void; onExport: () => void; onPresent: () => void
}) {
  const update = useStore((s) => s.updateContent)
  const remove = useStore((s) => s.deleteContent)
  const p = pillarOf(content.pillar)
  const setSlide = (i: number, patch: Partial<Slide>) =>
    update(content.id, { slides: content.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) })
  const addSlide = () =>
    update(content.id, { slides: [...content.slides, { n: content.slides.length + 1, title: '', text: '' }] })
  const removeSlide = (i: number) =>
    update(content.id, { slides: content.slides.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, n: idx + 1 })) })

  return (
    <div className={`card transition-all ${expanded ? 'col-span-full' : ''}`}>
      {/* En-tête cliquable */}
      <button onClick={onToggle} className="w-full text-left p-5">
        {!expanded && <FolderPreview content={content} hex={p.hex} />}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <PillarBadge id={content.pillar} sm />
              <StatusBadge id={content.status} />
            </div>
            <h3 className="font-display font-bold text-slate-100 leading-snug truncate">{content.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{content.slides.length} slide{content.slides.length > 1 ? 's' : ''}</p>
          </div>
          <span className={`grid h-8 w-8 place-items-center rounded-xl bg-slate-900/[0.04] text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={18} />
          </span>
        </div>
      </button>

      {/* Contenu déployé */}
      {expanded && (
        <div className="px-5 pb-5 -mt-1 animate-fade-in">
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {content.slides.length > 0 && (
              <>
                <button className="btn-ghost !py-1.5 !px-2.5 text-xs" onClick={onExport}><ImageDown size={14} /> Exporter</button>
                <button className="btn-ghost !py-1.5 !px-2.5 text-xs" onClick={onPresent}><Maximize2 size={14} /> Présenter</button>
              </>
            )}
            <button className="btn-ghost !py-1.5 !px-2.5 text-xs" onClick={onEdit}><Pencil size={14} /> Éditer la fiche</button>
            <button className="btn-ghost !py-1.5 !px-2.5 text-xs ml-auto hover:text-blow-600"
              onClick={() => { if (confirm('Supprimer ce carrousel ?')) remove(content.id) }}>
              <Trash2 size={14} /> Supprimer
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {content.slides.map((s, i) => (
              <SlideSquare key={i} slide={s} index={i} total={content.slides.length} hex={p.hex}
                onChange={(patch) => setSlide(i, patch)} onRemove={() => removeSlide(i)} />
            ))}
            <button onClick={addSlide}
              className="shrink-0 w-[208px] h-[208px] rounded-2xl border-2 border-dashed border-slate-900/15 grid place-items-center text-slate-400 hover:text-blow-600 hover:border-blow-300 transition">
              <span className="flex flex-col items-center gap-1 text-sm font-semibold"><Plus size={22} /> Ajouter une slide</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Mode présentation plein écran (clair) ──────────────────────────────────
function Presenter({ content, onClose }: { content: Content; onClose: () => void }) {
  const [i, setI] = useState(0)
  const p = pillarOf(content.pillar)
  const slide = content.slides[i]
  const prev = () => setI((x) => Math.max(0, x - 1))
  const next = () => setI((x) => Math.min(content.slides.length - 1, x + 1))
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur grid place-items-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 btn-icon bg-white shadow-soft" onClick={onClose}><X size={22} /></button>
      <div className="text-center mb-4 text-sm text-slate-200 font-semibold">{content.title}</div>
      <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <button className="btn-icon h-12 w-12 bg-white shadow-soft disabled:opacity-20" onClick={prev} disabled={i === 0}><ChevronLeft size={28} /></button>
        <div className="relative w-[min(80vw,460px)] aspect-square rounded-3xl bg-white border border-slate-900/10 shadow-card overflow-hidden p-7 flex flex-col">
          <div className="h-1.5 w-full rounded-full" style={{ background: p.hex }} />
          <div className="flex justify-between text-xs font-mono text-slate-400 mt-3">
            <span>{content.pillar}</span><span>{i + 1}/{content.slides.length}</span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {slide?.title && <div className="text-sm font-extrabold uppercase tracking-wider mb-3" style={{ color: p.hex }}>{slide.title}</div>}
            <div className="text-xl md:text-2xl font-semibold leading-snug text-slate-100 whitespace-pre-wrap">{slide?.text}</div>
          </div>
        </div>
        <button className="btn-icon h-12 w-12 bg-white shadow-soft disabled:opacity-20" onClick={next} disabled={i === content.slides.length - 1}><ChevronRight size={28} /></button>
      </div>
      <div className="flex gap-1.5 mt-5" onClick={(e) => e.stopPropagation()}>
        {content.slides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-6' : 'w-1.5 bg-slate-300'}`}
            style={idx === i ? { background: p.hex } : undefined} />
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
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [pillar, setPillar] = useState('')
  const [view, setView] = useState<'carousels' | 'series'>('carousels')

  const carousels = useMemo(
    () => contents.filter((c) => c.format === 'Carrousel' && (!pillar || c.pillar === pillar))
      .sort((a, b) => b.slides.length - a.slides.length),
    [contents, pillar],
  )
  const present = presentId ? contents.find((c) => c.id === presentId) : null
  const exportContent = exportId ? contents.find((c) => c.id === exportId) : null

  const newCarousel = () => {
    const id = addContent({ format: 'Carrousel', status: 'a-scripter', slides: [{ n: 1, title: 'HOOK', text: '' }] })
    setExpandedId(id)
  }

  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title="Carrousels"
        subtitle="Des dossiers de projets. Déplie pour faire défiler, éditer, ajouter ou supprimer des slides."
        icon={<GalleryHorizontalEnd size={20} />}
        actions={
          <div className="flex items-center gap-2">
            <Segmented value={view} onChange={setView} options={[
              { id: 'carousels', label: 'Carrousels', icon: GalleryHorizontalEnd },
              { id: 'series', label: 'Séries', icon: Tv },
            ]} />
            {view === 'carousels' && <button className="btn-primary" onClick={newCarousel}><Plus size={16} /> Nouveau</button>}
          </div>
        }
      />

      {view === 'series' ? <SeriesPage embedded /> : <>

      <div className="flex items-center gap-1.5 mb-5 flex-wrap">
        <button onClick={() => setPillar('')}
          className={`chip transition ${!pillar ? 'bg-slate-100 text-slate-100 border-slate-900/15' : 'border-slate-900/10 text-slate-400 hover:text-blow-600'}`}>
          Tous
        </button>
        {PILLARS.slice(0, 8).map((p) => (
          <button key={p.id} onClick={() => setPillar(pillar === p.id ? '' : p.id)}
            className={`chip transition ${pillar === p.id ? `${p.bg} ${p.text} ${p.border}` : 'border-slate-900/10 text-slate-400 hover:text-blow-600'}`}>
            <p.Icon size={12} className="shrink-0" /> {p.label}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-auto">{carousels.length} carrousels</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {carousels.map((c) => (
          <CarouselFolder key={c.id} content={c}
            expanded={expandedId === c.id}
            onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
            onEdit={() => setEditId(c.id)} onExport={() => setExportId(c.id)} onPresent={() => setPresentId(c.id)} />
        ))}
        {carousels.length === 0 && (
          <div className="card p-12 text-center text-slate-400 col-span-full flex flex-col items-center gap-3">
            <FolderOpen size={32} className="text-slate-300" />
            Aucun carrousel pour ce filtre.
          </div>
        )}
      </div>
      </>}

      {editId && <ContentModal id={editId} onClose={() => setEditId(null)} />}
      {present && <Presenter content={present} onClose={() => setPresentId(null)} />}
      {exportContent && <CarouselExport content={exportContent} onClose={() => setExportId(null)} />}
    </div>
  )
}
