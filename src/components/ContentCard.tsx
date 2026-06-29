import { GalleryHorizontalEnd, Check } from 'lucide-react'
import type { Content } from '../types'
import { pillarOf } from '../constants'
import { useStore } from '../store'
import { FormatBadge, PlatformBadge, PriorityBadge, FrameworkBadge } from './Badges'
import { ThemeTags } from './Themes'

export default function ContentCard({
  content, onClick, compact,
}: { content: Content; onClick?: () => void; compact?: boolean }) {
  const p = pillarOf(content.pillar)
  const update = useStore((s) => s.updateContent)
  const posted = content.status === 'publie'

  const togglePosted = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Marque comme posté · re-cliquer rouvre le contenu (retour au statut « Programmé »)
    update(content.id, { status: posted ? 'programme' : 'publie' })
  }

  return (
    <div
      onClick={onClick}
      className={`group w-full text-left rounded-2xl bg-ink-850 border border-slate-900/[0.06] p-3 hover:border-slate-900/15 hover:bg-ink-800 transition-all relative overflow-hidden cursor-pointer ${posted ? 'opacity-75' : ''}`}
    >
      <span className="absolute left-0 top-0 h-full w-1" style={{ background: posted ? '#3fa06a' : p.hex }} />

      {/* Bouton « marquer comme posté » */}
      <button
        onClick={togglePosted}
        title={posted ? 'Posté — cliquer pour rouvrir' : 'Marquer comme posté'}
        className={`absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center rounded-full border transition ${
          posted
            ? 'bg-emerald-400 border-emerald-400 text-white shadow-soft'
            : 'bg-white/70 border-slate-900/10 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-emerald-500 hover:border-emerald-300'
        }`}
      >
        <Check size={13} strokeWidth={3} />
      </button>

      <div className="flex items-start gap-2 pl-1.5 pr-7">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="chip border-transparent px-0 text-[10px]" style={{ color: p.hex }}><p.Icon size={12} className="shrink-0" /> {p.label}</span>
            <PriorityBadge id={content.priority} />
            {posted && (
              <span className="chip border-transparent px-0 text-[10px] text-emerald-600"><Check size={11} strokeWidth={3} /> Posté</span>
            )}
          </div>
          <h4 className={`text-sm font-semibold leading-snug line-clamp-2 ${posted ? 'text-slate-400 line-through decoration-emerald-400/60' : 'text-slate-100'}`}>{content.title}</h4>
          {!compact && content.hook && content.hook !== content.title && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{content.hook}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2.5 pl-1.5 flex-wrap">
        <FormatBadge id={content.format} sm />
        {!compact && <FrameworkBadge id={content.framework} />}
        {content.slides.length > 0 && (
          <span className="chip border-slate-900/10 bg-slate-900/[0.04] text-slate-400 text-[10px] px-2 py-0">
            <GalleryHorizontalEnd size={11} /> {content.slides.length}
          </span>
        )}
        {!compact && <PlatformBadge id={content.platform} sm />}
        <ThemeTags ids={content.themes} sm />
      </div>
    </div>
  )
}
