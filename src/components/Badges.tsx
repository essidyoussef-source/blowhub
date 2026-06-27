import { Flame } from 'lucide-react'
import { pillarOf, formatOf, platformOf, statusOf, priorityOf, frameworkHint } from '../constants'
import type { Content } from '../types'

export function PillarBadge({ id, sm }: { id?: string; sm?: boolean }) {
  const p = pillarOf(id)
  const s = sm ? 11 : 13
  return (
    <span className={`chip ${p.bg} ${p.text} ${p.border} ${sm ? 'text-[10px] px-2 py-0' : ''}`}>
      <p.Icon size={s} />
      {p.label}
    </span>
  )
}

export function FormatBadge({ id, sm }: { id?: Content['format']; sm?: boolean }) {
  const f = formatOf(id)
  const s = sm ? 11 : 13
  return (
    <span className={`chip ${f.bg} ${f.text} ${f.border} ${sm ? 'text-[10px] px-2 py-0' : ''}`}>
      <f.Icon size={s} />
      {f.label}
    </span>
  )
}

export function PlatformBadge({ id, sm }: { id?: Content['platform']; sm?: boolean }) {
  const p = platformOf(id)
  const s = sm ? 11 : 13
  return (
    <span className={`chip ${p.bg} ${p.text} ${p.border} ${sm ? 'text-[10px] px-2 py-0' : ''}`}>
      <p.Icon size={s} />
      {p.label}
    </span>
  )
}

export function StatusBadge({ id }: { id: Content['status'] }) {
  const s = statusOf(id)
  return (
    <span className={`chip ${s.bg} ${s.text} ${s.border}`}>
      <s.Icon size={12} />
      {s.label}
    </span>
  )
}

export function PriorityBadge({ id }: { id?: Content['priority'] }) {
  const p = priorityOf(id)
  if (p.id === 'basse') return null
  return (
    <span className={`chip ${p.bg} ${p.text} border-transparent`}>
      {p.id === 'haute' && <Flame size={11} />}
      {p.label}
    </span>
  )
}

export function FrameworkBadge({ id }: { id?: string | null }) {
  if (!id) return null
  return (
    <span className="chip border-slate-900/10 bg-slate-900/[0.03] text-slate-400" title={frameworkHint[id] ?? ''}>
      {id}
    </span>
  )
}
