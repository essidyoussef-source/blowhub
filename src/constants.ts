import type { LucideIcon } from 'lucide-react'
import {
  Brain, Dumbbell, TrendingUp, Sparkles, BookOpen, HeartPulse, Salad, Palette, Star, Tag,
  GalleryHorizontalEnd, Clapperboard, Image as ImageIcon, Zap, Tv,
  Instagram, Music2, Youtube, Linkedin,
  Lightbulb, FlaskConical, PenLine, Film, CalendarClock, Send, CheckCircle2,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import type { StatusId, Format, Platform, Priority } from './types'

// ───────────────────────────────────────────────────────────────────────────
// PALETTE AURA PASTEL — chaque couleur reste douce et dans la même famille.
// hex = teinte pastel (puces, barres) · ink = version lisible (texte).
// Les helpers produisent des styles inline cohérents (fond, texte, bordure).
// ───────────────────────────────────────────────────────────────────────────
export function softBg(hex: string) { return `${hex}24` }
export function softBorder(hex: string) { return `${hex}59` }
/** Style d'une pastille / badge pastel */
export function tone(hex: string, ink: string): CSSProperties {
  return { background: `${hex}26`, color: ink, borderColor: `${hex}55` }
}

export interface ColorDef { id: string; label: string; Icon: LucideIcon; hex: string; ink: string }

// ── PIPELINE (statuts) ──────────────────────────────────────────────────────
export interface StatusDef extends ColorDef { id: StatusId; short: string }
export const STATUSES: StatusDef[] = [
  { id: 'idee',         label: 'Juste des idées', short: 'Idée',       Icon: Lightbulb,    hex: '#b7b1d6', ink: '#7d77a0' },
  { id: 'a-developper', label: 'À développer',    short: 'À dévelop.', Icon: FlaskConical, hex: '#b9a7f2', ink: '#7a67cf' },
  { id: 'a-scripter',   label: 'À scripter',      short: 'À scripter', Icon: PenLine,      hex: '#f2c595', ink: '#c08a44' },
  { id: 'scripte',      label: 'Scripté',         short: 'Scripté',    Icon: CheckCircle2, hex: '#9fc0f0', ink: '#5277bf' },
  { id: 'a-tourner',    label: 'À tourner',       short: 'Tournage',   Icon: Clapperboard, hex: '#f3b58f', ink: '#cf7f4f' },
  { id: 'a-monter',     label: 'À monter',        short: 'Montage',    Icon: Film,         hex: '#8fd5cb', ink: '#3f9d8f' },
  { id: 'programme',    label: 'Programmé',       short: 'Programmé',  Icon: CalendarClock,hex: '#a6a3f0', ink: '#6562cf' },
  { id: 'publie',       label: 'Publié',          short: 'Publié',     Icon: Send,         hex: '#9bd9b9', ink: '#3fa06a' },
]
export const statusOf = (id: StatusId) => STATUSES.find((s) => s.id === id) ?? STATUSES[0]

// ── PILIERS ─────────────────────────────────────────────────────────────────
export interface PillarDef extends ColorDef {}
export const PILLARS: PillarDef[] = [
  { id: 'Mindset',      label: 'Mindset',      Icon: Brain,      hex: '#b3a3f3', ink: '#7a67cf' },
  { id: 'Sport',        label: 'Sport',        Icon: Dumbbell,   hex: '#8bd6c9', ink: '#3f9d8f' },
  { id: 'Business',     label: 'Business',     Icon: TrendingUp, hex: '#f3c693', ink: '#c08a44' },
  { id: 'Lifestyle',    label: 'Lifestyle',    Icon: Sparkles,   hex: '#f0a8cf', ink: '#cf6aa0' },
  { id: 'Storytelling', label: 'Storytelling', Icon: BookOpen,   hex: '#9fb6f3', ink: '#5b73d6' },
  { id: 'Santé',        label: 'Santé',        Icon: HeartPulse, hex: '#90d2df', ink: '#3f9fb0' },
  { id: 'Nutrition',    label: 'Nutrition',    Icon: Salad,      hex: '#c2d795', ink: '#8aa23f' },
  { id: 'Création',     label: 'Création',     Icon: Palette,    hex: '#cdaaf0', ink: '#9b68d6' },
  { id: 'Glow up',      label: 'Glow Up',      Icon: Star,       hex: '#f5c1a0', ink: '#d98a55' },
  { id: 'Autre',        label: 'Autre',        Icon: Tag,        hex: '#bdb8d4', ink: '#7d7799' },
]
export const pillarOf = (id?: string): PillarDef =>
  PILLARS.find((p) => p.id === id) ?? PILLARS[PILLARS.length - 1]

// ── FORMATS ─────────────────────────────────────────────────────────────────
export interface FormatDef extends ColorDef { id: Format }
export const FORMATS: FormatDef[] = [
  { id: 'Carrousel', label: 'Carrousel', Icon: GalleryHorizontalEnd, hex: '#a6a3f0', ink: '#6562cf' },
  { id: 'Reel',      label: 'Reel',      Icon: Clapperboard,         hex: '#f0a8cf', ink: '#cf6aa0' },
  { id: 'Post',      label: 'Post',      Icon: ImageIcon,            hex: '#9fc0f0', ink: '#5277bf' },
  { id: 'Story',     label: 'Story',     Icon: Zap,                  hex: '#cdaaf0', ink: '#9b68d6' },
  { id: 'Série',     label: 'Série',     Icon: Tv,                   hex: '#f3c693', ink: '#c08a44' },
]
export const formatOf = (id?: Format): FormatDef =>
  FORMATS.find((f) => f.id === id) ?? FORMATS[2]

// ── PLATEFORMES ─────────────────────────────────────────────────────────────
export interface PlatformDef extends ColorDef { id: Platform }
export const PLATFORMS: PlatformDef[] = [
  { id: 'Instagram', label: 'Instagram', Icon: Instagram, hex: '#ef9ec5', ink: '#cf6aa0' },
  { id: 'TikTok',    label: 'TikTok',    Icon: Music2,    hex: '#8fd2dd', ink: '#3f9fb0' },
  { id: 'YouTube',   label: 'YouTube',   Icon: Youtube,   hex: '#f1a6a6', ink: '#cf5f5f' },
  { id: 'LinkedIn',  label: 'LinkedIn',  Icon: Linkedin,  hex: '#9fb6f3', ink: '#5b73d6' },
]
export const platformOf = (id?: Platform): PlatformDef =>
  PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]

// ── FRAMEWORKS ──────────────────────────────────────────────────────────────
export const FRAMEWORKS = ['Relatable', 'Educational', 'Credible', 'Repeat'] as const
export const frameworkHint: Record<string, string> = {
  Relatable: "Identification — « c'est exactement moi »",
  Educational: 'Valeur — apprendre quelque chose de concret',
  Credible: "Autorité — preuves, chiffres, science",
  Repeat: 'Signature — messages-piliers à marteler',
}

// ── PRIORITÉS ───────────────────────────────────────────────────────────────
export interface PriorityDef { id: Priority; label: string; hex: string; ink: string }
export const PRIORITIES: PriorityDef[] = [
  { id: 'haute',   label: 'Haute',   hex: '#f0a8cf', ink: '#cf6aa0' },
  { id: 'moyenne', label: 'Moyenne', hex: '#f3c693', ink: '#c08a44' },
  { id: 'basse',   label: 'Basse',   hex: '#bdb8d4', ink: '#8d88a8' },
]
export const priorityOf = (id?: Priority) => PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[2]
