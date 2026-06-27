import { useMemo, useState } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths,
  format, isSameMonth, isSameDay, parseISO,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  DndContext, PointerSensor, useSensor, useSensors, useDraggable, useDroppable,
  DragOverlay, pointerWithin, type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core'
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Clapperboard, Scissors } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ContentModal from '../components/ContentModal'
import { useStore } from '../store'
import { FORMATS, PLATFORMS, PILLARS, formatOf, platformOf, pillarOf } from '../constants'
import type { Content } from '../types'

type ColorMode = 'format' | 'platform' | 'pillar'

function colorFor(c: Content, mode: ColorMode): string {
  if (mode === 'format') return formatOf(c.format).hex
  if (mode === 'platform') return platformOf(c.platform).hex
  return pillarOf(c.pillar).hex
}

function PostChip({ content, mode, onOpen }: { content: Content; mode: ColorMode; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `post:${content.id}` })
  const color = colorFor(content, mode)
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onOpen}
      style={{ background: `${color}33`, boxShadow: `inset 2px 0 0 ${color}`, opacity: isDragging ? 0.3 : 1 }}
      className="w-full text-left rounded-md px-1.5 py-1 text-[11px] font-medium text-white/90 truncate hover:brightness-125 transition touch-none cursor-grab active:cursor-grabbing"
      title={content.title}
    >
      {content.title}
    </button>
  )
}

function DayCell({
  day, inMonth, isToday, cell, mode, onAdd, onOpen,
}: {
  day: Date; inMonth: boolean; isToday: boolean
  cell?: { publish: Content[]; shoot: Content[]; edit: Content[] }
  mode: ColorMode; onAdd: () => void; onOpen: (id: string) => void
}) {
  const key = format(day, 'yyyy-MM-dd')
  const { setNodeRef, isOver } = useDroppable({ id: `day:${key}` })
  return (
    <div
      ref={setNodeRef}
      className={`group min-h-[118px] border-b border-r border-slate-900/[0.06] p-1.5 relative transition-colors ${
        inMonth ? '' : 'bg-black/20'
      } ${isOver ? 'bg-blow-500/10 ring-1 ring-inset ring-blow-500/40' : ''}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-semibold grid place-items-center h-6 w-6 rounded-full ${isToday ? 'bg-blow-500 text-white' : inMonth ? 'text-slate-400' : 'text-slate-600'}`}>
          {format(day, 'd')}
        </span>
        <button onClick={onAdd} className="opacity-0 group-hover:opacity-100 btn-icon !h-6 !w-6 transition" title="Programmer ici"><Plus size={13} /></button>
      </div>
      <div className="space-y-1">
        {cell?.publish.map((c) => <PostChip key={c.id} content={c} mode={mode} onOpen={() => onOpen(c.id)} />)}
        {cell?.shoot.map((c) => (
          <button key={'s' + c.id} onClick={() => onOpen(c.id)}
            className="w-full flex items-center gap-1 text-left rounded-md px-1.5 py-0.5 text-[10px] text-orange-700 bg-orange-50 truncate">
            <Clapperboard size={10} /> {c.title}
          </button>
        ))}
        {cell?.edit.map((c) => (
          <button key={'e' + c.id} onClick={() => onOpen(c.id)}
            className="w-full flex items-center gap-1 text-left rounded-md px-1.5 py-0.5 text-[10px] text-teal-700 bg-teal-50 truncate">
            <Scissors size={10} /> {c.title}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const contents = useStore((s) => s.contents)
  const addContent = useStore((s) => s.addContent)
  const updateContent = useStore((s) => s.updateContent)
  const [cursor, setCursor] = useState(() => new Date(2026, 5, 1)) // juin 2026
  const [mode, setMode] = useState<ColorMode>('format')
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 })
    const out: Date[] = []
    for (let d = start; d <= end; d = addDays(d, 1)) out.push(d)
    return out
  }, [cursor])

  const byDay = useMemo(() => {
    const map: Record<string, { publish: Content[]; shoot: Content[]; edit: Content[] }> = {}
    const push = (key: string, bucket: 'publish' | 'shoot' | 'edit', c: Content) => {
      map[key] = map[key] ?? { publish: [], shoot: [], edit: [] }
      map[key][bucket].push(c)
    }
    for (const c of contents) {
      if (c.publishDate) push(c.publishDate, 'publish', c)
      if (c.shootDate) push(c.shootDate, 'shoot', c)
      if (c.editDate) push(c.editDate, 'edit', c)
    }
    return map
  }, [contents])

  const legend = mode === 'format' ? FORMATS : mode === 'platform' ? PLATFORMS : PILLARS.slice(0, 8)
  const scheduledCount = contents.filter((c) => c.publishDate && isSameMonth(parseISO(c.publishDate), cursor)).length
  const activeContent = activeId ? contents.find((c) => c.id === activeId) : null

  const onDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id)
    if (id.startsWith('post:')) setActiveId(id.slice(5))
  }
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over) return
    const aid = String(active.id)
    const oid = String(over.id)
    if (aid.startsWith('post:') && oid.startsWith('day:')) {
      updateContent(aid.slice(5), { publishDate: oid.slice(4) })
    }
  }

  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title="Calendrier éditorial"
        subtitle="Glisse un post pour le reprogrammer. Code couleur configurable."
        icon={<CalendarDays size={20} />}
        actions={
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-900/[0.04] p-1">
            {(['format', 'platform', 'pillar'] as ColorMode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${mode === m ? 'bg-blow-500 text-white' : 'text-slate-400 hover:text-blow-600'}`}>
                {m === 'format' ? 'Format' : m === 'platform' ? 'Plateforme' : 'Pilier'}
              </button>
            ))}
          </div>
        }
      />

      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button className="btn-icon" onClick={() => setCursor(subMonths(cursor, 1))}><ChevronLeft size={18} /></button>
          <div className="text-lg font-display font-bold text-slate-100 capitalize w-44 text-center">{format(cursor, 'MMMM yyyy', { locale: fr })}</div>
          <button className="btn-icon" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight size={18} /></button>
          <button className="btn-ghost !py-1.5 text-xs ml-2" onClick={() => setCursor(new Date(2026, 5, 1))}>Aujourd'hui</button>
          <span className="text-xs text-slate-500 ml-2">{scheduledCount} publication{scheduledCount > 1 ? 's' : ''} ce mois</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {legend.map((l: any) => (
            <span key={l.id} className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.hex }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-900/[0.06]">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
              <div key={d} className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day) => {
              const key = format(day, 'yyyy-MM-dd')
              return (
                <DayCell
                  key={key}
                  day={day}
                  inMonth={isSameMonth(day, cursor)}
                  isToday={isSameDay(day, new Date(2026, 5, 26))}
                  cell={byDay[key]}
                  mode={mode}
                  onAdd={() => { const id = addContent({ status: 'programme', publishDate: key }); setOpenId(id) }}
                  onOpen={setOpenId}
                />
              )
            })}
          </div>
        </div>
        <DragOverlay>
          {activeContent ? (
            <div className="rounded-md px-2 py-1 text-[11px] font-medium text-white shadow-glow" style={{ background: colorFor(activeContent, mode) }}>
              {activeContent.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <p className="text-xs text-slate-500 mt-3">
        Glisse-dépose un post sur un autre jour pour le reprogrammer. Les dates de tournage et de montage apparaissent aussi ici.
      </p>

      {openId && <ContentModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}
