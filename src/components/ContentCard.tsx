import { GalleryHorizontalEnd } from 'lucide-react'
import type { Content } from '../types'
import { pillarOf } from '../constants'
import { FormatBadge, PlatformBadge, PriorityBadge, FrameworkBadge } from './Badges'

export default function ContentCard({
  content, onClick, compact,
}: { content: Content; onClick?: () => void; compact?: boolean }) {
  const p = pillarOf(content.pillar)
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-xl bg-ink-850 border border-slate-900/[0.06] p-3 hover:border-slate-900/15 hover:bg-ink-800 transition-all relative overflow-hidden"
    >
      <span className="absolute left-0 top-0 h-full w-1" style={{ background: p.hex }} />
      <div className="flex items-start gap-2 pl-1.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="chip border-transparent px-0 text-[10px]" style={{ color: p.hex }}><p.Icon size={12} className="shrink-0" /> {p.label}</span>
            <PriorityBadge id={content.priority} />
          </div>
          <h4 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2">{content.title}</h4>
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
      </div>
    </button>
  )
}
