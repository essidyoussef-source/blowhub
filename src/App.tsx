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

// Onglet façon Google — texte simple + soulignement de l'onglet actif.
function TopTab({ to, label, Icon, end }: { to: string; label: string; Icon: any; end?: boolean }) {
  return (
    <NavLink to={to} end={end}
      className={({ isActive }) =>
        `relative inline-flex items-center gap-2 h-full px-1 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
          isActive ? 'border-blow-600 text-slate-100' : 'border-transparent text-slate-400 hover:text-slate-200'
        }`
      }
    >
      <Icon size={16} />
      <span className="hidden sm:inline">{label}</span>
    </NavLink>
  )
}

// Barre du haut : logo + onglets outils soulignés + réglages.
function TopBar() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-ink-700">
      <div className="flex items-stretch gap-6 px-4 md:px-6 h-14">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-blow-600">
            <Sparkles size={17} className="text-white" />
          </div>
          <div className="font-display font-bold text-[15px] tracking-tight text-slate-100 hidden lg:block">Blow Hub</div>
        </div>

        <nav className="flex items-stretch gap-6 overflow-x-auto no-scrollbar">
          {NAV.map((n) => <TopTab key={n.to} to={n.to} label={n.label} Icon={n.icon} end={n.end} />)}
        </nav>

        <div className="ml-auto flex items-center">
          <NavLink to="/settings"
            className={({ isActive }) =>
              `grid h-9 w-9 place-items-center rounded-lg transition-colors ${
                isActive ? 'text-slate-100 bg-ink-800' : 'text-slate-400 hover:text-slate-100 hover:bg-ink-800'
              }`
            }
            title="Réglages"
          >
            <SettingsIcon size={18} />
          </NavLink>
        </div>
      </div>
    </header>
  )
}

// Rail latéral ultra-fin : uniquement les logos des réseaux.
function Rail() {
  return (
    <aside className="hidden md:flex w-14 shrink-0 flex-col items-center gap-1 py-3 border-r border-ink-700 bg-white">
      {PLATFORMS.map((p) => (
        <NavLink key={p.id} to={`/platform/${p.id}`} title={p.label} className="group">
          {({ isActive }) => (
            <span
              className={`grid h-10 w-10 place-items-center rounded-lg transition-colors ${isActive ? '' : 'group-hover:bg-ink-800'}`}
              style={isActive ? { background: `${p.hex}1f` } : undefined}
            >
              <p.Icon size={19} style={{ color: isActive ? p.hex : '#9a9aa3' }} />
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
