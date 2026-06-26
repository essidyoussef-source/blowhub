import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import seed from './data/seed.json'
import type {
  Content, Quote, Anecdote, RawIdea, Caption, StatusId, Priority,
} from './types'

// ── Normalisation du seed (contenu réel de Morgane) ────────────────────────
let counter = 1
const uid = (prefix: string) => `${prefix}_${counter++}`

const PRIORITY_BY_STATUS: Record<string, Priority> = {
  publie: 'basse',
  programme: 'haute',
  scripte: 'haute',
  'a-scripter': 'moyenne',
  'a-developper': 'moyenne',
  idee: 'basse',
}

// Répartit quelques contenus prêts sur le mois courant pour que le calendrier
// soit vivant dès la première ouverture (démo). Cadence Lun/Mer/Ven.
function seedSchedule(contents: Content[]) {
  const ready = contents.filter((c) => c.slides.length >= 4 || c.status === 'scripte').slice(0, 12)
  const slots = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26] // jours de juin 2026
  ready.forEach((c, i) => {
    if (i >= slots.length) return
    const day = String(slots[i]).padStart(2, '0')
    c.publishDate = `2026-06-${day}`
    c.status = 'programme'
    if (c.format === 'Reel') {
      c.shootDate = `2026-06-${String(Math.max(1, slots[i] - 2)).padStart(2, '0')}`
      c.editDate = `2026-06-${String(Math.max(1, slots[i] - 1)).padStart(2, '0')}`
    }
  })
}

function normContents(): Content[] {
  const raw = (seed as any).contents as any[]
  // garde l'ordre d'apparition par statut
  const perStatus: Record<string, number> = {}
  const list = raw.map((c) => {
    const status: StatusId = c.status ?? 'idee'
    perStatus[status] = (perStatus[status] ?? 0) + 1
    return {
      id: uid('c'),
      title: c.title || 'Sans titre',
      hook: c.hook || '',
      format: c.format || 'Carrousel',
      pillar: c.pillar || 'Autre',
      framework: c.framework ?? null,
      objective: c.objective ?? null,
      series: c.series ?? null,
      status,
      priority: PRIORITY_BY_STATUS[status] ?? 'moyenne',
      platform: c.platform || 'Instagram',
      description: c.description || '',
      slides: Array.isArray(c.slides) ? c.slides : [],
      cta: c.cta || '',
      caption: c.caption || '',
      hashtags: c.hashtags || '',
      notes: c.notes || '',
      publishDate: null,
      shootDate: null,
      editDate: null,
      source: c.source || '',
      order: perStatus[status],
      createdAt: new Date(2025, 0, perStatus[status]).toISOString(),
    } as Content
  })
  seedSchedule(list)
  // Tag quelques contenus dans la série signature "The Bossy Lady Diaries"
  const BOSSY = ['repris le contrôle', '6 mois', 'burn out', 'trouvé ma voie', 'cerveau te sabote', 'attendre']
  list.forEach((c) => {
    if (BOSSY.some((k) => c.title.toLowerCase().includes(k))) c.series = 'The Bossy Lady Diaries'
  })
  return list
}

function normQuotes(): Quote[] {
  return ((seed as any).quotes as any[]).map((q) => ({ id: uid('q'), text: q.text, angle: q.angle, set: q.set }))
}
function normAnecdotes(): Anecdote[] {
  return ((seed as any).anecdotes as any[]).map((a) => ({ id: uid('a'), text: a.text, category: a.category, set: a.set }))
}
function normRawIdeas(): RawIdea[] {
  return ((seed as any).rawIdeas as any[]).map((r) => ({ id: uid('r'), text: r.text, pillar: r.pillar, source: r.source }))
}
function normCaptions(): Caption[] {
  return ((seed as any).captions as any[]).map((c) => ({ id: uid('cap'), post: c.post, caption: c.caption, hashtags: c.hashtags }))
}

// ── Store ──────────────────────────────────────────────────────────────────
interface BlowState {
  contents: Content[]
  quotes: Quote[]
  anecdotes: Anecdote[]
  rawIdeas: RawIdea[]
  captions: Caption[]

