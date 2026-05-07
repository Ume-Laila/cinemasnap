import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiExternalLink, FiStar } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import MovieRow from '../components/MovieRow'
import { getBackdropUrl, getMovieDetails, getPosterUrl } from '../lib/tmdb'
import { useWatchlist } from '../hooks/useWatchlist'

const formatRuntime = (minutes) => {
  if (!minutes || Number.isNaN(minutes)) return 'N/A'
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hrs}h ${mins}m`
}

const formatMoney = (value) => {
  if (!value || value <= 0) return 'N/A'
  const millions = value / 1_000_000
  return `$${millions.toFixed(1)}M`
}

const formatLanguage = (code) => {
  if (!code) return 'N/A'
  return code.toUpperCase()
}

const MovieDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchMovie = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getMovieDetails(id)
        if (!isMounted) return
        setMovie(response.data || null)
      } catch {
        if (!isMounted) return
        setError('Could not load this movie right now.')
        toast.error('Failed to load movie details')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) fetchMovie()

    return () => {
      isMounted = false
    }
  }, [id])

  const inWatchlist = movie ? isInWatchlist(movie.id) : false

  const trailer = useMemo(() => {
    const videos = movie?.videos?.results || []
    const preferred = videos.find(
      (video) =>
        video.site === 'YouTube' &&
        video.type === 'Trailer' &&
        (video.official || /official/i.test(video.name || '')),
    )

    const fallback = videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer')
    return preferred || fallback || null
  }, [movie])

  const trailerUrl = trailer?.key ? `https://www.youtube.com/watch?v=${trailer.key}` : ''

  const topCast = (movie?.credits?.cast || []).slice(0, 10)
  const similarMovies = movie?.similar?.results || []

  const releaseYear = movie?.release_date ? movie.release_date.slice(0, 4) : 'N/A'
  const voteAverage = Number(movie?.vote_average || 0).toFixed(1)
  const voteCount = movie?.vote_count ? movie.vote_count.toLocaleString() : '0'

  const handleWatchlist = () => {
    if (!movie) return

    if (inWatchlist) {
      removeFromWatchlist(movie.id)
      toast.success('Removed from watchlist')
      return
    }

    addToWatchlist(movie)
    toast.success('Added to watchlist')
  }

  if (loading) {
    return (
      <div className="space-y-10 pb-8">
        <section className="left-1/2 right-1/2 relative min-h-[85svh] w-screen -translate-x-1/2 overflow-hidden border-b border-[#1e1e2e] bg-[#12121a]">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-700/30 via-slate-600/10 to-slate-800/20" />
          <div className="relative z-10 mx-auto flex min-h-[85svh] w-full max-w-7xl items-end px-4 pb-12 pt-28 sm:px-6 lg:px-8">
            <div className="flex w-full flex-col gap-6 md:flex-row md:items-end">
              <div className="h-[300px] w-[200px] animate-pulse rounded-xl bg-slate-600/40 sm:h-[360px] sm:w-[240px]" />
              <div className="w-full max-w-3xl space-y-4">
                <div className="h-12 w-3/4 animate-pulse rounded bg-slate-600/40" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-slate-700/40" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-700/40" />
                <div className="h-20 w-full animate-pulse rounded bg-slate-700/40" />
                <div className="flex gap-3">
                  <div className="h-11 w-44 animate-pulse rounded-xl bg-slate-600/40" />
                  <div className="h-11 w-36 animate-pulse rounded-xl bg-slate-600/40" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-10">
          <div className="space-y-4">
            <div className="h-7 w-32 animate-pulse rounded bg-slate-700/40" />
            <div className="flex gap-4 overflow-x-auto pb-2">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="h-56 w-36 shrink-0 animate-pulse rounded-xl bg-slate-700/40" />
              ))}
            </div>
          </div>

          <MovieRow title="You Might Also Like" loading />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-xl border border-[#1e1e2e] bg-[#12121a]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#1e1e2e] bg-[#12121a] p-6 text-center">
          <p className="text-lg font-semibold text-slate-100">{error || 'Movie not found.'}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#e11d48] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-rose-500"
          >
            <FiArrowLeft />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 pb-8">
      <section className="left-1/2 right-1/2 relative w-screen -translate-x-1/2 overflow-hidden border-b border-[#1e1e2e]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: movie.backdrop_path
              ? `linear-gradient(to right, rgba(10,10,15,0.92) 8%, rgba(10,10,15,0.7) 45%, rgba(10,10,15,0.88) 100%), linear-gradient(to top, rgba(10,10,15,0.98) 6%, rgba(10,10,15,0.2) 60%), url(${getBackdropUrl(movie.backdrop_path, 'original')})`
              : 'linear-gradient(135deg, rgba(225,29,72,0.22), rgba(10,10,15,0.95))',
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="flex w-full flex-col gap-6 md:flex-row md:items-end">
            <div className="mx-auto w-[210px] shrink-0 sm:w-[240px] md:mx-0">
              {movie.poster_path ? (
                <img
                  src={getPosterUrl(movie.poster_path, 'w342')}
                  alt={movie.title || 'Movie poster'}
                  className="w-full rounded-xl shadow-2xl shadow-black/50"
                />
              ) : (
                <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl bg-slate-700/50 text-sm text-slate-300">
                  No Poster
                </div>
              )}
            </div>

            <div className="w-full max-w-4xl space-y-4">
              <h1
                className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {movie.title}
              </h1>

              {movie.tagline ? <p className="italic text-slate-300">{movie.tagline}</p> : null}

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-3 py-1">
                  <FiStar className="text-[#e11d48]" />
                  {voteAverage}
                </span>
                <span>{voteCount} votes</span>
                <span className="text-slate-400">•</span>
                <span>{releaseYear}</span>
                <span className="text-slate-400">•</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(movie.genres || []).map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-[#e11d48]/60 px-3 py-1 text-xs font-medium text-[#fda4af]"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
                {movie.overview || 'No plot overview is available for this movie.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleWatchlist}
                  className="rounded-xl bg-[#e11d48] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-rose-500"
                >
                  {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>

                {trailerUrl ? (
                  <a
                    href={trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-black/20 px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-[#e11d48] hover:text-[#e11d48]"
                  >
                    Watch Trailer
                    <FiExternalLink />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Top Cast</h2>

        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {topCast.length ? (
            topCast.map((person) => (
              <article
                key={person.cast_id || person.credit_id || person.id}
                className="w-36 shrink-0 overflow-hidden rounded-xl border border-[#1e1e2e] bg-[#12121a]"
              >
                {person.profile_path ? (
                  <img
                    src={getPosterUrl(person.profile_path, 'w342')}
                    alt={person.name}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-slate-700/40 text-xs text-slate-300">
                    No Photo
                  </div>
                )}
                <div className="space-y-1 p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-slate-100">{person.name}</p>
                  <p className="line-clamp-2 text-xs text-slate-400">{person.character || 'Unknown role'}</p>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-400">Cast information is not available.</p>
          )}
        </div>
      </section>

      <MovieRow title="You Might Also Like" movies={similarMovies} loading={false} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Details</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">{movie.status || 'N/A'}</p>
          </div>

          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Original Language</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">{formatLanguage(movie.original_language)}</p>
          </div>

          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Budget</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">{formatMoney(movie.budget)}</p>
          </div>

          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Revenue</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">{formatMoney(movie.revenue)}</p>
          </div>

          <div className="rounded-xl border border-[#1e1e2e] bg-[#12121a] p-4 sm:col-span-2 lg:col-span-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">Production Companies</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">
              {movie.production_companies?.length
                ? movie.production_companies.map((company) => company.name).join(', ')
                : 'N/A'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MovieDetailPage
