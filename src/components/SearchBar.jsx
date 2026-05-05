import { useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={onSubmit} className="w-full md:hidden">
      <div className="relative">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search movies..."
          className="w-full rounded-xl border border-[#1e1e2e] bg-[#12121a] py-2 pl-10 pr-10 text-sm text-slate-100 outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-[#e11d48]"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
            aria-label="Clear search"
          >
            <FiX />
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default SearchBar
