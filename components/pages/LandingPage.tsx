import Link from "next/link"
import Header from "../Header"
import Footer from "../Footer"
import { ArrowRight, Globe, Users, Shield, CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-[#1b7b3c] to-[#155730] text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Regional Diplomatic And Support Missions Management
              </h1>
              <p className="text-lg text-gray-100 mb-8">
                Streamlined mission and visa application management for Nigeria Immigration Service
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#1b7b3c] font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Get Started <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[#1b7b3c] transition"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-64 h-64 bg-white bg-opacity-10 rounded-2xl flex items-center justify-center">
                <Globe size={120} className="text-white opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Key Features</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Modern mission management with comprehensive support for all user types
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: "Global Missions",
                description: "Manage multiple diplomatic missions worldwide",
              },
              {
                icon: Users,
                title: "Multi-Role Access",
                description: "Tailored access for users, supervisors, and admins",
              },
              {
                icon: Shield,
                title: "Secure System",
                description: "Enterprise-grade security for sensitive data",
              },
              {
                icon: CheckCircle,
                title: "Streamlined Process",
                description: "Efficient visa and mission management workflows",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
                <feature.icon className="w-12 h-12 text-[#1b7b3c] mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Designed for All Users</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            REDAS provides role-specific dashboards and features for optimal workflow management
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                role: "User",
                description: "Submit visa applications and track mission requests",
              },
              {
                role: "Supervisor",
                description: "Review and approve user submissions",
              },
              {
                role: "Admin",
                description: "Manage missions, users, and system operations",
              },
              {
                role: "Super Admin",
                description: "System-wide administration and compliance oversight",
              },
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-[#1b7b3c] from-10% to-gray-50 p-8 rounded-xl">
                <h3 className="text-xl font-bold text-[#1b7b3c] mb-3">{item.role}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
