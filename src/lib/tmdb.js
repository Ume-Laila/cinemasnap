import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/'

export const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
})

export const getTrending = (page = 1) => tmdb.get('/trending/movie/week', { params: { page } })
export const getTopRated = (page = 1) => tmdb.get('/movie/top_rated', { params: { page } })
export const getNowPlaying = (page = 1) => tmdb.get('/movie/now_playing', { params: { page } })
export const getUpcoming = (page = 1) => tmdb.get('/movie/upcoming', { params: { page } })
export const getMovieDetails = (id) => tmdb.get(`/movie/${id}`, { params: { append_to_response: 'credits,similar,videos' } })
export const searchMovies = (query, page = 1) => tmdb.get('/search/movie', { params: { query, page } })
export const getByGenre = (genreId, page = 1) => tmdb.get('/discover/movie', { params: { with_genres: genreId, page } })
export const getGenres = () => tmdb.get('/genre/movie/list')

export const getPosterUrl = (path, size = 'w500') => (path ? `${IMAGE_BASE_URL}${size}${path}` : '')
export const getBackdropUrl = (path, size = 'original') => (path ? `${IMAGE_BASE_URL}${size}${path}` : '')

