// ───────────────────────────────────────────────────────────────────────────
// Synchronisation cloud optionnelle via Supabase (BYO projet).
// Tant que l'URL + clé anon ne sont pas renseignées dans Réglages, l'app reste
// 100% locale (localStorage). Une fois connectée, l'état est sauvegardé dans le
// cloud et synchronisé entre appareils.
//
// Schéma SQL à créer dans ton projet Supabase (voir aussi supabase/schema.sql) :
//
//   create table if not exists blowhub_state (
//     user_id uuid primary key references auth.users(id) on delete cascade,
//     data jsonb not null,
//     updated_at timestamptz not null default now()
//   );
//   alter table blowhub_state enable row level security;
//   create policy "own state" on blowhub_state
//     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
// ───────────────────────────────────────────────────────────────────────────
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useSettings } from './settings'

let client: SupabaseClient | null = null
let signature = ''

export function getClient(): SupabaseClient | null {
  const { supabaseUrl, supabaseAnonKey } = useSettings.getState()
  if (!supabaseUrl || !supabaseAnonKey) return null
  const sig = supabaseUrl + '|' + supabaseAnonKey
  if (!client || sig !== signature) {
    try {
      client = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true } })
      signature = sig
    } catch {
      return null
    }
  }
  return client
}

export function cloudConfigured(): boolean {
  const { supabaseUrl, supabaseAnonKey } = useSettings.getState()
  return Boolean(supabaseUrl && supabaseAnonKey)
}

export async function getUserEmail(): Promise<string | null> {
  const c = getClient()
  if (!c) return null
  const { data } = await c.auth.getUser()
  return data.user?.email ?? null
}

/** Connexion par lien magique (email). */
export async function signIn(email: string): Promise<void> {
  const c = getClient()
  if (!c) throw new Error('Supabase non configuré.')
  const { error } = await c.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  const c = getClient()
  if (c) await c.auth.signOut()
}

/** Pousse l'état complet vers le cloud. */
export async function pushState(data: unknown): Promise<void> {
  const c = getClient()
  if (!c) return
  const { data: u } = await c.auth.getUser()
  if (!u.user) return
  await c.from('blowhub_state').upsert({
    user_id: u.user.id,
    data,
    updated_at: new Date().toISOString(),
  })
}

/** Récupère l'état depuis le cloud (ou null si aucun). */
export async function pullState(): Promise<unknown | null> {
  const c = getClient()
  if (!c) return null
  const { data: u } = await c.auth.getUser()
  if (!u.user) return null
  const { data, error } = await c.from('blowhub_state').select('data').eq('user_id', u.user.id).maybeSingle()
  if (error) return null
  return data?.data ?? null
}
