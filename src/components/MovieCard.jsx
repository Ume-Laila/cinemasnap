import { Link } from 'react-router-dom'
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import { FiPlay } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { getPosterUrl } from '../lib/tmdb'
import { useWatchlist } from '../hooks/useWatchlist'

const MovieCard = ({ movie, onWatchlistToggle }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const inWatchlist = isInWatchlist(movie?.id)
  const releaseYear = movie?.release_date ? movie.release_date.slice(0, 4) : 'N/A'
  const stars = Number(movie?.vote_average || 0) / 2

  const handleBookmarkToggle = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (inWatchlist) {
      removeFromWatchlist(movie.id)
      toast('Removed')
      toast.success('Removed from watchlist')
    } else {
      addToWatchlist(movie)
      toast.success('Added to watchlist')
    }

    if (onWatchlistToggle) onWatchlistToggle(movie)
  }

  return (
    <Link
      to={`/movie/${movie?.id}`}
      className="group block w-[180px] shrink-0 overflow-hidden rounded-xl bg-[#12121a] shadow-md shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/40 sm:w-[200px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {movie?.poster_path ? (
          <img
            src={getPosterUrl(movie.poster_path)}
            alt={movie?.title || 'Movie poster'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-700 text-sm text-slate-300">
            No Poster
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/45">
          <span className="rounded-full border border-white/70 bg-black/40 p-3 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
            <FiPlay className="text-lg" />
          </span>
        </div>

        <button
          type="button"
          onClick={handleBookmarkToggle}
          className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white transition-colors duration-200 hover:bg-black/80"
          aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {inWatchlist ? (
            <BsBookmarkFill className="text-[#e11d48]" />
          ) : (
            <BsBookmark className="text-white" />
          )}
        </button>
      </div>

      <div className="border-t border-[#1e1e2e] bg-[#12121a] px-3 py-2">
        <h3 className="truncate text-sm font-semibold text-slate-100">{movie?.title || 'Untitled'}</h3>
        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
          <span className="text-amber-400">â˜… {stars.toFixed(1)}</span>
          <span>{releaseYear}</span>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard

