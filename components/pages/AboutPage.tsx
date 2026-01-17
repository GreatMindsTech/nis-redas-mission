import Header from "../Header"
import Footer from "../Footer"
import { CheckCircle, Target, Users, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-[#1b7b3c] to-[#155730] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About REDAS</h1>
          <p className="text-xl text-gray-100">Transforming mission management for the Nigeria Immigration Service</p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To provide the Nigeria Immigration Service with a modern, efficient, and secure platform for managing
                regional diplomatic missions and streamlining visa application processes across all international
                missions.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To establish Nigeria Immigration Service as a leader in digital immigration management through
                innovative technology solutions that enhance citizen experience and strengthen diplomatic operations
                worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "Efficiency",
                description: "Streamline operations and reduce processing times",
              },
              {
                icon: Target,
                title: "Accuracy",
                description: "Ensure reliable and precise mission management",
              },
              {
                icon: CheckCircle,
                title: "Integrity",
                description: "Maintain highest standards of security and compliance",
              },
              {
                icon: Users,
                title: "Collaboration",
                description: "Foster teamwork across all international missions",
              },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <value.icon className="w-12 h-12 text-[#1b7b3c]" />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#1b7b3c] to-[#155730] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "12", label: "Active Missions" },
              { number: "156+", label: "Users" },
              { number: "500+", label: "Applications Processed" },
              { number: "98%", label: "Uptime" },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-bold mb-2">{stat.number}</p>
                <p className="text-gray-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
