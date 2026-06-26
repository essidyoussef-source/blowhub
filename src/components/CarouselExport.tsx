import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toPng } from 'html-to-image'
import { X, Download, Loader2, ImageDown } from 'lucide-react'
import type { Content } from '../types'
import { pillarOf } from '../constants'
import { useSettings } from '../lib/settings'

// Slide 1080×1080 prête à poster — rendue hors écran puis capturée.
function ExportSlide({
  content, index, hex, handle, nodeRef,
}: { content: Content; index: number; hex: string; handle: string; nodeRef?: (el: HTMLDivElement | null) => void }) {
  const slide = content.slides[index]
  const total = content.slides.length
  const p = pillarOf(content.pillar)
  return (
    <div
      ref={nodeRef}
      style={{
        width: 1080,
        height: 1080,
        background: `radial-gradient(120% 120% at 0% 0%, ${hex}33, #0b0b13 55%)`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: 88,
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#fff',
        boxSizing: 'border-box',
      }}
    >
      {/* top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 30, color: 'rgba(255,255,255,0.55)' }}>
        <span style={{ fontWeight: 700 }}>{p.emoji} {content.pillar}</span>
        <span style={{ fontFamily: 'monospace' }}>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>

      {/* center content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {slide?.title && (
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: hex, marginBottom: 32 }}>
            {slide.title}
          </div>
        )}
        <div style={{ fontSize: index === 0 ? 76 : 52, fontWeight: index === 0 ? 900 : 600, lineHeight: 1.18, whiteSpace: 'pre-wrap' }}>
          {slide?.text || (index === 0 ? content.title : '')}
        </div>
      </div>

      {/* footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 30, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{handle}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} style={{ width: i === index ? 40 : 14, height: 14, borderRadius: 999, background: i === index ? hex : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CarouselExport({ content, onClose }: { content: Content; onClose: () => void }) {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const [busy, setBusy] = useState<number | 'all' | null>(null)
  const [handle, setHandle] = useState(useSettings.getState().handle || '@morganelgnn')
  const p = pillarOf(content.pillar)

  const slug = content.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'carrousel'

  const exportOne = async (i: number) => {
    const node = refs.current[i]
    if (!node) return
    const url = await toPng(node, { width: 1080, height: 1080, pixelRatio: 1, cacheBust: true, backgroundColor: '#0b0b13' })
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}-${String(i + 1).padStart(2, '0')}.png`
    a.click()
  }

  const exportAll = async () => {
    setBusy('all')
    for (let i = 0; i < content.slides.length; i++) {
      await exportOne(i)
      await new Promise((r) => setTimeout(r, 350))
    }
    setBusy(null)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full md:max-w-4xl md:rounded-3xl bg-ink-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-screen md:max-h-[90vh] animate-fade-in">
        <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-blow-400"><ImageDown size={20} /></div>
            <div>
              <h2 className="font-display font-bold text-white">Exporter en images</h2>
              <p className="text-xs text-slate-400">{content.slides.length} slides · 1080×1080 px · prêtes à poster</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-500">Pseudo</span>
              <input value={handle} onChange={(e) => setHandle(e.target.value)} className="input !py-1.5 !text-xs w-36" />
            </div>
            <button className="btn-primary !py-2" onClick={exportAll} disabled={busy !== null}>
              {busy === 'all' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Tout télécharger
            </button>
            <button className="btn-icon" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        {/* Aperçus (mis à l'échelle) */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {content.slides.map((_, i) => (
              <div key={i} className="group relative">
                <div className="rounded-2xl overflow-hidden border border-white/10" style={{ aspectRatio: '1 / 1' }}>
                  <div style={{ width: 1080, height: 1080, transform: 'scale(0.26)', transformOrigin: 'top left' }}>
                    <ExportSlide content={content} index={i} hex={p.hex} handle={handle} />
                  </div>
                </div>
                <button
                  onClick={() => exportOne(i)}
                  className="absolute inset-x-0 bottom-0 m-2 btn-ghost !py-1.5 text-xs justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <Download size={13} /> Slide {i + 1}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Noeuds réels 1080px, rendus hors écran pour la capture */}
      <div style={{ position: 'fixed', top: -99999, left: -99999, pointerEvents: 'none' }} aria-hidden>
        {content.slides.map((_, i) => (
          <ExportSlide key={i} content={content} index={i} hex={p.hex} handle={handle} nodeRef={(el) => (refs.current[i] = el)} />
        ))}
      </div>
    </div>,
    document.body,
  )
}
