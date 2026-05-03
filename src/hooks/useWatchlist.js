import { useMemo, useState } from 'react'

const STORAGE_KEY = 'cinemasnap_watchlist'

const readWatchlist = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState(readWatchlist)

  const addToWatchlist = (movie) => {
    setWatchlist((prev) => {
      if (prev.some((item) => item.id === movie.id)) return prev
      const next = [...prev, movie]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => {
      const next = prev.filter((item) => item.id !== movieId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const isInWatchlist = useMemo(() => {
    const ids = new Set(watchlist.map((item) => item.id))
    return (movieId) => ids.has(movieId)
  }, [watchlist])

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }
}

