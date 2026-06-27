import { useMemo, useState } from 'react'
import { Clapperboard, Scissors, Calendar as CalIcon, ArrowRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ContentModal from '../components/ContentModal'
import { useStore } from '../store'
import { pillarOf } from '../constants'
import { FormatBadge, PillarBadge } from '../components/Badges'
import type { Content } from '../types'

function ProdCard({ content, kind, onOpen }: { content: Content; kind: 'shoot' | 'edit'; onOpen: () => void }) {
  const update = useStore((s) => s.updateContent)
  const p = pillarOf(content.pillar)
  const dateKey = kind === 'shoot' ? 'shootDate' : 'editDate'
  const date = kind === 'shoot' ? content.shootDate : content.editDate
  return (
    <div className="rounded-xl bg-ink-850 border border-slate-900/[0.06] p-3 hover:border-slate-900/15 transition relative overflow-hidden">
      <span className="absolute left-0 top-0 h-full w-1" style={{ background: p.hex }} />
      <button onClick={onOpen} className="text-left w-full pl-1.5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <PillarBadge id={content.pillar} sm />
          <FormatBadge id={content.format} sm />
        </div>
        <h4 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2">{content.title}</h4>
      </button>
      <div className="flex items-center gap-2 mt-2.5 pl-1.5">
        <CalIcon size={13} className="text-slate-500" />
        <input
          type="date"
          value={date ?? ''}
          onChange={(e) => update(content.id, { [dateKey]: e.target.value || null } as any)}
          className="input !py-1 !px-2 !text-xs [color-scheme:light] w-auto"
        />
        {kind === 'shoot' && (
          <button
            onClick={() => update(content.id, { status: 'a-monter' })}
            className="ml-auto text-[11px] text-teal-600 hover:text-teal-700 inline-flex items-center gap-1 font-semibold"
            title="Passer au montage"
          >Monter <ArrowRight size={12} /></button>
        )}
        {kind === 'edit' && (
          <button
            onClick={() => update(content.id, { status: 'programme' })}
            className="ml-auto text-[11px] text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 font-semibold"
            title="Prêt à programmer"
          >Programmer <ArrowRight size={12} /></button>
        )}
      </div>
    </div>
  )
}

function Lane({ title, icon, accent, items, kind, onOpen }: {
  title: string; icon: React.ReactNode; accent: string; items: Content[]; kind: 'shoot' | 'edit'; onOpen: (id: string) => void
}) {
  const withDate = items.filter((c) => (kind === 'shoot' ? c.shootDate : c.editDate)).sort((a, b) =>
    ((kind === 'shoot' ? a.shootDate : a.editDate) ?? '').localeCompare((kind === 'shoot' ? b.shootDate : b.editDate) ?? ''))
  const noDate = items.filter((c) => !(kind === 'shoot' ? c.shootDate : c.editDate))
  return (
    <div className="card p-4 flex-1 min-w-[300px]">
      <div className="flex items-center gap-2 mb-4">
        <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${accent}22`, color: accent }}>{icon}</div>
        <div>
          <h3 className="font-display font-bold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500">{items.length} contenu{items.length > 1 ? 's' : ''}</p>
        </div>
      </div>
      {withDate.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="label">Planifiés</div>
          {withDate.map((c) => <ProdCard key={c.id} content={c} kind={kind} onOpen={() => onOpen(c.id)} />)}
        </div>
      )}
      {noDate.length > 0 && (
        <div className="space-y-2">
          <div className="label">À planifier</div>
          {noDate.map((c) => <ProdCard key={c.id} content={c} kind={kind} onOpen={() => onOpen(c.id)} />)}
        </div>
      )}
      {items.length === 0 && <p className="text-sm text-slate-600 py-6 text-center">Rien ici pour le moment.</p>}
    </div>
  )
}

export default function Production() {
  const contents = useStore((s) => s.contents)
  const [openId, setOpenId] = useState<string | null>(null)

  const toShoot = useMemo(() => contents.filter((c) => c.status === 'a-tourner' || c.shootDate), [contents])
  const toEdit = useMemo(() => contents.filter((c) => c.status === 'a-monter' || c.editDate), [contents])

  return (
    <div className="px-5 md:px-8">
      <PageHeader
        title="Production"
        subtitle="Organise tes journées de tournage et tes sessions de montage."
        icon={<Clapperboard size={20} />}
      />
      <div className="flex gap-5 flex-wrap items-start">
        <Lane title="Tournages" icon={<Clapperboard size={18} />} accent="#fb923c" items={toShoot} kind="shoot" onOpen={setOpenId} />
        <Lane title="Montages" icon={<Scissors size={18} />} accent="#22d3ee" items={toEdit} kind="edit" onOpen={setOpenId} />
      </div>
      <p className="text-xs text-slate-500 mt-4">
        Astuce : passe un Reel en statut « À tourner » dans son éditeur pour le voir apparaître ici automatiquement.
      </p>
      {openId && <ContentModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}
