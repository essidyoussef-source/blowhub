import { useMemo, useState } from 'react'
import { Plus, ExternalLink, Trash2, Link2, ImageOff } from 'lucide-react'
import { useStore, detectPlatform } from '../store'
import { platformOf } from '../constants'
import { coverUrl, ThemeFilter, ThemeTags, useThemes } from './Themes'
import type { Inspiration, Platform } from '../types'

function CoverImg({ insp }: { insp: Inspiration }) {
  const [failed, setFailed] = useState(false)
  const p = platformOf(insp.platform)
  if (failed || !insp.url) {
    return (
      <div className="h-40 w-full grid place-items-center" style={{ background: `linear-gradient(135deg, ${p.hex}22, ${p.hex}08)` }}>
        <p.Icon size={30} style={{ color: p.hex }} />
      </div>
    )
  }
  return (
    <img src={coverUrl(insp.url, insp.cover)} alt="" loading="lazy" onError={() => setFailed(true)}
      className="h-40 w-full object-cover" />
  )
}

function InspoCard({ insp }: { insp: Inspiration }) {
  const remove = useStore((s) => s.deleteInspiration)
  const p = platformOf(insp.platform)
  return (
    <div className="card overflow-hidden group break-inside-avoid mb-5">
      <a href={insp.url} target="_blank" rel="noreferrer" className="block relative">
        <CoverImg insp={insp} />
        <span className="absolute top-2 left-2 chip shadow-soft" style={{ background: '#fff', color: p.hex, borderColor: `${p.hex}40` }}>
          <p.Icon size={12} /> {p.label}
        </span>
        <span className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition grid place-items-center">
          <span className="opacity-0 group-hover:opacity-100 transition btn bg-white text-slate-100 shadow-soft !py-1.5 text-xs"><ExternalLink size={13} /> Ouvrir</span>
        </span>
      </a>
      <div className="p-3">
        {insp.title && <h4 className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2">{insp.title}</h4>}
        {insp.note && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{insp.note}</p>}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <ThemeTags ids={insp.theme ? [insp.theme] : []} sm />
          <button onClick={() => remove(insp.id)} className="btn-icon !h-7 !w-7 ml-auto hover:text-blow-600 opacity-0 group-hover:opacity-100 transition"><Trash2 size={13} /></button>
        </div>
      </div>
    </div>
  )
}

export default function InspirationGrid({ platform }: { platform?: Platform }) {
  const inspirations = useStore((s) => s.inspirations)
  const add = useStore((s) => s.addInspiration)
  const themes = useThemes()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('')
  const [tFilter, setTFilter] = useState('')

  const list = useMemo(
    () => inspirations.filter((i) => (!platform || i.platform === platform) && (!tFilter || i.theme === tFilter)),
    [inspirations, platform, tFilter],
  )

  const submit = () => {
    if (!url.trim()) return
    add({ url: url.trim(), platform: platform ?? detectPlatform(url), title: title.trim(), theme: theme || null })
    setUrl(''); setTitle('')
  }

  return (
    <div>
      {/* Ajout */}
      <div className="card p-3 mb-4 space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input pl-9" placeholder="Colle un lien TikTok / Instagram / LinkedIn…" value={url}
              onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
          </div>
          <button className="btn-primary" onClick={submit} disabled={!url.trim()}><Plus size={16} /> Sauver l'inspo</button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input className="input flex-1" placeholder="Note / pourquoi ça t'inspire (optionnel)" value={title}
            onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
          <select className="input w-auto" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="">Thématique…</option>
            {themes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {themes.length > 0 && <div className="mb-5"><ThemeFilter value={tFilter} onChange={setTFilter} /></div>}

      {list.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
          {list.map((i) => <InspoCard key={i.id} insp={i} />)}
        </div>
      ) : (
        <div className="card p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <ImageOff size={30} className="text-slate-300" />
          Aucune inspiration{platform ? ` ${platform}` : ''} pour l'instant. Colle un lien pour commencer ta veille.
        </div>
      )}
    </div>
  )
}
