import { useEffect, useMemo, useState } from 'react'
import { FiFilm, FiLoader, FiSearch, FiX } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { getByGenre, getGenres, searchMovies } from '../lib/tmdb'

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Rating' },
  { value: 'release_date.desc', label: 'Release Date' },
]

const sortMovies = (items, sortBy) => {
  const list = [...items]

  if (sortBy === 'vote_average.desc') {
    return list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
  }

  if (sortBy === 'release_date.desc') {
    return list.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0))
  }

  return list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q')?.trim() || ''
  const genreId = searchParams.get('genre') || ''
  const genreName = searchParams.get('name') || ''

  const [inputValue, setInputValue] = useState(query)
  const [genres, setGenres] = useState([])
  const [sortBy, setSortBy] = useState('popularity.desc')

  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    setInputValue(query)
  }, [query])

  useEffect(() => {
    let isMounted = true

    const fetchGenres = async () => {
      try {
        const response = await getGenres()
        if (!isMounted) return
        setGenres(response.data?.genres || [])
      } catch {
        toast.error('Could not load genres right now.')
      }
    }

    fetchGenres()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchFirstPage = async () => {
      setLoading(true)
      setPage(1)

      try {
        if (query) {
          const response = await searchMovies(query, 1)
          if (!isMounted) return
          setMovies(response.data?.results || [])
          setTotalPages(response.data?.total_pages || 1)
          setTotalResults(response.data?.total_results || 0)
          return
        }

        if (genreId) {
          const response = await getByGenre(genreId, 1)
          if (!isMounted) return
          setMovies(response.data?.results || [])
          setTotalPages(response.data?.total_pages || 1)
          setTotalResults(response.data?.total_results || 0)
          return
        }

        setMovies([])
        setTotalPages(1)
        setTotalResults(0)
      } catch {
        if (!isMounted) return
        toast.error('Search failed. Please try again.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchFirstPage()

    return () => {
      isMounted = false
    }
  }, [query, genreId])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const trimmed = inputValue.trim()

    if (!trimmed) {
      setSearchParams({})
      return
    }

    setSearchParams({ q: trimmed })
  }

  const clearSearch = () => {
    setInputValue('')
    setSearchParams({})
  }

  const selectGenre = (genre) => {
    setSearchParams({ genre: String(genre.id), name: genre.name })
  }

  const clearGenre = () => {
    if (query) {
      setSearchParams({ q: query })
      return
    }
    setSearchParams({})
  }

  const handleLoadMore = async () => {
    const nextPage = page + 1
    if (loadingMore || nextPage > totalPages) return

    setLoadingMore(true)
    try {
      const response = query ? await searchMovies(query, nextPage) : await getByGenre(genreId, nextPage)
      const nextMovies = response.data?.results || []
      setMovies((prev) => [...prev, ...nextMovies])
      setPage(nextPage)
      setTotalPages(response.data?.total_pages || totalPages)
      setTotalResults(response.data?.total_results || totalResults)
    } catch {
      toast.error('Could not load more movies.')
    } finally {
      setLoadingMore(false)
    }
  }

  const sortedMovies = useMemo(() => sortMovies(movies, sortBy), [movies, sortBy])
  const showLoadMore = (query || genreId) && page < totalPages

  const resultLabel = query
    ? `Found ${totalResults.toLocaleString()} results for '${query}'`
    : genreId
      ? `Found ${totalResults.toLocaleString()} results for '${genreName || 'selected genre'}'`
      : 'Search by title or pick a genre'

  return (
    <div className="space-y-6 pb-8">
      <section className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Search movies..."
            className="w-full rounded-xl border border-[#1e1e2e] bg-[#12121a] py-3 pl-10 pr-11 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-[#e11d48]"
          />
          {inputValue ? (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
              aria-label="Clear search"
            >
              <FiX />
            </button>
          ) : null}
        </form>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={clearGenre}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                !genreId
                  ? 'border-[#e11d48] bg-[#e11d48] text-white'
                  : 'border-[#1e1e2e] bg-[#12121a] text-slate-300 hover:border-[#e11d48] hover:text-white'
              }`}
            >
              All
            </button>
            {genres.map((genre) => {
              const active = String(genre.id) === String(genreId)
              return (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => selectGenre(genre)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'border-[#e11d48] bg-[#e11d48] text-white'
                      : 'border-[#1e1e2e] bg-[#12121a] text-slate-300 hover:border-[#e11d48] hover:text-white'
                  }`}
                >
                  {genre.name}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label htmlFor="sortBy" className="text-xs font-medium text-slate-400">
              Sort by
            </label>
            <select
              id="sortBy"
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
        </div>
      </section>

      <p className="text-sm text-slate-300">{resultLabel}</p>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="h-[320px] animate-pulse rounded-xl bg-slate-700/40" />
          ))}
        </div>
      ) : sortedMovies.length ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sortedMovies.map((movie) => (
              <div key={movie.id} className="flex justify-center">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {showLoadMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-xl border border-[#e11d48] bg-[#12121a] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#e11d48] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingMore ? <FiLoader className="animate-spin" /> : null}
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex min-h-[45svh] flex-col items-center justify-center rounded-2xl border border-[#1e1e2e] bg-[#12121a] px-6 text-center">
          <FiFilm className="text-5xl text-slate-500" />
          <h3 className="mt-4 text-xl font-semibold text-slate-100">No movies found</h3>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            Try another keyword, choose a different genre, or remove filters to discover more movies.
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchPage
