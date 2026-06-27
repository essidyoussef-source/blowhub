import type { LucideIcon } from 'lucide-react'
import {
  Brain, Dumbbell, TrendingUp, Sparkles, BookOpen, HeartPulse, Salad, Palette, Star, Tag,
  GalleryHorizontalEnd, Clapperboard, Image as ImageIcon, Zap, Tv,
  Instagram, Music2, Youtube, Linkedin,
  Lightbulb, FlaskConical, PenLine, Film, CalendarClock, Send, CheckCircle2,
} from 'lucide-react'
import type { StatusId, Format, Platform, Priority } from './types'

// ───────────────────────────────────────────────────────────────────────────
// LE PIPELINE — colonnes du board Idées (de l'idée brute au post publié)
// ───────────────────────────────────────────────────────────────────────────
export interface StatusDef {
  id: StatusId
  label: string
  short: string
  Icon: LucideIcon
  text: string
  bg: string
  border: string
  dot: string
  hex: string
}

export const STATUSES: StatusDef[] = [
  { id: 'idee',         label: 'Juste des idées', short: 'Idée',       Icon: Lightbulb,    text: 'text-slate-300',  bg: 'bg-slate-900/[0.03]', border: 'border-slate-900/10', dot: 'bg-slate-400',   hex: '#938da6' },
  { id: 'a-developper', label: 'À développer',    short: 'À dévelop.', Icon: FlaskConical, text: 'text-violet-700', bg: 'bg-violet-50',  border: 'border-violet-200', dot: 'bg-violet-500',  hex: '#7c3aed' },
  { id: 'a-scripter',   label: 'À scripter',      short: 'À scripter', Icon: PenLine,      text: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200',  dot: 'bg-amber-500',   hex: '#d97706' },
  { id: 'scripte',      label: 'Scripté',         short: 'Scripté',    Icon: CheckCircle2, text: 'text-sky-700',    bg: 'bg-sky-50',     border: 'border-sky-200',    dot: 'bg-sky-500',     hex: '#0284c7' },
  { id: 'a-tourner',    label: 'À tourner',       short: 'Tournage',   Icon: Clapperboard, text: 'text-orange-700', bg: 'bg-orange-50',  border: 'border-orange-200', dot: 'bg-orange-500',  hex: '#f37826' },
  { id: 'a-monter',     label: 'À monter',        short: 'Montage',    Icon: Film,         text: 'text-teal-700',   bg: 'bg-teal-50',    border: 'border-teal-200',   dot: 'bg-teal-500',    hex: '#0d9488' },
  { id: 'programme',    label: 'Programmé',       short: 'Programmé',  Icon: CalendarClock,text: 'text-indigo-700', bg: 'bg-indigo-50',  border: 'border-indigo-200', dot: 'bg-indigo-500',  hex: '#4f46e5' },
  { id: 'publie',       label: 'Publié',          short: 'Publié',     Icon: Send,         text: 'text-emerald-700',bg: 'bg-emerald-50', border: 'border-emerald-200',dot: 'bg-emerald-500', hex: '#059669' },
]

export const statusOf = (id: StatusId) => STATUSES.find((s) => s.id === id) ?? STATUSES[0]

// ───────────────────────────────────────────────────────────────────────────
// PILIERS (les thèmes) — icône + couleur identitaire (thème clair)
// ───────────────────────────────────────────────────────────────────────────
export interface PillarDef { id: string; label: string; Icon: LucideIcon; hex: string; text: string; bg: string; border: string }

export const PILLARS: PillarDef[] = [
  { id: 'Mindset',      label: 'Mindset',      Icon: Brain,        hex: '#7c3aed', text: 'text-violet-700',  bg: 'bg-violet-50',  border: 'border-violet-200' },
  { id: 'Sport',        label: 'Sport',        Icon: Dumbbell,     hex: '#059669', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'Business',     label: 'Business',     Icon: TrendingUp,   hex: '#d97706', text: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  { id: 'Lifestyle',    label: 'Lifestyle',    Icon: Sparkles,     hex: '#db2777', text: 'text-pink-700',    bg: 'bg-pink-50',    border: 'border-pink-200' },
  { id: 'Storytelling', label: 'Storytelling', Icon: BookOpen,     hex: '#4f46e5', text: 'text-indigo-700',  bg: 'bg-indigo-50',  border: 'border-indigo-200' },
  { id: 'Santé',        label: 'Santé',        Icon: HeartPulse,   hex: '#0d9488', text: 'text-teal-700',    bg: 'bg-teal-50',    border: 'border-teal-200' },
  { id: 'Nutrition',    label: 'Nutrition',    Icon: Salad,        hex: '#65a30d', text: 'text-lime-700',    bg: 'bg-lime-50',    border: 'border-lime-200' },
  { id: 'Création',     label: 'Création',     Icon: Palette,      hex: '#c026d3', text: 'text-fuchsia-700', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' },
  { id: 'Glow up',      label: 'Glow Up',      Icon: Star,         hex: '#ea580c', text: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-200' },
  { id: 'Autre',        label: 'Autre',        Icon: Tag,          hex: '#6b7280', text: 'text-gray-600',    bg: 'bg-gray-100',   border: 'border-gray-200' },
]

export const pillarOf = (id?: string): PillarDef =>
  PILLARS.find((p) => p.id === id) ?? PILLARS[PILLARS.length - 1]

// ───────────────────────────────────────────────────────────────────────────
// FORMATS (type de post) — icône + couleur par type
// ───────────────────────────────────────────────────────────────────────────
export interface FormatDef { id: Format; label: string; Icon: LucideIcon; hex: string; text: string; bg: string; border: string }

export const FORMATS: FormatDef[] = [
  { id: 'Carrousel', label: 'Carrousel', Icon: GalleryHorizontalEnd, hex: '#4f46e5', text: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'Reel',      label: 'Reel',      Icon: Clapperboard,         hex: '#db2777', text: 'text-pink-700',   bg: 'bg-pink-50',   border: 'border-pink-200' },
  { id: 'Post',      label: 'Post',      Icon: ImageIcon,            hex: '#0284c7', text: 'text-sky-700',    bg: 'bg-sky-50',    border: 'border-sky-200' },
  { id: 'Story',     label: 'Story',     Icon: Zap,                  hex: '#c026d3', text: 'text-fuchsia-700',bg: 'bg-fuchsia-50',border: 'border-fuchsia-200' },
  { id: 'Série',     label: 'Série',     Icon: Tv,                   hex: '#d97706', text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
]

export const formatOf = (id?: Format): FormatDef =>
  FORMATS.find((f) => f.id === id) ?? FORMATS[2]

// ───────────────────────────────────────────────────────────────────────────
// PLATEFORMES — icône + couleur par plateforme
// ───────────────────────────────────────────────────────────────────────────
export interface PlatformDef { id: Platform; label: string; Icon: LucideIcon; hex: string; text: string; bg: string; border: string }

export const PLATFORMS: PlatformDef[] = [
  { id: 'Instagram', label: 'Instagram', Icon: Instagram, hex: '#e1306c', text: 'text-pink-700', bg: 'bg-pink-50', border: 'border-pink-200' },
  { id: 'TikTok',    label: 'TikTok',    Icon: Music2,    hex: '#0ea5b7', text: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  { id: 'YouTube',   label: 'YouTube',   Icon: Youtube,   hex: '#dc2626', text: 'text-red-700',  bg: 'bg-red-50',  border: 'border-red-200' },
  { id: 'LinkedIn',  label: 'LinkedIn',  Icon: Linkedin,  hex: '#0a66c2', text: 'text-sky-700',  bg: 'bg-sky-50',  border: 'border-sky-200' },
]

export const platformOf = (id?: Platform): PlatformDef =>
  PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]

// ───────────────────────────────────────────────────────────────────────────
// FRAMEWORKS (l'angle narratif)
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
  { id: 'haute',   label: 'Haute',   hex: '#ec1763', text: 'text-blow-600',  bg: 'bg-blow-50' },
  { id: 'moyenne', label: 'Moyenne', hex: '#d97706', text: 'text-amber-700', bg: 'bg-amber-50' },
  { id: 'basse',   label: 'Basse',   hex: '#94a3b8', text: 'text-slate-400', bg: 'bg-slate-900/[0.04]' },
]
export const priorityOf = (id?: Priority) => PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[2]
