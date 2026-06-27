import { Flame } from 'lucide-react'
import { pillarOf, formatOf, platformOf, statusOf, priorityOf, frameworkHint, tone } from '../constants'
import type { Content } from '../types'

export function PillarBadge({ id, sm }: { id?: string; sm?: boolean }) {
  const p = pillarOf(id)
  return (
    <span className={`chip border ${sm ? 'text-[10px] px-2 py-0' : ''}`} style={tone(p.hex, p.ink)}>
      <p.Icon size={sm ? 11 : 13} /> {p.label}
    </span>
  )
}

export function FormatBadge({ id, sm }: { id?: Content['format']; sm?: boolean }) {
  const f = formatOf(id)
  return (
    <span className={`chip border ${sm ? 'text-[10px] px-2 py-0' : ''}`} style={tone(f.hex, f.ink)}>
      <f.Icon size={sm ? 11 : 13} /> {f.label}
    </span>
  )
}

export function PlatformBadge({ id, sm }: { id?: Content['platform']; sm?: boolean }) {
  const p = platformOf(id)
  return (
    <span className={`chip border ${sm ? 'text-[10px] px-2 py-0' : ''}`} style={tone(p.hex, p.ink)}>
      <p.Icon size={sm ? 11 : 13} /> {p.label}
    </span>
  )
}

export function StatusBadge({ id }: { id: Content['status'] }) {
  const s = statusOf(id)
  return (
    <span className="chip border" style={tone(s.hex, s.ink)}>
      <s.Icon size={12} /> {s.label}
    </span>
  )
}

export function PriorityBadge({ id }: { id?: Content['priority'] }) {
  const p = priorityOf(id)
  if (p.id === 'basse') return null
  return (
    <span className="chip border-transparent" style={{ background: `${p.hex}26`, color: p.ink }}>
      {p.id === 'haute' && <Flame size={11} />} {p.label}
    </span>
  )
}

export function FrameworkBadge({ id }: { id?: string | null }) {
  if (!id) return null
  return (
    <span className="chip border-slate-900/10 bg-white/60 text-slate-400" title={frameworkHint[id] ?? ''}>
      {id}
    </span>
  )
}
