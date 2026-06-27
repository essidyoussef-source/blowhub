import { NavLink, Route, Routes } from 'react-router-dom'
import {
  LayoutDashboard, KanbanSquare, CalendarDays, GalleryHorizontalEnd,
  Clapperboard, Library, Sparkles, Github, Tv, Settings as SettingsIcon, LayoutGrid, Bookmark,
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

function NavItem({ to, label, Icon, end }: { to: string; label: string; Icon: any; end?: boolean }) {
  return (
    <NavLink to={to} end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all ${
          isActive ? 'text-white shadow-glow' : 'text-slate-300 hover:text-blow-700 hover:bg-white/60'
        }`
      }
      style={({ isActive }: any) => (isActive ? { backgroundImage: 'linear-gradient(135deg,#bcaef7,#9d85f4)' } : undefined)}
    >
      <Icon size={19} />
      {label}
    </NavLink>
  )
}

function Sidebar() {
  return (
    <aside className="hidden md:flex w-[248px] shrink-0 flex-col border-r border-white/60"
      style={{ background: 'radial-gradient(240px 300px at 16% 4%, rgba(244,158,205,0.62), transparent 64%), radial-gradient(220px 300px at 94% 16%, rgba(201,168,244,0.58), transparent 64%), radial-gradient(260px 320px at 22% 88%, rgba(243,138,196,0.50), transparent 64%), radial-gradient(240px 300px at 98% 98%, rgba(176,156,246,0.50), transparent 64%), linear-gradient(180deg,#fdeef6,#f6ecfb)' }}>
      <div className="flex items-center gap-3 px-5 h-[72px]">
        <div className="grid h-10 w-10 place-items-center rounded-2xl shadow-glow" style={{ backgroundImage: 'linear-gradient(135deg,#9d85f4,#6a54ee)' }}>
          <Sparkles size={20} className="text-white" />
        </div>
        <div className="leading-none">
          <div className="font-display font-extrabold text-lg tracking-tight text-slate-100">Blow<span className="text-blow-500">Hub</span></div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400">Content OS</div>
        </div>
      </div>

      <nav className="flex-1 px-3 pb-3 space-y-1.5 overflow-y-auto no-scrollbar">
        {NAV.map((n) => <NavItem key={n.to} to={n.to} label={n.label} Icon={n.icon} end={n.end} />)}

        <div className="px-3.5 pt-5 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Mes plateformes</div>
        {PLATFORMS.map((p) => (
          <NavLink key={p.id} to={`/platform/${p.id}`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                isActive ? 'bg-white shadow-soft' : 'text-slate-300 hover:text-slate-100 hover:bg-white/60'
              }`
            }>
            {({ isActive }) => (
              <>
                <span className="grid h-7 w-7 place-items-center rounded-xl" style={{ background: isActive ? p.hex : `${p.hex}1f` }}>
                  <p.Icon size={15} style={{ color: isActive ? '#fff' : p.hex }} />
                </span>
                <span style={isActive ? { color: p.hex } : undefined}>{p.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <NavItem to="/settings" label="Réglages" Icon={SettingsIcon} />
        <div className="px-3.5 pt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
          <kbd className="border border-slate-900/15 rounded px-1 py-0.5">⌘K</kbd>
          <span>recherche rapide</span>
        </div>
      </div>
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
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
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
      <MobileNav />
      <CommandPalette />
    </div>
  )
}
