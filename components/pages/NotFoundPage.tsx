import Link from "next/link"
import Header from "../Header"
import Footer from "../Footer"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</p>
          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-[#1b7b3c] text-white font-semibold rounded-lg hover:bg-[#155730] transition"
          >
            Go Home
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
