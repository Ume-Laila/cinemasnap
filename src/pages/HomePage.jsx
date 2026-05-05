import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBookmark, FiStar } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import MovieRow from '../components/MovieRow'
import {
  getBackdropUrl,
  getGenres,
  getNowPlaying,
  getTopRated,
  getTrending,
  getUpcoming,
} from '../lib/tmdb'
import { useWatchlist } from '../hooks/useWatchlist'

const heroFadeMs = 800
const heroRotateMs = 6000

const genreGradients = [
  'from-rose-500/20 to-rose-700/20',
  'from-red-500/20 to-orange-500/20',
  'from-amber-500/20 to-yellow-600/20',
  'from-emerald-500/20 to-teal-600/20',
  'from-sky-500/20 to-cyan-600/20',
  'from-indigo-500/20 to-blue-600/20',
  'from-fuchsia-500/20 to-pink-600/20',
  'from-violet-500/20 to-purple-600/20',
]

const HomePage = () => {
  const navigate = useNavigate()
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

  const [trending, setTrending] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  const [heroIndex, setHeroIndex] = useState(0)
  const [heroVisible, setHeroVisible] = useState(true)
  const fadeTimeoutRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const fetchHomeData = async () => {
      setLoading(true)
      try {
        const [trendingRes, nowPlayingRes, topRatedRes, upcomingRes, genresRes] = await Promise.all([
          getTrending(),
          getNowPlaying(),
          getTopRated(),
          getUpcoming(),
          getGenres(),
        ])

        if (!isMounted) return

        setTrending(trendingRes.data?.results || [])
        setNowPlaying(nowPlayingRes.data?.results || [])
        setTopRated(topRatedRes.data?.results || [])
        setUpcoming(upcomingRes.data?.results || [])
        setGenres(genresRes.data?.genres || [])
      } catch {
        toast.error('Could not load movies right now. Please try again.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchHomeData()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (trending.length < 2) return undefined

    const intervalId = window.setInterval(() => {
      setHeroVisible(false)

      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current)
      }

      fadeTimeoutRef.current = window.setTimeout(() => {
        setHeroIndex((prev) => (prev + 1) % trending.length)
        setHeroVisible(true)
      }, heroFadeMs / 2)
    }, heroRotateMs)

    return () => {
      window.clearInterval(intervalId)
      if (fadeTimeoutRef.current) {
        window.clearTimeout(fadeTimeoutRef.current)
      }
    }
  }, [trending.length])

  const genreMap = useMemo(() => {
    const map = new Map()
    genres.forEach((genre) => map.set(genre.id, genre.name))
    return map
  }, [genres])

  const heroMovie = trending[heroIndex] || null
  const heroYear = heroMovie?.release_date ? heroMovie.release_date.slice(0, 4) : 'N/A'
  const heroGenres = (heroMovie?.genre_ids || [])
    .map((id) => genreMap.get(id))
    .filter(Boolean)
    .slice(0, 3)

  const heroInWatchlist = heroMovie ? isInWatchlist(heroMovie.id) : false

  const handleHeroWatchlist = () => {
    if (!heroMovie) return

    if (heroInWatchlist) {
      removeFromWatchlist(heroMovie.id)
      toast.success('Removed from watchlist')
      return
    }

    addToWatchlist(heroMovie)
    toast.success('Added to watchlist')
  }

  const heroBackdrop = heroMovie?.backdrop_path ? getBackdropUrl(heroMovie.backdrop_path, 'original') : ''

  return (
    <div className="space-y-14 pb-8">
      <section className="relative left-1/2 right-1/2 min-h-[100svh] w-screen -translate-x-1/2 overflow-hidden border-b border-[#1e1e2e]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            opacity: heroVisible ? 1 : 0.25,
            backgroundImage: heroBackdrop
              ? `linear-gradient(to top, rgba(10,10,15,0.94) 15%, rgba(10,10,15,0.45) 55%, rgba(10,10,15,0.8) 100%), url(${heroBackdrop})`
              : 'linear-gradient(135deg, rgba(225,29,72,0.2), rgba(10,10,15,0.95))',
          }}
        />

        <div
          className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-end px-4 pb-14 pt-28 transition-opacity duration-700 sm:px-6 lg:px-8"
          style={{ opacity: heroVisible ? 1 : 0.15 }}
        >
          {loading ? (
            <div className="w-full max-w-2xl animate-pulse space-y-4">
              <div className="h-6 w-36 rounded bg-slate-600/40" />
              <div className="h-14 w-4/5 rounded bg-slate-500/40" />
              <div className="h-4 w-3/5 rounded bg-slate-600/40" />
              <div className="h-12 w-full rounded bg-slate-700/40" />
              <div className="flex gap-3">
                <div className="h-11 w-36 rounded-xl bg-slate-500/40" />
                <div className="h-11 w-40 rounded-xl bg-slate-500/40" />
              </div>
            </div>
          ) : heroMovie ? (
            <div className="max-w-2xl space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-3 py-1">
                  <FiStar className="text-[#e11d48]" />
                  {Number(heroMovie.vote_average || 0).toFixed(1)}
                </span>
                <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1">{heroYear}</span>
                {heroGenres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <h1
                className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {heroMovie.title}
              </h1>

              <p className="max-w-xl text-sm leading-relaxed text-slate-200/95 sm:text-base">
                {heroMovie.overview || 'No description available for this movie yet.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={`/movie/${heroMovie.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#e11d48] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-rose-500"
                >
                  View Details
                  <FiArrowRight />
                </Link>
                <button
                  type="button"
                  onClick={handleHeroWatchlist}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-black/25 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-[#e11d48] hover:text-[#e11d48]"
                >
                  <FiBookmark />
                  {heroInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a]/80 px-5 py-4 text-slate-200">
              No featured movie available right now.
            </div>
          )}
        </div>
      </section>

      <MovieRow title="?? Trending This Week" movies={trending} loading={loading} />
      <MovieRow title="?? Now Playing" movies={nowPlaying} loading={loading} />
      <MovieRow title="? Top Rated" movies={topRated} loading={loading} />
      <MovieRow title="?? Coming Soon" movies={upcoming} loading={loading} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Browse by Genre</h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={`genre-skeleton-${index}`}
                  className="h-12 animate-pulse rounded-xl border border-[#1e1e2e] bg-[#12121a]"
                />
              ))
            : genres.map((genre, index) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() =>
                    navigate(`/search?genre=${genre.id}&name=${encodeURIComponent(genre.name)}`)
                  }
                  className={`rounded-xl border border-white/15 bg-gradient-to-r ${genreGradients[index % genreGradients.length]} px-4 py-3 text-left text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5`}
                >
                  {genre.name}
                </button>
              ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-[#1e1e2e] bg-gradient-to-r from-[#12121a] via-[#1a1220] to-[#12121a] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-[#e11d48]/35" />
        <div className="pointer-events-none absolute -bottom-14 right-16 h-40 w-40 rounded-full border border-slate-400/20" />
        <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 rounded-full border-2 border-[#e11d48]/40" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-[#e11d48]">Mood Match</p>
            <h3
              className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Not sure what to watch?
            </h3>
            <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
              Tell us your vibe and CinemaSnap will suggest films that fit your mood instantly.
            </p>
          </div>

          <Link
            to="/mood"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#e11d48] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-rose-500"
          >
            Try Mood Picker
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
