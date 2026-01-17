import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-6">
              <img src="/nis-logo.svg" alt="NIS Logo" className="h-20 mx-auto mb-4" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">REDAS Missions Management</h1>
            <p className="text-xl text-gray-600 mb-8">Regional Diplomatic And Support Missions Management System</p>
            <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
              Streamlined visa applications, mission tracking, and diplomatic support for Nigeria Immigration Service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Get Started
              </a>
              <a
                href="/about"
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Application Management</h3>
              <p className="text-gray-600">Easy submission and tracking of visa applications and documents</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Mission Tracking</h3>
              <p className="text-gray-600">Track diplomatic missions and support services worldwide</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-gray-600">Different views and permissions for users, supervisors, and admins</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
