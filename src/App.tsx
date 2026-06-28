import { NavLink, Route, Routes } from 'react-router-dom'
import {
  LayoutDashboard, KanbanSquare, CalendarDays, GalleryHorizontalEnd,
  Sparkles, Settings as SettingsIcon, Bookmark,
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import IdeasBoard from './pages/IdeasBoard'
import Board from './pages/Board'
import CalendarPage from './pages/Calendar'
import Carousels from './pages/Carousels'
import Production from './pages/Production'
import LibraryPage from './pages/LibraryPage'
import SeriesPage from './pages/Series'
import Settings from './pages/Settings'
import Inspirations from './pages/Inspirations'
import Inspire from './pages/Inspire'
import PlatformWorkspace from './pages/PlatformWorkspace'
import CommandPalette from './components/CommandPalette'
import { PLATFORMS } from './constants'

// Navigation simplifiée : 5 espaces qui regroupent toutes les fonctionnalités.
//  Idées = Pipeline + Tableau · Carrousels = Carrousels + Séries
//  Planning = Calendrier + Production · Inspirations = Veille + Bibliothèque
const NAV = [
  { to: '/', label: 'Accueil', icon: LayoutDashboard, end: true },
  { to: '/ideas', label: 'Idées', icon: KanbanSquare },
  { to: '/carousels', label: 'Carrousels', icon: GalleryHorizontalEnd },
  { to: '/calendar', label: 'Planning', icon: CalendarDays },
  { to: '/inspirations', label: 'Inspirations', icon: Bookmark },
]

// Onglet pilule (barre du haut) — l'outil actif passe en dégradé violet.
function TopTab({ to, label, Icon, end }: { to: string; label: string; Icon: any; end?: boolean }) {
  return (
    <NavLink to={to} end={end}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-all whitespace-nowrap ${
          isActive ? 'text-white shadow-glow' : 'text-slate-300 hover:text-blow-700 hover:bg-white/60'
        }`
      }
      style={({ isActive }: any) => (isActive ? { backgroundImage: 'linear-gradient(135deg,#bcaef7,#9d85f4)' } : undefined)}
    >
      <Icon size={17} />
      <span className="hidden sm:inline">{label}</span>
    </NavLink>
  )
}

// Barre du haut : logo + onglets outils + réglages.
function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 h-[68px] border-b border-white/50 bg-white/30 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="grid h-9 w-9 place-items-center rounded-2xl shadow-glow" style={{ backgroundImage: 'linear-gradient(135deg,#9d85f4,#6a54ee)' }}>
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="leading-none hidden lg:block">
          <div className="font-display font-extrabold text-base tracking-tight text-slate-100">Blow<span className="text-blow-500">Hub</span></div>
          <div className="text-[9px] uppercase tracking-widest text-slate-400">Content OS</div>
        </div>
      </div>

      <nav className="flex items-center gap-1 rounded-full bg-white/45 border border-white/60 p-1 backdrop-blur-md shadow-soft overflow-x-auto no-scrollbar">
        {NAV.map((n) => <TopTab key={n.to} to={n.to} label={n.label} Icon={n.icon} end={n.end} />)}
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <NavLink to="/settings"
          className={({ isActive }) =>
            `grid h-10 w-10 place-items-center rounded-2xl transition-all ${
              isActive ? 'text-white shadow-glow' : 'text-slate-400 hover:text-blow-600 hover:bg-white/60'
            }`
          }
          style={({ isActive }: any) => (isActive ? { backgroundImage: 'linear-gradient(135deg,#bcaef7,#9d85f4)' } : undefined)}
          title="Réglages"
        >
          <SettingsIcon size={19} />
        </NavLink>
      </div>
    </header>
  )
}

// Rail latéral ultra-fin : uniquement les logos des réseaux.
function Rail() {
  return (
    <aside className="hidden md:flex w-[72px] shrink-0 flex-col items-center gap-2.5 py-5 border-r border-white/50 bg-white/25 backdrop-blur-xl">
      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Réseaux</div>
      {PLATFORMS.map((p) => (
        <NavLink key={p.id} to={`/platform/${p.id}`} title={p.label} className="group">
          {({ isActive }) => (
            <span
              className={`grid h-12 w-12 place-items-center rounded-2xl transition-all ${isActive ? 'shadow-soft scale-105' : 'group-hover:bg-white/60'}`}
              style={{ background: isActive ? p.hex : `${p.hex}24` }}
            >
              <p.Icon size={22} style={{ color: isActive ? '#fff' : p.hex }} />
            </span>
          )}
        </NavLink>
      ))}
    </aside>
  )
}

function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-3 inset-x-3 z-40 flex justify-around rounded-3xl border border-white/70 bg-white/70 backdrop-blur-2xl shadow-glass py-2">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-semibold ${isActive ? 'text-blow-600' : 'text-slate-400'}`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function App() {
  return (
    <div className="flex h-full">
      <Rail />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto pt-5 pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/board" element={<Board />} />
            <Route path="/ideas" element={<IdeasBoard />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/carousels" element={<Carousels />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/production" element={<Production />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/inspirations" element={<Inspirations />} />
            <Route path="/inspire" element={<Inspire />} />
            <Route path="/platform/:id" element={<PlatformWorkspace />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
      <MobileNav />
      <CommandPalette />
    </div>
  )
}
