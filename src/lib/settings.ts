import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Réglages locaux (clé API IA + identifiants Supabase optionnels).
// Stockés dans le navigateur, jamais commités.
interface SettingsState {
  anthropicKey: string
  handle: string
  supabaseUrl: string
  supabaseAnonKey: string
  set: (patch: Partial<Omit<SettingsState, 'set'>>) => void
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      anthropicKey: '',
      handle: '@morganelgnn',
      supabaseUrl: '',
      supabaseAnonKey: '',
      set: (patch) => set(patch),
    }),
    { name: 'blowhub-settings-v1' },
  ),
)
