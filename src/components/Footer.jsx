import { NavLink } from 'react-router-dom'
import { FiFilm } from 'react-icons/fi'

const Footer = () => {
  const linkClass = ({ isActive }) =>
    `text-sm transition-colors duration-200 hover:text-white ${isActive ? 'text-[#e11d48]' : 'text-slate-400'}`

  return (
    <footer className="mt-12 border-t border-[#1e1e2e] bg-[#0a0a0f]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-2 inline-flex items-center gap-2">
            <FiFilm className="text-xl text-white" />
            <span className="text-lg font-bold">
              <span className="text-white">Cinema</span>
              <span className="text-[#e11d48]">Snap</span>
            </span>
          </div>
          <p className="text-sm text-slate-400">Discover your next favorite film</p>
        </div>

        <div className="flex flex-col gap-2">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/search" className={linkClass}>
            Search
          </NavLink>
          <NavLink to="/watchlist" className={linkClass}>
            Watchlist
          </NavLink>
          <NavLink to="/mood" className={linkClass}>
            Mood Picker
          </NavLink>
        </div>

        <div className="md:text-right">
          <p className="text-sm font-medium text-[#14b8a6]">Powered by TMDB</p>
        </div>
      </div>

      <div className="border-t border-[#1e1e2e] px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
        Built by Ume Laila — CS Student @ NUML
      </div>
    </footer>
  )
}

export default Footer
