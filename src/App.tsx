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

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/board', label: 'Tableau', icon: LayoutGrid },
  { to: '/ideas', label: 'Idées', icon: KanbanSquare },
  { to: '/calendar', label: 'Calendrier', icon: CalendarDays },
  { to: '/carousels', label: 'Carrousels', icon: GalleryHorizontalEnd },
  { to: '/series', label: 'Séries', icon: Tv },
  { to: '/production', label: 'Production', icon: Clapperboard },
  { to: '/inspirations', label: 'Inspirations', icon: Bookmark },
  { to: '/library', label: 'Bibliothèque', icon: Library },
  { to: '/settings', label: 'Réglages', icon: SettingsIcon },
]

function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col text-white relative"
      style={{ background: 'linear-gradient(165deg, #7b6cf5 0%, #b85ad8 48%, #ec5a93 100%)' }}>
      <div className="flex items-center gap-3 px-5 h-16">
        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="leading-none">
          <div className="font-display font-extrabold text-lg tracking-tight text-white">Blow<span className="text-white/70">Hub</span></div>
          <div className="text-[10px] uppercase tracking-widest text-white/60">Content OS</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-white text-blow-600 shadow-soft'
                  : 'text-white/80 hover:text-white hover:bg-white/15'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {/* Plateformes = espaces de travail */}
        <div className="px-3 pt-4 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/55">Plateformes</div>
        {PLATFORMS.map((p) => (
          <NavLink key={p.id} to={`/platform/${p.id}`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive ? 'bg-white shadow-soft' : 'text-white/80 hover:text-white hover:bg-white/15'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <p.Icon size={18} style={{ color: isActive ? p.hex : '#fff' }} />
                <span style={isActive ? { color: p.hex } : undefined}>{p.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/15">
        <a
          href="https://github.com/essidyoussef-source/blowhub"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/15 transition"
        >
          <Github size={18} /> Repo du projet
        </a>
        <div className="px-3 pt-2 flex items-center gap-1.5 text-[10px] text-white/55">
          <kbd className="border border-white/25 rounded px-1 py-0.5 text-white/70">⌘K</kbd>
          <span>recherche rapide</span>
        </div>
      </div>
    </aside>
  )
}

function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex justify-around border-t border-slate-900/10 bg-ink-900/95 backdrop-blur-xl py-1.5">
      {NAV.filter((n) => ['/', '/ideas', '/calendar', '/carousels', '/library'].includes(n.to)).map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-semibold ${isActive ? 'text-blow-400' : 'text-slate-500'}`
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
