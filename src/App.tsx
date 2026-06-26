import { NavLink, Route, Routes } from 'react-router-dom'
import {
  LayoutDashboard, KanbanSquare, CalendarDays, GalleryHorizontalEnd,
  Clapperboard, Library, Sparkles, Github, Tv,
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import IdeasBoard from './pages/IdeasBoard'
import CalendarPage from './pages/Calendar'
import Carousels from './pages/Carousels'
import Production from './pages/Production'
import LibraryPage from './pages/LibraryPage'
import SeriesPage from './pages/Series'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/ideas', label: 'Idées', icon: KanbanSquare },
  { to: '/calendar', label: 'Calendrier', icon: CalendarDays },
  { to: '/carousels', label: 'Carrousels', icon: GalleryHorizontalEnd },
  { to: '/series', label: 'Séries', icon: Tv },
  { to: '/production', label: 'Production', icon: Clapperboard },
  { to: '/library', label: 'Bibliothèque', icon: Library },
]

function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-white/5 bg-ink-900/60 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blow-400 to-blow-700 shadow-glow">
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="leading-none">
          <div className="font-display font-extrabold text-lg tracking-tight text-white">Blow<span className="text-blow-400">Hub</span></div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500">Content OS</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-blow-500/15 text-white shadow-[inset_0_0_0_1px_rgba(255,45,119,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-blow-400' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/5">
        <a
          href="https://github.com/essidyoussef-source/blowhub"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-white hover:bg-white/5 transition"
        >
          <Github size={18} /> Repo du projet
        </a>
        <p className="px-3 pt-2 text-[10px] text-slate-600 leading-relaxed">
          Tes données sont sauvegardées dans ton navigateur. v0.1
        </p>
      </div>
    </aside>
  )
}

function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex justify-around border-t border-white/10 bg-ink-900/95 backdrop-blur-xl py-1.5">
      {NAV.map(({ to, label, icon: Icon, end }) => (
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
          <Route path="/ideas" element={<IdeasBoard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/carousels" element={<Carousels />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/production" element={<Production />} />
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </main>
      <MobileNav />
    </div>
  )
}
