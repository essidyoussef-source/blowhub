// ───────────────────────────────────────────────────────────────────────────
// Blow Hub — Modèle de données
// Une idée n'est pas "rangée dans un dossier", elle VIT dans un pipeline et
// porte des étiquettes (pilier + format + framework + priorité + plateforme).
// ───────────────────────────────────────────────────────────────────────────

export type StatusId =
  | 'idee'
  | 'a-developper'
  | 'a-scripter'
  | 'scripte'
  | 'a-tourner'
  | 'a-monter'
  | 'programme'
  | 'publie'

export type Priority = 'haute' | 'moyenne' | 'basse'

export type Format = 'Carrousel' | 'Reel' | 'Post' | 'Story' | 'Série'

export type Platform = 'Instagram' | 'TikTok' | 'YouTube' | 'LinkedIn'

export interface Slide {
  n: number
  title?: string
  text: string
}

export interface Content {
  id: string
  title: string
  hook: string
  format: Format
  pillar: string
  framework?: string | null
  objective?: string | null
  /** Nom de la série récurrente (ex: The Bossy Lady Diaries) */
  series?: string | null
  status: StatusId
  priority: Priority
  platform: Platform
  description?: string
  slides: Slide[]
  cta?: string
  caption?: string
  hashtags?: string
  notes?: string
  /** Date de publication programmée (ISO yyyy-mm-dd) */
  publishDate?: string | null
  /** Date de tournage (ISO yyyy-mm-dd) */
  shootDate?: string | null
  /** Date de montage (ISO yyyy-mm-dd) */
  editDate?: string | null
  source?: string
  /** position dans une colonne kanban (tri) */
  order: number
  createdAt: string
}

export interface Quote {
  id: string
  text: string
  angle?: string
  set?: string
}

export interface Anecdote {
  id: string
  text: string
  category?: string
  set?: string
}

export interface RawIdea {
  id: string
  text: string
  pillar?: string
  source?: string
}

export interface Caption {
  id: string
  post: string
  caption: string
  hashtags?: string
}
