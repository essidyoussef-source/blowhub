import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  X, Trash2, Copy, Plus, GripVertical, Calendar, Clapperboard, Scissors, Hash,
} from 'lucide-react'
import { useStore } from '../store'
import {
  PILLARS, FORMATS, PLATFORMS, STATUSES, PRIORITIES, FRAMEWORKS, frameworkHint, pillarOf,
} from '../constants'
import type { Content, Slide } from '../types'
import { Field, Select } from './Field'

export default function ContentModal({ id, onClose }: { id: string; onClose: () => void }) {
  const content = useStore((s) => s.contents.find((c) => c.id === id))
  const update = useStore((s) => s.updateContent)
  const remove = useStore((s) => s.deleteContent)
  const duplicate = useStore((s) => s.duplicateContent)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!content) return null
  const set = (patch: Partial<Content>) => update(id, patch)
  const p = pillarOf(content.pillar)

  const setSlide = (i: number, patch: Partial<Slide>) => {
    const slides = content.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    set({ slides })
  }
  const addSlide = () =>
    set({ slides: [...content.slides, { n: content.slides.length + 1, title: '', text: '' }] })
  const removeSlide = (i: number) =>
    set({ slides: content.slides.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, n: idx + 1 })) })

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className="relative z-10 w-full md:max-w-3xl md:rounded-3xl bg-ink-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-screen md:max-h-[90vh] animate-fade-in"
        style={{ boxShadow: `0 0 0 1px ${p.hex}22, 0 30px 80px -20px #000` }}
      >
        {/* Bandeau couleur pilier */}
        <div className="h-1.5 w-full" style={{ background: p.hex }} />

        {/* Header */}
        <div className="flex items-start gap-3 px-5 md:px-7 pt-4 pb-3 border-b border-white/5">
          <div className="flex-1">
            <input
              value={content.title}
              onChange={(e) => set({ title: e.target.value })}
              placeholder="Titre du contenu…"
              className="w-full bg-transparent text-xl md:text-2xl font-display font-extrabold text-white outline-none placeholder:text-slate-600"
            />
            <input
              value={content.hook}
              onChange={(e) => set({ hook: e.target.value })}
              placeholder="Hook / accroche (slide 1)…"
              className="w-full bg-transparent text-sm text-slate-400 outline-none placeholder:text-slate-600 mt-0.5"
            />
          </div>
          <div className="flex items-center gap-1">
            <button className="btn-icon" title="Dupliquer" onClick={() => { duplicate(id); onClose() }}><Copy size={16} /></button>
            <button
              className="btn-icon hover:text-rose-400"
              title="Supprimer"
              onClick={() => { if (confirm('Supprimer ce contenu ?')) { remove(id); onClose() } }}
            ><Trash2 size={16} /></button>
            <button className="btn-icon" title="Fermer" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 md:px-7 py-5 space-y-6">
          {/* Taxonomie */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Field label="Pilier">
              <Select value={content.pillar} onChange={(v) => set({ pillar: v })}
                options={PILLARS.map((x) => ({ value: x.id, label: `${x.emoji} ${x.label}` }))} />
            </Field>
            <Field label="Format">
              <Select value={content.format} onChange={(v) => set({ format: v as Content['format'] })}
                options={FORMATS.map((x) => ({ value: x.id, label: `${x.emoji} ${x.label}` }))} />
            </Field>
            <Field label="Plateforme">
              <Select value={content.platform} onChange={(v) => set({ platform: v as Content['platform'] })}
                options={PLATFORMS.map((x) => ({ value: x.id, label: x.label }))} />
            </Field>
            <Field label="Statut">
              <Select value={content.status} onChange={(v) => set({ status: v as Content['status'] })}
                options={STATUSES.map((x) => ({ value: x.id, label: x.label }))} />
            </Field>
            <Field label="Priorité">
              <Select value={content.priority} onChange={(v) => set({ priority: v as Content['priority'] })}
                options={PRIORITIES.map((x) => ({ value: x.id, label: x.label }))} />
            </Field>
            <Field label="Framework (angle)">
              <Select value={content.framework ?? ''} onChange={(v) => set({ framework: v || null })}
                options={[{ value: '', label: '—' }, ...FRAMEWORKS.map((x) => ({ value: x, label: x }))]} />
            </Field>
          </div>
          {content.framework && (
            <p className="-mt-3 text-xs text-slate-500">💡 {frameworkHint[content.framework]}</p>
          )}

          <Field label="Objectif">
            <input className="input" value={content.objective ?? ''} placeholder="ex: Autorité, Émotion, Éducation, Viralité…"
              onChange={(e) => set({ objective: e.target.value })} />
          </Field>

          <Field label="Description / angle">
            <textarea className="input min-h-[72px] resize-y" value={content.description ?? ''}
              placeholder="L'angle, le pitch, ce que ça raconte…"
              onChange={(e) => set({ description: e.target.value })} />
          </Field>

          {/* Slides */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="label !mb-0">Slides ({content.slides.length})</span>
              <button className="btn-ghost !py-1 !px-2.5 text-xs" onClick={addSlide}><Plus size={14} /> Slide</button>
            </div>
            <div className="space-y-2">
              {content.slides.map((s, i) => (
                <div key={i} className="flex gap-2 items-start rounded-xl bg-ink-850 border border-white/5 p-2.5">
                  <div className="flex flex-col items-center pt-1 text-slate-600">
                    <GripVertical size={14} />
                    <span className="mt-1 grid h-6 w-6 place-items-center rounded-md bg-white/5 text-[11px] font-bold text-slate-300">{i + 1}</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input className="input !py-1.5 !text-xs font-semibold" value={s.title ?? ''} placeholder="Titre de la slide (optionnel)"
                      onChange={(e) => setSlide(i, { title: e.target.value })} />
                    <textarea className="input !py-1.5 min-h-[44px] resize-y text-sm" value={s.text} placeholder="Contenu de la slide…"
                      onChange={(e) => setSlide(i, { text: e.target.value })} />
                  </div>
                  <button className="btn-icon hover:text-rose-400 shrink-0" onClick={() => removeSlide(i)}><Trash2 size={14} /></button>
                </div>
              ))}
              {content.slides.length === 0 && (
                <button onClick={addSlide} className="w-full rounded-xl border border-dashed border-white/10 py-6 text-sm text-slate-500 hover:text-slate-300 hover:border-white/20 transition">
                  + Ajouter la première slide
                </button>
              )}
            </div>
          </div>

          {/* CTA / Caption / Hashtags */}
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="CTA">
              <input className="input" value={content.cta ?? ''} placeholder="ex: Enregistre ce post"
                onChange={(e) => set({ cta: e.target.value })} />
            </Field>
            <Field label={'Hashtags'}>
              <div className="relative">
                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input className="input pl-8" value={content.hashtags ?? ''} placeholder="#mindset #fitness…"
                  onChange={(e) => set({ hashtags: e.target.value })} />
              </div>
            </Field>
          </div>
          <Field label="Caption">
            <textarea className="input min-h-[72px] resize-y" value={content.caption ?? ''} placeholder="La légende du post…"
              onChange={(e) => set({ caption: e.target.value })} />
          </Field>

          {/* Dates de production */}
          <div className="grid grid-cols-3 gap-3">
            <Field label="📅 Publication">
              <DateInput value={content.publishDate} icon={<Calendar size={14} />} onChange={(v) => set({ publishDate: v })} />
            </Field>
            <Field label="🎬 Tournage">
              <DateInput value={content.shootDate} icon={<Clapperboard size={14} />} onChange={(v) => set({ shootDate: v })} />
            </Field>
            <Field label="✂️ Montage">
              <DateInput value={content.editDate} icon={<Scissors size={14} />} onChange={(v) => set({ editDate: v })} />
            </Field>
          </div>

          <Field label="Notes">
            <textarea className="input min-h-[56px] resize-y" value={content.notes ?? ''} placeholder="Notes internes, inspirations, références…"
              onChange={(e) => set({ notes: e.target.value })} />
          </Field>

          {content.source && (
            <p className="text-[11px] text-slate-600">Source : {content.source}</p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

function DateInput({ value, onChange }: { value?: string | null; icon?: React.ReactNode; onChange: (v: string | null) => void }) {
  return (
    <input
      type="date"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="input [color-scheme:dark] !text-xs"
    />
  )
}
