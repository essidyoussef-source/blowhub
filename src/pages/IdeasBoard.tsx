import { useMemo, useState } from 'react'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners, type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'
import { KanbanSquare, Plus, Search, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ContentCard from '../components/ContentCard'
import ContentModal from '../components/ContentModal'
import { useStore } from '../store'
import { STATUSES, PILLARS, FORMATS, pillarOf } from '../constants'
import type { Content, StatusId } from '../types'

function SortableCard({ content, onOpen }: { content: Content; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: content.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <ContentCard content={content} onClick={onOpen} />
    </div>
  )
}

function Column({
  status, items, onOpen,
}: { status: StatusId; items: Content[]; onOpen: (id: string) => void }) {
  const def = STATUSES.find((s) => s.id === status)!
  const { setNodeRef, isOver } = useDroppable({ id: `col:${status}` })
  return (
    <div className="w-[300px] shrink-0 flex flex-col">
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${def.dot}`} />
          <span className="font-semibold text-sm text-slate-200">{def.label}</span>
          <span className="text-xs text-slate-500 font-mono">{items.length}</span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[120px] rounded-2xl border p-2 space-y-2 transition-colors ${
          isOver ? `${def.bg} ${def.border}` : 'border-white/5 bg-ink-900/40'
        }`}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((c) => (
            <SortableCard key={c.id} content={c} onOpen={() => onOpen(c.id)} />
          ))}
        </SortableContext>
        {items.length === 0 && (
          <div className="grid place-items-center h-24 text-xs text-slate-600">Glisse une carte ici</div>
        )}
      </div>
    </div>
  )
}

export default function IdeasBoard() {
  const contents = useStore((s) => s.contents)
  const moveContent = useStore((s) => s.moveContent)
  const updateContent = useStore((s) => s.updateContent)
  const addContent = useStore((s) => s.addContent)

  const [openId, setOpenId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [pillar, setPillar] = useState<string>('')
  const [format, setFormat] = useState<string>('')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const filtered = useMemo(() => {
    return contents.filter((c) => {
      if (pillar && c.pillar !== pillar) return false
      if (format && c.format !== format) return false
      if (q) {
        const hay = `${c.title} ${c.hook} ${c.description} ${c.pillar}`.toLowerCase()
        if (!hay.includes(q.toLowerCase())) return false
      }
      return true
    })
  }, [contents, q, pillar, format])

  const columns = useMemo(() => {
    const map: Record<StatusId, Content[]> = Object.fromEntries(STATUSES.map((s) => [s.id, []])) as any
    for (const c of filtered) map[c.status].push(c)
    for (const s of STATUSES) map[s.id].sort((a, b) => a.order - b.order)
    return map
  }, [filtered])

  const activeContent = activeId ? contents.find((c) => c.id === activeId) : null

  const findColumn = (id: string): StatusId | null => {
    if (id.startsWith('col:')) return id.slice(4) as StatusId
    const c = contents.find((x) => x.id === id)
    return c ? c.status : null
  }

  const onDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string)

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e
    if (!over) return
    const activeCol = findColumn(active.id as string)
    const overCol = findColumn(over.id as string)
    if (!activeCol || !overCol || activeCol === overCol) return
    // déplacement vers une autre colonne : on change le statut
    updateContent(active.id as string, { status: overCol })
  }

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over) return
    const overCol = findColumn(over.id as string)
    if (!overCol) return
    const colItems = columns[overCol].filter((c) => c.id !== active.id)
    const overIndex = colItems.findIndex((c) => c.id === over.id)
    const insertAt = overIndex === -1 ? colItems.length : overIndex
    const reordered = [...colItems]
    const moving = contents.find((c) => c.id === active.id)
    if (moving) reordered.splice(insertAt, 0, { ...moving, status: overCol })
    reordered.forEach((c, i) => moveContent(c.id, overCol, i))
  }

  const activeFilters = pillar || format || q

  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title="Idées"
        subtitle="Glisse tes contenus de « idée » jusqu'à « publié ». Tout ton pipeline, d'un coup d'œil."
        icon={<KanbanSquare size={20} />}
        actions={
          <button className="btn-primary" onClick={() => { const id = addContent({ status: 'idee' }); setOpenId(id) }}>
            <Plus size={16} /> Nouvelle idée
          </button>
        }
      />

      {/* Filtres */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input pl-9 w-56" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {PILLARS.slice(0, 8).map((p) => (
            <button
              key={p.id}
              onClick={() => setPillar(pillar === p.id ? '' : p.id)}
              className={`chip transition ${pillar === p.id ? `${p.bg} ${p.text} ${p.border}` : 'border-white/10 text-slate-400 hover:text-white'}`}
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
        <select className="input w-auto !py-1.5 text-xs" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="">Tous formats</option>
          {FORMATS.map((f) => <option key={f.id} value={f.id}>{f.emoji} {f.label}</option>)}
        </select>
        {activeFilters && (
          <button className="btn-ghost !py-1.5 text-xs" onClick={() => { setQ(''); setPillar(''); setFormat('') }}>
            <X size={14} /> Effacer
          </button>
        )}
        <span className="text-xs text-slate-500 ml-auto">{filtered.length} contenu{filtered.length > 1 ? 's' : ''}</span>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-1 px-1">
          {STATUSES.map((s) => (
            <Column key={s.id} status={s.id} items={columns[s.id]} onOpen={setOpenId} />
          ))}
        </div>
        <DragOverlay>
          {activeContent ? <div className="w-[280px] rotate-2"><ContentCard content={activeContent} /></div> : null}
        </DragOverlay>
      </DndContext>

      {openId && <ContentModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}
