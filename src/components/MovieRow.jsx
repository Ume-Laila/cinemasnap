import { Link } from 'react-router-dom'
import MovieCard from './MovieCard'

const skeletonItems = Array.from({ length: 6 })

const MovieRow = ({ title, movies = [], loading = false, seeAllTo }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
        {seeAllTo ? (
          <Link
            to={seeAllTo}
            className="text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-[#e11d48]"
          >
            See All
          </Link>
        ) : null}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading
          ? skeletonItems.map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-[320px] w-[180px] shrink-0 animate-pulse rounded-xl bg-slate-700/50 sm:w-[200px]"
              />
            ))
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </section>
  )
}

export default MovieRow
