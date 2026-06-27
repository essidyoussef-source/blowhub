import { useEffect, useState } from 'react'
import {
  Settings as SettingsIcon, Sparkles, Cloud, Download, Upload, Check, ExternalLink,
  LogOut, Mail, Database, KeyRound, RefreshCw,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Field } from '../components/Field'
import { useSettings } from '../lib/settings'
import { useStore } from '../store'
import { cloudConfigured, getUserEmail, signIn, signOut, pushState, pullState } from '../lib/cloud'

function Section({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900/[0.04] text-blow-400">{icon}</div>
        <div>
          <h3 className="font-display font-bold text-slate-100">{title}</h3>
          {desc && <p className="text-xs text-slate-400">{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

export default function Settings() {
  const s = useSettings()
  const store = useStore()
  const [saved, setSaved] = useState(false)
  const [email, setEmail] = useState('')
  const [cloudUser, setCloudUser] = useState<string | null>(null)
  const [cloudMsg, setCloudMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (cloudConfigured()) getUserEmail().then(setCloudUser).catch(() => {})
  }, [s.supabaseUrl, s.supabaseAnonKey])

  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1200) }

  const exportJson = () => {
    const data = { contents: store.contents, quotes: store.quotes, anecdotes: store.anecdotes, rawIdeas: store.rawIdeas, captions: store.captions }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `blowhub-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  const importJson = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        store.replaceAll(data)
        setCloudMsg('Import réussi')
      } catch {
        setCloudMsg('Fichier invalide ✗')
      }
    }
    reader.readAsText(file)
  }

  const doSignIn = async () => {
    setBusy(true); setCloudMsg(null)
    try { await signIn(email); setCloudMsg('Lien magique envoyé — vérifie ta boîte mail') }
    catch (e: any) { setCloudMsg('Erreur : ' + (e?.message ?? 'connexion impossible')) }
    finally { setBusy(false) }
  }
  const doPush = async () => {
    setBusy(true); setCloudMsg(null)
    try {
      await pushState({ contents: store.contents, quotes: store.quotes, anecdotes: store.anecdotes, rawIdeas: store.rawIdeas, captions: store.captions })
      setCloudMsg('Sauvegardé dans le cloud')
    } catch (e: any) { setCloudMsg('Erreur : ' + (e?.message ?? '')) }
    finally { setBusy(false) }
  }
  const doPull = async () => {
    setBusy(true); setCloudMsg(null)
    try {
      const data = await pullState()
      if (data) { store.replaceAll(data as any); setCloudMsg('Récupéré depuis le cloud') }
      else setCloudMsg('Aucune sauvegarde cloud trouvée.')
    } catch (e: any) { setCloudMsg('Erreur : ' + (e?.message ?? '')) }
    finally { setBusy(false) }
  }

  return (
    <div className="px-5 md:px-8 max-w-3xl">
      <PageHeader title="Réglages" subtitle="IA, cloud, sauvegardes — tout ce qui rend Blow Hub scalable." icon={<SettingsIcon size={20} />} />

      <div className="space-y-5">
        {/* IA */}
        <Section icon={<Sparkles size={20} />} title="Génération par IA (Claude)" desc="Colle ta clé API pour générer carrousels et idées automatiquement.">
          <Field label="Clé API Anthropic">
            <div className="relative">
              <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="password" className="input pl-9 font-mono" placeholder="sk-ant-..." value={s.anthropicKey}
                onChange={(e) => { s.set({ anthropicKey: e.target.value }); flashSaved() }} />
            </div>
          </Field>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            La clé reste dans ton navigateur, elle n'est jamais envoyée ailleurs qu'à l'API Claude.
            <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="text-blow-400 hover:underline inline-flex items-center gap-0.5 ml-1">Obtenir une clé <ExternalLink size={11} /></a>
          </p>
          <Field label="Pseudo (pour l'export des carrousels)" className="mt-4">
            <input className="input" value={s.handle} onChange={(e) => { s.set({ handle: e.target.value }); flashSaved() }} />
          </Field>
          {saved && <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><Check size={13} /> Enregistré</p>}
        </Section>

        {/* Sauvegarde / Export */}
        <Section icon={<Download size={20} />} title="Sauvegarde & portabilité" desc="Exporte tout ton contenu en JSON, ou réimporte une sauvegarde.">
          <div className="flex gap-2 flex-wrap">
            <button className="btn-ghost" onClick={exportJson}><Download size={16} /> Exporter (JSON)</button>
            <label className="btn-ghost cursor-pointer">
              <Upload size={16} /> Importer
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
            </label>
          </div>
        </Section>

        {/* Cloud */}
        <Section icon={<Cloud size={20} />} title="Synchronisation cloud (Supabase)" desc="Optionnel — connecte ton propre projet Supabase pour synchroniser entre appareils.">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="URL du projet Supabase">
              <input className="input font-mono !text-xs" placeholder="https://xxxx.supabase.co" value={s.supabaseUrl}
                onChange={(e) => s.set({ supabaseUrl: e.target.value.trim() })} />
            </Field>
            <Field label="Clé anon (publique)">
              <input type="password" className="input font-mono !text-xs" placeholder="eyJ..." value={s.supabaseAnonKey}
                onChange={(e) => s.set({ supabaseAnonKey: e.target.value.trim() })} />
            </Field>
          </div>

          {!cloudConfigured() ? (
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
              <Database size={13} /> Crée la table avec le script <code className="text-slate-400">supabase/schema.sql</code>, puis renseigne tes identifiants ci-dessus.
            </p>
          ) : cloudUser ? (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700"><Check size={12} /> Connectée : {cloudUser}</span>
              <button className="btn-ghost !py-1.5 text-xs" onClick={doPush} disabled={busy}><Cloud size={14} /> Sauvegarder</button>
              <button className="btn-ghost !py-1.5 text-xs" onClick={doPull} disabled={busy}><RefreshCw size={14} /> Récupérer</button>
              <button className="btn-ghost !py-1.5 text-xs" onClick={() => { signOut(); setCloudUser(null) }}><LogOut size={14} /> Déconnexion</button>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input className="input pl-9" placeholder="ton@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={doSignIn} disabled={busy || !email}>Recevoir le lien magique</button>
            </div>
          )}
          {cloudMsg && <p className="text-xs text-slate-400 mt-3">{cloudMsg}</p>}
        </Section>
      </div>
    </div>
  )
}
