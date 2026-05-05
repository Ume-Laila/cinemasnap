import { useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiBookmark,
  FiFilm,
  FiMenu,
  FiSearch,
  FiX,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'

const STORAGE_KEY = 'cinemasnap_watchlist'

const getWatchlistCount = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return 0
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch {
    return 0
  }
}

const linkBase =
  'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white'

const Navbar = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [watchlistCount, setWatchlistCount] = useState(0)

  useEffect(() => {
    const syncCount = () => setWatchlistCount(getWatchlistCount())
    syncCount()

    window.addEventListener('storage', syncCount)
    const pollId = window.setInterval(syncCount, 1200)

    return () => {
      window.removeEventListener('storage', syncCount)
      window.clearInterval(pollId)
    }
  }, [])

  const navItems = useMemo(
    () => [
      {
        to: '/watchlist',
        label: 'Watchlist',
        icon: FiBookmark,
        badge: watchlistCount,
      },
      {
        to: '/mood',
        label: 'Mood Picker',
        icon: HiSparkles,
      },
    ],
    [watchlistCount],
  )

  const onSearchSubmit = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e1e2e] bg-black/80 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="inline-flex items-center gap-2 rounded-md px-1 py-1 transition-opacity duration-200 hover:opacity-90"
        >
          <FiFilm className="text-2xl text-white" />
          <span className="text-xl font-bold leading-none">
            <span className="text-white">Cinema</span>
            <span className="text-[#e11d48]">Snap</span>
          </span>
        </NavLink>

        <form onSubmit={onSearchSubmit} className="relative hidden w-full max-w-md md:block">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies..."
            className="w-full rounded-xl border border-[#1e1e2e] bg-[#12121a] py-2 pl-10 pr-4 text-sm text-slate-100 outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-[#e11d48]"
          />
        </form>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, label, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'text-[#e11d48] hover:text-[#e11d48]' : ''}`
              }
            >
              <Icon className="text-base" />
              <span>{label}</span>
              {typeof badge === 'number' ? (
                <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[#e11d48] px-1.5 py-0.5 text-xs font-semibold text-white">
                  {badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-[#1e1e2e] bg-[#12121a] p-2 text-slate-200 transition-colors duration-200 hover:bg-white/10 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-[#1e1e2e] bg-[#0a0a0f] px-4 py-4 md:hidden">
          <form onSubmit={onSearchSubmit} className="relative mb-3">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies..."
              className="w-full rounded-xl border border-[#1e1e2e] bg-[#12121a] py-2 pl-10 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-[#e11d48]"
            />
          </form>

          <div className="flex flex-col gap-1">
            {navItems.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} justify-between ${isActive ? 'text-[#e11d48] hover:text-[#e11d48]' : ''}`
                }
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="text-base" />
                  <span>{label}</span>
                </span>
                {typeof badge === 'number' ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#e11d48] px-1.5 py-0.5 text-xs font-semibold text-white">
                    {badge}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar

