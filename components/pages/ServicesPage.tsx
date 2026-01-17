"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Dessert as Passport, Globe, FileCheck, Users, Building2, Zap } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: Passport,
      title: "Visa Management",
      description: "Complete visa application processing, tracking, and approval workflow management",
    },
    {
      icon: Passport,
      title: "Passport Services",
      description: "Streamlined passport issuance and renewal processes across all missions",
    },
    {
      icon: FileCheck,
      title: "Document Processing",
      description: "Secure document submission, verification, and archival system",
    },
    {
      icon: Globe,
      title: "Mission Support",
      description: "Dedicated support for all regional diplomatic missions worldwide",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Comprehensive role-based access control and user administration",
    },
    {
      icon: Building2,
      title: "Mission Administration",
      description: "Create, manage, and monitor all international mission operations",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-[#1b7b3c] to-[#155730] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-100">Comprehensive solutions for immigration mission management</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition">
                <service.icon className="w-12 h-12 text-[#1b7b3c] mb-4" />
                <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose REDAS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Lightning Fast",
                description: "Optimized for speed and performance across all operations",
              },
              {
                title: "Global Reach",
                description: "Manage missions across all continents from a single platform",
              },
              {
                title: "Highly Secure",
                description: "Enterprise-grade security with end-to-end encryption",
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock technical support for all users",
              },
              {
                title: "Easy Integration",
                description: "Seamlessly integrates with existing systems",
              },
              {
                title: "Scalable",
                description: "Grows with your organization's needs",
              },
            ].map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-12 h-12 bg-[#1b7b3c] text-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
