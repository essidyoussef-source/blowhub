import { useMemo, useState } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks,
  addMonths, subMonths, format, isSameMonth, isSameDay, parseISO,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  DndContext, PointerSensor, useSensor, useSensors, useDraggable, useDroppable,
  DragOverlay, pointerWithin, type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core'
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, Clapperboard, Scissors, Send,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ContentModal from '../components/ContentModal'
import Production from './Production'
import { useStore } from '../store'
import { FORMATS, PLATFORMS, PILLARS, formatOf, platformOf, pillarOf } from '../constants'
import type { Content } from '../types'

const TODAY = new Date(2026, 5, 26)
type ColorMode = 'format' | 'platform' | 'pillar'
type View = 'day' | 'week' | 'month' | 'production'
type Kind = 'publish' | 'shoot' | 'edit'

function colorFor(c: Content, mode: ColorMode): string {
  if (mode === 'format') return formatOf(c.format).hex
  if (mode === 'platform') return platformOf(c.platform).hex
  return pillarOf(c.pillar).hex
}

// ── Carte d'évènement (semaine / jour), draggable pour les publications ────
function EventCard({ content, kind, mode, onOpen }: { content: Content; kind: Kind; mode: ColorMode; onOpen: () => void }) {
  const draggable = kind === 'publish'
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `post:${content.id}`, disabled: !draggable })
  const color = kind === 'shoot' ? '#f3b58f' : kind === 'edit' ? '#8fd5cb' : colorFor(content, mode)
  const Icon = kind === 'shoot' ? Clapperboard : kind === 'edit' ? Scissors : null
  return (
    <button
      ref={draggable ? setNodeRef : undefined}
      {...(draggable ? attributes : {})}
      {...(draggable ? listeners : {})}
      onClick={onOpen}
      style={{ background: `${color}1a`, borderColor: `${color}55`, opacity: isDragging ? 0.3 : 1 }}
      className={`w-full text-left rounded-2xl border px-2.5 py-2 transition hover:shadow-soft touch-none ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      title={content.title}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
        {Icon ? <Icon size={11} style={{ color }} /> : <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color }}>{kind === 'publish' ? content.format : ''}</span>}
      </div>
      <div className="text-[12px] font-semibold text-slate-100 leading-tight line-clamp-2">{content.title}</div>
    </button>
  )
}

// ── Mini-mois (rail gauche) ─────────────────────────────────────────────────
function MiniMonth({ cursor, onPick, marked }: { cursor: Date; onPick: (d: Date) => void; marked: Set<string> }) {
  const [m, setM] = useState(cursor)
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(m), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(m), { weekStartsOn: 1 })
    const out: Date[] = []
    for (let d = start; d <= end; d = addDays(d, 1)) out.push(d)
    return out
  }, [m])
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-display font-bold text-slate-100 capitalize text-sm">{format(m, 'MMMM yyyy', { locale: fr })}</span>
        <div className="flex gap-1">
          <button className="btn-icon !h-6 !w-6" onClick={() => setM(subMonths(m, 1))}><ChevronLeft size={14} /></button>
          <button className="btn-icon !h-6 !w-6" onClick={() => setM(addMonths(m, 1))}><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <div key={i} className="text-[10px] font-bold text-slate-400 py-1">{d}</div>)}
        {days.map((d) => {
          const k = format(d, 'yyyy-MM-dd')
          const sel = isSameDay(d, cursor)
          const today = isSameDay(d, TODAY)
          return (
            <button key={k} onClick={() => onPick(d)}
              className={`relative h-7 rounded-lg text-[11px] font-semibold transition ${
                sel ? 'bg-blow-500 text-white' : today ? 'text-blow-600' : isSameMonth(d, m) ? 'text-slate-200 hover:bg-slate-900/[0.05]' : 'text-slate-400'
              }`}>
              {format(d, 'd')}
              {marked.has(k) && !sel && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blow-500" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DayColumn({ day, items, mode, onAdd, onOpen, big }: {
  day: Date; items: { c: Content; kind: Kind }[]; mode: ColorMode; onAdd: () => void; onOpen: (id: string) => void; big?: boolean
}) {
  const key = format(day, 'yyyy-MM-dd')
  const { setNodeRef, isOver } = useDroppable({ id: `day:${key}` })
  const today = isSameDay(day, TODAY)
  return (
    <div className={`flex flex-col ${big ? 'w-full' : 'flex-1 min-w-[150px]'}`}>
      <div className="text-center mb-2">
        <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{format(day, 'EEE', { locale: fr })}</div>
        <div className={`text-lg font-display font-extrabold ${today ? 'text-blow-600' : 'text-slate-100'}`}>
          <span className={today ? 'inline-grid place-items-center h-8 w-8 rounded-full bg-blow-500 text-white' : ''}>{format(day, 'd')}</span>
        </div>
      </div>
      <div ref={setNodeRef}
        className={`group flex-1 min-h-[420px] rounded-2xl border p-2 space-y-2 transition-colors ${isOver ? 'bg-blow-50 border-blow-200' : 'bg-white/60 border-slate-900/[0.06]'}`}>
        {items.map(({ c, kind }) => <EventCard key={kind + c.id} content={c} kind={kind} mode={mode} onOpen={() => onOpen(c.id)} />)}
        <button onClick={onAdd} className="w-full opacity-0 group-hover:opacity-100 transition rounded-xl border border-dashed border-slate-900/15 py-1.5 text-xs text-slate-400 hover:text-blow-600">
          <Plus size={13} className="inline" /> Programmer
        </button>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const contents = useStore((s) => s.contents)
  const addContent = useStore((s) => s.addContent)
  const updateContent = useStore((s) => s.updateContent)
  const [cursor, setCursor] = useState<Date>(TODAY)
  const [view, setView] = useState<View>('week')
  const [mode, setMode] = useState<ColorMode>('format')
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [show, setShow] = useState<Record<Kind, boolean>>({ publish: true, shoot: true, edit: true })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const byDay = useMemo(() => {
    const map: Record<string, { c: Content; kind: Kind }[]> = {}
    const add = (date: string | null | undefined, kind: Kind, c: Content) => {
      if (!date || !show[kind]) return
      ;(map[date] = map[date] ?? []).push({ c, kind })
    }
    for (const c of contents) {
      add(c.publishDate, 'publish', c)
      add(c.shootDate, 'shoot', c)
      add(c.editDate, 'edit', c)
    }
    return map
  }, [contents, show])

  const markedDays = useMemo(() => new Set(Object.keys(byDay)), [byDay])

  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [cursor])

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 })
    const out: Date[] = []
    for (let d = start; d <= end; d = addDays(d, 1)) out.push(d)
    return out
  }, [cursor])

  const activeContent = activeId ? contents.find((c) => c.id === activeId) : null
  const legend = mode === 'format' ? FORMATS : mode === 'platform' ? PLATFORMS : PILLARS.slice(0, 8)

  const rangeLabel = view === 'month'
    ? format(cursor, 'MMMM yyyy', { locale: fr })
    : view === 'day'
      ? format(cursor, 'EEEE d MMMM', { locale: fr })
      : `${format(weekDays[0], 'd MMM', { locale: fr })} – ${format(weekDays[6], 'd MMM yyyy', { locale: fr })}`

  const nav = (dir: number) => {
    if (view === 'month') setCursor(dir > 0 ? addMonths(cursor, 1) : subMonths(cursor, 1))
    else if (view === 'week') setCursor(dir > 0 ? addWeeks(cursor, 1) : subWeeks(cursor, 1))
    else setCursor(addDays(cursor, dir))
  }

  const onDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id)
    if (id.startsWith('post:')) setActiveId(id.slice(5))
  }
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over) return
    const aid = String(active.id), oid = String(over.id)
    if (aid.startsWith('post:') && oid.startsWith('day:')) updateContent(aid.slice(5), { publishDate: oid.slice(4) })
  }

  const addOn = (key: string) => { const id = addContent({ status: 'programme', publishDate: key }); setOpenId(id) }

  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title="Planning"
        subtitle="Ton calendrier éditorial et ta production, au même endroit."
        icon={<CalendarDays size={20} />}
        actions={
          <button className="btn-primary" onClick={() => addOn(format(cursor, 'yyyy-MM-dd'))}><Plus size={16} /> Programmer</button>
        }
      />

      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-5 items-start">
          {/* Rail gauche */}
          <div className="hidden lg:flex w-64 shrink-0 flex-col gap-4 sticky top-24">
            <MiniMonth cursor={cursor} onPick={(d) => { setCursor(d); if (view === 'month') setView('week') }} marked={markedDays} />

            <div className="card p-4">
              <div className="label">Afficher</div>
              {([['publish', 'Publications', Send, '#b3a3f3'], ['shoot', 'Tournages', Clapperboard, '#f3b58f'], ['edit', 'Montages', Scissors, '#8fd5cb']] as const).map(([k, lbl, Icon, hex]) => (
                <label key={k} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <input type="checkbox" checked={show[k]} onChange={(e) => setShow((s) => ({ ...s, [k]: e.target.checked }))}
                    className="accent-blow-500 h-4 w-4" />
                  <Icon size={14} style={{ color: hex }} />
                  <span className="text-sm text-slate-200">{lbl}</span>
                </label>
              ))}
            </div>

            <div className="card p-4">
              <div className="label">Couleur des posts</div>
              <div className="flex gap-1.5 rounded-xl bg-slate-900/[0.04] p-1 mb-3">
                {(['format', 'platform', 'pillar'] as ColorMode[]).map((m) => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition ${mode === m ? 'bg-blow-500 text-white' : 'text-slate-400 hover:text-blow-600'}`}>
                    {m === 'format' ? 'Format' : m === 'platform' ? 'Plateforme' : 'Pilier'}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                {legend.map((l: any) => (
                  <span key={l.id} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.hex }} /> {l.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Zone principale */}
          <div className="flex-1 min-w-0">
            <div className="card p-4 mb-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button className="btn-icon" onClick={() => nav(-1)}><ChevronLeft size={18} /></button>
                <div className="text-lg font-display font-bold text-slate-100 capitalize min-w-[180px] text-center">{rangeLabel}</div>
                <button className="btn-icon" onClick={() => nav(1)}><ChevronRight size={18} /></button>
                <button className="btn-ghost !py-1.5 text-xs ml-1" onClick={() => setCursor(TODAY)}>Aujourd'hui</button>
              </div>
              <div className="flex gap-1.5 rounded-full bg-white/60 border border-white/70 p-1">
                {(['day', 'week', 'month', 'production'] as View[]).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${view === v ? 'text-white shadow-glow' : 'text-slate-300 hover:text-blow-600'}`}
                    style={view === v ? { backgroundImage: 'linear-gradient(135deg,#9d85f4,#6a54ee)' } : undefined}>
                    {v === 'day' ? 'Jour' : v === 'week' ? 'Semaine' : v === 'month' ? 'Mois' : 'Production'}
                  </button>
                ))}
              </div>
            </div>

            {/* WEEK */}
            {view === 'week' && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {weekDays.map((d) => {
                  const k = format(d, 'yyyy-MM-dd')
                  return <DayColumn key={k} day={d} items={byDay[k] ?? []} mode={mode} onAdd={() => addOn(k)} onOpen={setOpenId} />
                })}
              </div>
            )}

            {/* DAY */}
            {view === 'day' && (
              <div className="max-w-md">
                <DayColumn day={cursor} items={byDay[format(cursor, 'yyyy-MM-dd')] ?? []} mode={mode} onAdd={() => addOn(format(cursor, 'yyyy-MM-dd'))} onOpen={setOpenId} big />
              </div>
            )}

            {/* PRODUCTION */}
            {view === 'production' && <Production embedded />}

            {/* MONTH */}
            {view === 'month' && (
              <div className="card overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-900/[0.06]">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
                    <div key={d} className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {monthDays.map((day) => {
                    const k = format(day, 'yyyy-MM-dd')
                    const inMonth = isSameMonth(day, cursor)
                    const items = byDay[k] ?? []
                    return <MonthCell key={k} day={day} inMonth={inMonth} items={items} mode={mode} onAdd={() => addOn(k)} onOpen={setOpenId} />
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeContent ? (
            <div className="rounded-xl px-2.5 py-2 text-[12px] font-semibold text-white shadow-glow" style={{ background: colorFor(activeContent, mode) }}>
              {activeContent.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {openId && <ContentModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}

function MonthCell({ day, inMonth, items, mode, onAdd, onOpen }: {
  day: Date; inMonth: boolean; items: { c: Content; kind: Kind }[]; mode: ColorMode; onAdd: () => void; onOpen: (id: string) => void
}) {
  const key = format(day, 'yyyy-MM-dd')
  const { setNodeRef, isOver } = useDroppable({ id: `day:${key}` })
  const today = isSameDay(day, TODAY)
  return (
    <div ref={setNodeRef}
      className={`group min-h-[110px] border-b border-r border-slate-900/[0.06] p-1.5 relative transition-colors ${inMonth ? '' : 'bg-slate-900/[0.02]'} ${isOver ? 'bg-blow-50' : ''}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-semibold grid place-items-center h-6 w-6 rounded-full ${today ? 'bg-blow-500 text-white' : inMonth ? 'text-slate-300' : 'text-slate-400'}`}>{format(day, 'd')}</span>
        <button onClick={onAdd} className="opacity-0 group-hover:opacity-100 btn-icon !h-6 !w-6 transition"><Plus size={13} /></button>
      </div>
      <div className="space-y-1">
        {items.slice(0, 4).map(({ c, kind }) => {
          const color = kind === 'shoot' ? '#f3b58f' : kind === 'edit' ? '#8fd5cb' : colorFor(c, mode)
          return (
            <button key={kind + c.id} onClick={() => onOpen(c.id)}
              className="w-full text-left rounded-md px-1.5 py-0.5 text-[10px] font-medium text-slate-100 truncate"
              style={{ background: `${color}1f`, boxShadow: `inset 2px 0 0 ${color}` }}>
              {c.title}
            </button>
          )
        })}
        {items.length > 4 && <div className="text-[10px] text-slate-400 px-1.5">+{items.length - 4}</div>}
      </div>
    </div>
  )
}
