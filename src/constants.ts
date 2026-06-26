import type { StatusId, Format, Platform, Priority } from './types'

// ───────────────────────────────────────────────────────────────────────────
// LE PIPELINE — colonnes du board Idées (de l'idée brute au post publié)
// C'est la colonne vertébrale de Blow Hub : chaque contenu avance de gauche
// à droite. Tournage et Montage sont des étapes à part entière.
// ───────────────────────────────────────────────────────────────────────────
export interface StatusDef {
  id: StatusId
  label: string
  short: string
  /** classes tailwind : texte / fond léger / bordure / point */
  text: string
  bg: string
  border: string
  dot: string
  hex: string
}

export const STATUSES: StatusDef[] = [
  { id: 'idee',         label: 'Juste des idées', short: 'Idée',       text: 'text-slate-300',  bg: 'bg-slate-500/10',   border: 'border-slate-500/30',  dot: 'bg-slate-400',   hex: '#94a3b8' },
  { id: 'a-developper', label: 'À développer',    short: 'À dévelop.', text: 'text-violet-300', bg: 'bg-violet-500/10',  border: 'border-violet-500/30', dot: 'bg-violet-400',  hex: '#a78bfa' },
  { id: 'a-scripter',   label: 'À scripter',      short: 'À scripter', text: 'text-amber-300',  bg: 'bg-amber-500/10',   border: 'border-amber-500/30',  dot: 'bg-amber-400',   hex: '#fbbf24' },
  { id: 'scripte',      label: 'Scripté',         short: 'Scripté',    text: 'text-sky-300',    bg: 'bg-sky-500/10',     border: 'border-sky-500/30',    dot: 'bg-sky-400',     hex: '#38bdf8' },
  { id: 'a-tourner',    label: 'À tourner',       short: 'Tournage',   text: 'text-orange-300', bg: 'bg-orange-500/10',  border: 'border-orange-500/30', dot: 'bg-orange-400',  hex: '#fb923c' },
  { id: 'a-monter',     label: 'À monter',        short: 'Montage',    text: 'text-cyan-300',   bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',   dot: 'bg-cyan-400',    hex: '#22d3ee' },
  { id: 'programme',    label: 'Programmé',       short: 'Programmé',  text: 'text-indigo-300', bg: 'bg-indigo-500/10',  border: 'border-indigo-500/30', dot: 'bg-indigo-400',  hex: '#818cf8' },
  { id: 'publie',       label: 'Publié',          short: 'Publié',     text: 'text-emerald-300',bg: 'bg-emerald-500/10', border: 'border-emerald-500/30',dot: 'bg-emerald-400', hex: '#34d399' },
]

export const statusOf = (id: StatusId) => STATUSES.find((s) => s.id === id) ?? STATUSES[0]

// ───────────────────────────────────────────────────────────────────────────
// PILIERS (les thèmes) — chaque pilier a sa couleur identitaire
// ───────────────────────────────────────────────────────────────────────────
export interface PillarDef { id: string; label: string; hex: string; text: string; bg: string; border: string; emoji: string }

export const PILLARS: PillarDef[] = [
  { id: 'Mindset',      label: 'Mindset',      emoji: '🧠', hex: '#a78bfa', text: 'text-violet-300',  bg: 'bg-violet-500/15',  border: 'border-violet-500/40' },
  { id: 'Sport',        label: 'Sport',        emoji: '💪', hex: '#34d399', text: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40' },
  { id: 'Business',     label: 'Business',     emoji: '📈', hex: '#fbbf24', text: 'text-amber-300',   bg: 'bg-amber-500/15',   border: 'border-amber-500/40' },
  { id: 'Lifestyle',    label: 'Lifestyle',    emoji: '✨', hex: '#f472b6', text: 'text-pink-300',    bg: 'bg-pink-500/15',    border: 'border-pink-500/40' },
  { id: 'Storytelling', label: 'Storytelling', emoji: '📖', hex: '#60a5fa', text: 'text-blue-300',    bg: 'bg-blue-500/15',    border: 'border-blue-500/40' },
  { id: 'Santé',        label: 'Santé',        emoji: '🩺', hex: '#2dd4bf', text: 'text-teal-300',    bg: 'bg-teal-500/15',    border: 'border-teal-500/40' },
  { id: 'Nutrition',    label: 'Nutrition',    emoji: '🥗', hex: '#a3e635', text: 'text-lime-300',    bg: 'bg-lime-500/15',    border: 'border-lime-500/40' },
  { id: 'Création',     label: 'Création',     emoji: '🎬', hex: '#818cf8', text: 'text-indigo-300',  bg: 'bg-indigo-500/15',  border: 'border-indigo-500/40' },
  { id: 'Glow up',      label: 'Glow Up',      emoji: '🌟', hex: '#f0abfc', text: 'text-fuchsia-300', bg: 'bg-fuchsia-500/15', border: 'border-fuchsia-500/40' },
  { id: 'Autre',        label: 'Autre',        emoji: '🏷️', hex: '#94a3b8', text: 'text-slate-300',   bg: 'bg-slate-500/15',   border: 'border-slate-500/40' },
]

export const pillarOf = (id?: string): PillarDef =>
  PILLARS.find((p) => p.id === id) ?? PILLARS[PILLARS.length - 1]

// ───────────────────────────────────────────────────────────────────────────
// FORMATS (type de post) — couleur par type
// ───────────────────────────────────────────────────────────────────────────
export interface FormatDef { id: Format; label: string; emoji: string; hex: string; text: string; bg: string; border: string }

export const FORMATS: FormatDef[] = [
  { id: 'Carrousel', label: 'Carrousel', emoji: '🖼️', hex: '#818cf8', text: 'text-indigo-300', bg: 'bg-indigo-500/15', border: 'border-indigo-500/40' },
  { id: 'Reel',      label: 'Reel',      emoji: '🎞️', hex: '#fb7185', text: 'text-rose-300',   bg: 'bg-rose-500/15',   border: 'border-rose-500/40' },
  { id: 'Post',      label: 'Post',      emoji: '📷', hex: '#94a3b8', text: 'text-slate-300',  bg: 'bg-slate-500/15',  border: 'border-slate-500/40' },
  { id: 'Story',     label: 'Story',     emoji: '⚡', hex: '#c084fc', text: 'text-purple-300', bg: 'bg-purple-500/15', border: 'border-purple-500/40' },
  { id: 'Série',     label: 'Série',     emoji: '📺', hex: '#fbbf24', text: 'text-amber-300',  bg: 'bg-amber-500/15',  border: 'border-amber-500/40' },
]

export const formatOf = (id?: Format): FormatDef =>
  FORMATS.find((f) => f.id === id) ?? FORMATS[2]

// ───────────────────────────────────────────────────────────────────────────
// PLATEFORMES — couleur par plateforme
// ───────────────────────────────────────────────────────────────────────────
export interface PlatformDef { id: Platform; label: string; hex: string; text: string; bg: string; border: string }

export const PLATFORMS: PlatformDef[] = [
  { id: 'Instagram', label: 'Instagram', hex: '#e1306c', text: 'text-pink-300',   bg: 'bg-pink-500/15',   border: 'border-pink-500/40' },
  { id: 'TikTok',    label: 'TikTok',    hex: '#22d3ee', text: 'text-cyan-300',   bg: 'bg-cyan-500/15',   border: 'border-cyan-500/40' },
  { id: 'YouTube',   label: 'YouTube',   hex: '#ef4444', text: 'text-red-300',    bg: 'bg-red-500/15',    border: 'border-red-500/40' },
  { id: 'LinkedIn',  label: 'LinkedIn',  hex: '#38bdf8', text: 'text-sky-300',    bg: 'bg-sky-500/15',    border: 'border-sky-500/40' },
]

export const platformOf = (id?: Platform): PlatformDef =>
  PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]

// ───────────────────────────────────────────────────────────────────────────
// FRAMEWORKS (l'angle narratif) — les 4 angles que Morgane utilise
// ───────────────────────────────────────────────────────────────────────────
export const FRAMEWORKS = ['Relatable', 'Educational', 'Credible', 'Repeat'] as const

export const frameworkHint: Record<string, string> = {
  Relatable: "Identification — « c'est exactement moi »",
  Educational: 'Valeur — apprendre quelque chose de concret',
  Credible: "Autorité — preuves, chiffres, science",
  Repeat: 'Signature — messages-piliers à marteler',
}

// ───────────────────────────────────────────────────────────────────────────
// PRIORITÉS
// ───────────────────────────────────────────────────────────────────────────
export interface PriorityDef { id: Priority; label: string; hex: string; text: string; bg: string }
export const PRIORITIES: PriorityDef[] = [
  { id: 'haute',   label: 'Haute',   hex: '#ff2d77', text: 'text-blow-400',   bg: 'bg-blow-500/15' },
  { id: 'moyenne', label: 'Moyenne', hex: '#fbbf24', text: 'text-amber-300',  bg: 'bg-amber-500/15' },
  { id: 'basse',   label: 'Basse',   hex: '#64748b', text: 'text-slate-400',  bg: 'bg-slate-500/15' },
]
export const priorityOf = (id?: Priority) => PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[2]