  addContent: (partial?: Partial<Content>) => string
  updateContent: (id: string, patch: Partial<Content>) => void
  deleteContent: (id: string) => void
  moveContent: (id: string, status: StatusId, order: number) => void
  duplicateContent: (id: string) => void

  addRawIdea: (text: string, pillar?: string) => void
  deleteRawIdea: (id: string) => void
  /** Transforme une idée brute en contenu du pipeline */
  promoteRawIdea: (id: string) => string

  resetDemo: () => void
  /** Remplace tout l'état (import / synchro cloud) */
  replaceAll: (data: Partial<Pick<BlowState, 'contents' | 'quotes' | 'anecdotes' | 'rawIdeas' | 'captions'>>) => void
}

function freshState() {
  counter = 1
  return {
    contents: normContents(),
    quotes: normQuotes(),
    anecdotes: normAnecdotes(),
    rawIdeas: normRawIdeas(),
    captions: normCaptions(),
  }
}

export const useStore = create<BlowState>()(
  persist(
    (set, get) => ({
      ...freshState(),

      addContent: (partial = {}) => {
        const id = `c_${Date.now()}`
        const maxOrder = Math.max(0, ...get().contents.filter((c) => c.status === (partial.status ?? 'idee')).map((c) => c.order))
        const content: Content = {
          id,
          title: partial.title ?? 'Nouvelle idée',
          hook: partial.hook ?? '',
          format: partial.format ?? 'Carrousel',
          pillar: partial.pillar ?? 'Mindset',
          framework: partial.framework ?? null,
          objective: partial.objective ?? null,
          series: partial.series ?? null,
          status: partial.status ?? 'idee',
          priority: partial.priority ?? 'moyenne',
          platform: partial.platform ?? 'Instagram',
          description: partial.description ?? '',
          slides: partial.slides ?? [],
          cta: partial.cta ?? '',
          caption: partial.caption ?? '',
          hashtags: partial.hashtags ?? '',
          notes: partial.notes ?? '',
          publishDate: partial.publishDate ?? null,
          shootDate: partial.shootDate ?? null,
          editDate: partial.editDate ?? null,
          source: 'manuel',
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ contents: [content, ...s.contents] }))
        return id
      },

      updateContent: (id, patch) =>
        set((s) => ({ contents: s.contents.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

      deleteContent: (id) => set((s) => ({ contents: s.contents.filter((c) => c.id !== id) })),

      moveContent: (id, status, order) =>
        set((s) => ({ contents: s.contents.map((c) => (c.id === id ? { ...c, status, order } : c)) })),

      duplicateContent: (id) =>
        set((s) => {
          const src = s.contents.find((c) => c.id === id)
          if (!src) return s
          const copy: Content = { ...src, id: `c_${Date.now()}`, title: `${src.title} (copie)`, order: src.order + 0.5 }
          return { contents: [...s.contents, copy] }
        }),

      addRawIdea: (text, pillar) =>
        set((s) => ({ rawIdeas: [{ id: `r_${Date.now()}`, text, pillar, source: 'manuel' }, ...s.rawIdeas] })),

      deleteRawIdea: (id) => set((s) => ({ rawIdeas: s.rawIdeas.filter((r) => r.id !== id) })),

      promoteRawIdea: (id) => {
        const idea = get().rawIdeas.find((r) => r.id === id)
        const newId = get().addContent({ title: idea?.text ?? 'Idée', hook: idea?.text ?? '', pillar: idea?.pillar, status: 'idee' })
        set((s) => ({ rawIdeas: s.rawIdeas.filter((r) => r.id !== id) }))
        return newId
      },

      resetDemo: () => set(freshState()),

      replaceAll: (data) =>
        set((s) => ({
          contents: data.contents ?? s.contents,
          quotes: data.quotes ?? s.quotes,
          anecdotes: data.anecdotes ?? s.anecdotes,
          rawIdeas: data.rawIdeas ?? s.rawIdeas,
          captions: data.captions ?? s.captions,
        })),
    }),
    { name: 'blowhub-store-v1' },
  ),
)
