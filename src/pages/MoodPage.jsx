import { useMemo, useRef, useState } from 'react'
import { FiLoader, FiRefreshCw } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import MovieCard from '../components/MovieCard'
import { getByGenre } from '../lib/tmdb'

const moods = [
  {
    id: 'happy',
    emoji: '\uD83D\uDE04',
    name: 'Happy',
    description: 'Light, fun, feel-good films',
    genres: ['35', '10751'],
    gradient: 'from-amber-400/30 via-yellow-500/25 to-orange-500/25',
  },
  {
    id: 'scared',
    emoji: '\uD83D\uDE31',
    name: 'Scared',
    description: 'Edge of your seat terror',
    genres: ['27', '53'],
    gradient: 'from-red-500/30 via-rose-600/20 to-zinc-700/30',
  },
  {
    id: 'romantic',
    emoji: '\uD83D\uDC95',
    name: 'Romantic',
    description: 'Love stories that move you',
    genres: ['10749'],
    gradient: 'from-pink-500/30 via-rose-500/20 to-fuchsia-500/20',
  },
  {
    id: 'action',
    emoji: '\uD83C\uDFAC',
    name: 'Action',
    description: 'High octane thrills',
    genres: ['28', '12'],
    gradient: 'from-sky-500/30 via-blue-600/25 to-indigo-600/25',
  },
  {
    id: 'emotional',
    emoji: '\uD83D\uDE22',
    name: 'Emotional',
    description: 'Films that make you feel deeply',
    genres: ['18'],
    gradient: 'from-violet-500/30 via-purple-600/20 to-slate-700/30',
  },
  {
    id: 'thoughtful',
    emoji: '\uD83E\uDD14',
    name: 'Thoughtful',
    description: 'Mind-bending stories',
    genres: ['878', '9648'],
    gradient: 'from-cyan-500/25 via-teal-500/20 to-emerald-600/25',
  },
]

const MoodPage = () => {
  const [selectedMoodId, setSelectedMoodId] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const resultsRef = useRef(null)

  const selectedMood = useMemo(
    () => moods.find((mood) => mood.id === selectedMoodId) || null,
    [selectedMoodId],
  )

  const fetchMoodMovies = async (mood, page = 1) => {
    setLoading(true)

    try {
      const withGenres = mood.genres.join(',')
      const response = await getByGenre(withGenres, page)
      const results = response.data?.results || []
      setMovies(results.slice(0, 20))
      setShowResults(true)

      window.setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
    } catch {
      toast.error('Could not fetch mood movies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMoodSelect = (mood) => {
    setSelectedMoodId(mood.id)
    fetchMoodMovies(mood, 1)
  }

  const handleShuffle = () => {
    if (!selectedMood) return
    fetchMoodMovies(selectedMood, 2)
  }

  return (
    <div className="space-y-10 pb-8">
      <section className="space-y-3">
        <h1
          className="text-3xl font-bold text-white sm:text-4xl"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          What&apos;s Your Mood Tonight?
        </h1>
        <p className="text-sm text-slate-300 sm:text-base">Pick a vibe and we&apos;ll find the perfect movie</p>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {moods.map((mood) => {
          const selected = selectedMoodId === mood.id

          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => handleMoodSelect(mood)}
              className={`cursor-pointer rounded-2xl border bg-gradient-to-br ${mood.gradient} p-4 text-left transition-all duration-200 hover:scale-[1.03] sm:p-5 ${
                selected ? 'border-[#e11d48]' : 'border-[#1e1e2e]'
              }`}
            >
              <span className="text-3xl sm:text-4xl">{mood.emoji}</span>
              <h2 className="mt-3 text-base font-bold text-white sm:text-lg">{mood.name}</h2>
              <p className="mt-1 text-xs text-slate-200 sm:text-sm">{mood.description}</p>
            </button>
          )
        })}
      </section>

      {showResults ? (
        <section
          ref={resultsRef}
          className={`space-y-5 transition-all duration-500 ${loading ? 'opacity-80' : 'opacity-100'}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3
              className="text-2xl font-semibold text-white"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Perfect for your {selectedMood?.name || ''} mood {'\uD83C\uDFAC'}
            </h3>

            <button
              type="button"
              onClick={handleShuffle}
              disabled={loading || !selectedMood}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e11d48] bg-[#12121a] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#e11d48] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiRefreshCw />}
              Shuffle
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#1e1e2e] bg-[#12121a]">
              <FiLoader className="animate-spin text-2xl text-[#e11d48]" />
            </div>
          ) : (
            <div className="grid animate-[fadeIn_.4s_ease] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {movies.map((movie) => (
                <div key={movie.id} className="flex justify-center">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}

export default MoodPage