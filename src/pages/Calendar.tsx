import { useMemo, useState } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths,
  format, isSameMonth, isSameDay, parseISO,
} from 'date-fns'
import { fr } from 'date-fns/locale'
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

export default function CalendarPage() {
  const contents = useStore((s) => s.contents)
  const addContent = useStore((s) => s.addContent)
  const [cursor, setCursor] = useState(() => new Date(2026, 5, 1)) // juin 2026
  const [mode, setMode] = useState<ColorMode>('format')
  const [openId, setOpenId] = useState<string | null>(null)

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

  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title="Calendrier éditorial"
        subtitle="Ton planning avec un code couleur. Clique un jour pour programmer un contenu."
        icon={<CalendarDays size={20} />}
        actions={
          <div className="flex items-center gap-1.5 rounded-xl bg-white/5 p-1">
            {(['format', 'platform', 'pillar'] as ColorMode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${mode === m ? 'bg-blow-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                {m === 'format' ? 'Format' : m === 'platform' ? 'Plateforme' : 'Pilier'}
              </button>
            ))}
          </div>
        }
      />

      {/* Barre mois + légende */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button className="btn-icon" onClick={() => setCursor(subMonths(cursor, 1))}><ChevronLeft size={18} /></button>
          <div className="text-lg font-display font-bold text-white capitalize w-44 text-center">
            {format(cursor, 'MMMM yyyy', { locale: fr })}
          </div>
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

      {/* Grille */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-white/5">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
            <div key={d} className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const cell = byDay[key]
            const inMonth = isSameMonth(day, cursor)
            const isToday = isSameDay(day, new Date(2026, 5, 26))
            return (
              <div key={key}
                className={`group min-h-[118px] border-b border-r border-white/5 p-1.5 relative ${inMonth ? '' : 'bg-black/20'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold grid place-items-center h-6 w-6 rounded-full ${isToday ? 'bg-blow-500 text-white' : inMonth ? 'text-slate-400' : 'text-slate-600'}`}>
                    {format(day, 'd')}
                  </span>
                  <button
                    onClick={() => { const id = addContent({ status: 'programme', publishDate: key }); setOpenId(id) }}
                    className="opacity-0 group-hover:opacity-100 btn-icon !h-6 !w-6 transition"
                    title="Programmer ici"
                  ><Plus size={13} /></button>
                </div>
                <div className="space-y-1">
                  {cell?.publish.map((c) => (
                    <button key={c.id} onClick={() => setOpenId(c.id)}
                      className="w-full text-left rounded-md px-1.5 py-1 text-[11px] font-medium text-white/90 truncate hover:brightness-125 transition"
                      style={{ background: `${colorFor(c, mode)}33`, boxShadow: `inset 2px 0 0 ${colorFor(c, mode)}` }}
                      title={c.title}>
                      {c.title}
                    </button>
                  ))}
                  {cell?.shoot.map((c) => (
                    <button key={'s' + c.id} onClick={() => setOpenId(c.id)}
                      className="w-full flex items-center gap-1 text-left rounded-md px-1.5 py-0.5 text-[10px] text-orange-300 bg-orange-500/10 truncate">
                      <Clapperboard size={10} /> {c.title}
                    </button>
                  ))}
                  {cell?.edit.map((c) => (
                    <button key={'e' + c.id} onClick={() => setOpenId(c.id)}
                      className="w-full flex items-center gap-1 text-left rounded-md px-1.5 py-0.5 text-[10px] text-cyan-300 bg-cyan-500/10 truncate">
                      <Scissors size={10} /> {c.title}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        💡 Les dates de tournage 🎬 et de montage ✂️ apparaissent aussi ici. Définis-les dans chaque contenu.
      </p>

      {openId && <ContentModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}
