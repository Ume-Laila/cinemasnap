import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <section className="flex min-h-[65svh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#1e1e2e] bg-[#12121a] p-8 text-center">
        <h1
          className="text-6xl font-bold text-[#e11d48] sm:text-7xl"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          404
        </h1>
        <p className="mt-3 text-lg text-slate-200">Page not found</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-[#e11d48] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-rose-500"
        >
          Go Home
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
