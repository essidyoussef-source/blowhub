// ───────────────────────────────────────────────────────────────────────────
// Génération de contenu par IA (Claude).
// L'app appelle l'API Claude directement depuis le navigateur avec la clé que
// la créatrice fournit (BYO key, stockée en local). Modèle : claude-opus-4-8.
// ───────────────────────────────────────────────────────────────────────────
import { useSettings } from './settings'

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-opus-4-8'

export class AiError extends Error {}

interface SlideOut { title: string; text: string }
export interface CarouselDraft {
  slides: SlideOut[]
  cta: string
  caption: string
  hashtags: string
}

async function callClaude(opts: {
  prompt: string
  system: string
  schema: object
  maxTokens?: number
}): Promise<any> {
  const key = useSettings.getState().anthropicKey.trim()
  if (!key) throw new AiError('Aucune clé API Claude configurée. Va dans Réglages pour l’ajouter.')

  let res: Response
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        // Autorise l'appel direct depuis le navigateur (clé fournie par l'utilisateur)
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: opts.maxTokens ?? 4000,
        system: opts.system,
        output_config: { format: { type: 'json_schema', schema: opts.schema } },
        messages: [{ role: 'user', content: opts.prompt }],
      }),
    })
  } catch (e: any) {
    throw new AiError('Impossible de joindre l’API Claude (vérifie ta connexion).')
  }

  if (!res.ok) {
    let detail = ''
    try { detail = (await res.json())?.error?.message ?? '' } catch { /* ignore */ }
    if (res.status === 401) throw new AiError('Clé API invalide. Vérifie-la dans Réglages.')
    if (res.status === 429) throw new AiError('Limite de requêtes atteinte. Réessaie dans un instant.')
    throw new AiError(`Erreur API (${res.status})${detail ? ' : ' + detail : ''}`)
  }

  const data = await res.json()
  if (data.stop_reason === 'refusal') throw new AiError('La demande a été refusée par le modèle.')
  const textBlock = (data.content ?? []).find((b: any) => b.type === 'text')
  if (!textBlock?.text) throw new AiError('Réponse vide du modèle.')
  try {
    return JSON.parse(textBlock.text)
  } catch {
    throw new AiError('Réponse du modèle illisible.')
  }
}

// ── Générer un carrousel complet à partir d'une idée ───────────────────────
export async function generateCarousel(input: {
  title: string
  hook?: string
  pillar?: string
  framework?: string | null
  description?: string
}): Promise<CarouselDraft> {
  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      slides: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: { title: { type: 'string' }, text: { type: 'string' } },
          required: ['title', 'text'],
        },
      },
      cta: { type: 'string' },
      caption: { type: 'string' },
      hashtags: { type: 'string' },
    },
    required: ['slides', 'cta', 'caption', 'hashtags'],
  }

  const system =
    "Tu es une copywriter experte des carrousels Instagram pour créateurs de contenu francophones (niche : mindset, sport, business, lifestyle). " +
    "Tu écris des slides percutantes, authentiques, à la 1re personne, avec un ton direct et inspirant. " +
    "Slide 1 = hook fort. Slides intermédiaires = une idée par slide, concise (1 à 3 phrases). Dernière slide = punchline + CTA. " +
    "Pas d'emojis dans les titres de slide. Réponds uniquement via le format demandé."

  const prompt =
    `Crée un carrousel Instagram de 7 à 9 slides.\n` +
    `Titre / sujet : ${input.title}\n` +
    (input.hook ? `Hook souhaité : ${input.hook}\n` : '') +
    (input.pillar ? `Pilier : ${input.pillar}\n` : '') +
    (input.framework ? `Angle : ${input.framework}\n` : '') +
    (input.description ? `Contexte / angle : ${input.description}\n` : '') +
    `\nPour chaque slide : un "title" court (le titre affiché en gras) et un "text" (le corps). ` +
    `Ajoute un "cta" (appel à l'action), une "caption" (légende du post) et des "hashtags" (8 à 12 hashtags pertinents séparés par des espaces).`

  const out = await callClaude({ prompt, system, schema, maxTokens: 4000 })
  return out as CarouselDraft
}

// ── Générer des idées de contenu pour un pilier ────────────────────────────
export interface IdeaOut { title: string; hook: string; angle: string }
export async function generateIdeas(pillar: string, count = 6): Promise<IdeaOut[]> {
  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      ideas: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: { title: { type: 'string' }, hook: { type: 'string' }, angle: { type: 'string' } },
          required: ['title', 'hook', 'angle'],
        },
      },
    },
    required: ['ideas'],
  }
  const system =
    'Tu es une stratège de contenu Instagram pour une créatrice francophone (mindset, sport, business, lifestyle). ' +
    'Tu proposes des idées de contenu originales, spécifiques et engageantes — pas de généralités.'
  const prompt =
    `Propose ${count} idées de contenu pour le pilier « ${pillar} ». ` +
    `Pour chaque idée : un "title" (le sujet), un "hook" (accroche de la slide 1), et un "angle" (Relatable, Educational, Credible ou Repeat).`
  const out = await callClaude({ prompt, system, schema, maxTokens: 2000 })
  return (out.ideas ?? []) as IdeaOut[]
}
