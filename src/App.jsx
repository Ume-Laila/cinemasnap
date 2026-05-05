import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import MovieDetailPage from './pages/MovieDetailPage'
import SearchPage from './pages/SearchPage'
import WatchlistPage from './pages/WatchlistPage'
import MoodPage from './pages/MoodPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/mood" element={<MoodPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#12121a',
              color: '#e2e8f0',
              border: '1px solid #1e1e2e',
            },
          }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App
