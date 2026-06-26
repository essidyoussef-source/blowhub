import { pillarOf, formatOf, platformOf, statusOf, priorityOf, frameworkHint } from '../constants'
import type { Content } from '../types'

export function PillarBadge({ id, sm }: { id?: string; sm?: boolean }) {
  const p = pillarOf(id)
  return (
    <span className={`chip ${p.bg} ${p.text} ${p.border} ${sm ? 'text-[10px] px-2 py-0' : ''}`}>
      <span>{p.emoji}</span>
      {p.label}
    </span>
  )
}

export function FormatBadge({ id, sm }: { id?: Content['format']; sm?: boolean }) {
  const f = formatOf(id)
  return (
    <span className={`chip ${f.bg} ${f.text} ${f.border} ${sm ? 'text-[10px] px-2 py-0' : ''}`}>
      <span>{f.emoji}</span>
      {f.label}
    </span>
  )
}

export function PlatformBadge({ id, sm }: { id?: Content['platform']; sm?: boolean }) {
  const p = platformOf(id)
  return (
    <span className={`chip ${p.bg} ${p.text} ${p.border} ${sm ? 'text-[10px] px-2 py-0' : ''}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.hex }} />
      {p.label}
    </span>
  )
}

export function StatusBadge({ id }: { id: Content['status'] }) {
  const s = statusOf(id)
  return (
    <span className={`chip ${s.bg} ${s.text} ${s.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

export function PriorityBadge({ id }: { id?: Content['priority'] }) {
  const p = priorityOf(id)
  if (p.id === 'basse') return null
  return (
    <span className={`chip ${p.bg} ${p.text} border-transparent`}>
      <span>{p.id === 'haute' ? '🔥' : '•'}</span>
      {p.label}
    </span>
  )
}

export function FrameworkBadge({ id }: { id?: string | null }) {
  if (!id) return null
  return (
    <span className="chip border-white/10 bg-white/5 text-slate-300" title={frameworkHint[id] ?? ''}>
      {id}
    </span>
  )
}
