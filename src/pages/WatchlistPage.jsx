import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiBookmark, FiFilm } from 'react-icons/fi'
import MovieCard from '../components/MovieCard'
import { useWatchlist } from '../hooks/useWatchlist'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'rating', label: 'Rating High to Low' },
]

const WatchlistPage = () => {
  const { watchlist } = useWatchlist()
  const [sortBy, setSortBy] = useState('recent')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  const sortedWatchlist = useMemo(() => {
    const items = [...watchlist]

    if (sortBy === 'title') {
      return items.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    }

    if (sortBy === 'rating') {
      return items.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    }

    return items.reverse()
  }, [watchlist, sortBy])

  return (
    <div
      className="space-y-8 pb-8 transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
    >
      <section className="relative overflow-hidden rounded-2xl border border-[#1e1e2e] bg-gradient-to-r from-[#12121a] via-[#191927] to-[#12121a] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 text-8xl text-white/5">
          <FiBookmark />
        </div>

        <div className="relative z-10">
          <h1
            className="text-3xl font-bold text-white sm:text-4xl"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            My Watchlist
          </h1>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">{watchlist.length} movies saved</p>
        </div>
      </section>

      {watchlist.length === 0 ? (
        <section className="flex min-h-[55svh] flex-col items-center justify-center rounded-2xl border border-[#1e1e2e] bg-[#12121a] px-6 text-center">
          <FiFilm className="text-6xl text-slate-500" />
          <h2 className="mt-5 text-2xl font-semibold text-slate-100">Your watchlist is empty</h2>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">Start adding movies you want to watch!</p>
          <Link
            to="/"
            className="mt-6 rounded-xl bg-[#e11d48] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-rose-500"
          >
            Browse Movies
          </Link>
        </section>
      ) : (
        <>
          <section className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-300">Showing {watchlist.length} saved movies</p>
            <div className="flex items-center gap-2">
              <label htmlFor="watchlist-sort" className="text-xs font-medium text-slate-400">
                Sort by
              </label>
              <select
                id="watchlist-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-lg border border-[#1e1e2e] bg-[#12121a] px-3 py-2 text-xs text-slate-100 outline-none focus:border-[#e11d48]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sortedWatchlist.map((movie) => (
              <div key={movie.id} className="flex justify-center">
                <MovieCard movie={movie} />
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  )
}

export default WatchlistPage
