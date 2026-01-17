"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { MapPin, Users, Building2 } from "lucide-react"

export default function MissionsPage() {
  const missions = [
    {
      id: 1,
      name: "Lagos Office",
      city: "Lagos",
      country: "Nigeria",
      region: "West Africa",
      staff: 24,
    },
    {
      id: 2,
      name: "Abuja Embassy",
      city: "Abuja",
      country: "Nigeria",
      region: "West Africa",
      staff: 18,
    },
    {
      id: 3,
      name: "Accra Mission",
      city: "Accra",
      country: "Ghana",
      region: "West Africa",
      staff: 12,
    },
    {
      id: 4,
      name: "South Africa Mission",
      city: "Johannesburg",
      country: "South Africa",
      region: "Southern Africa",
      staff: 15,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Regional Missions</h1>
        <p className="text-gray-600 mb-12">Explore all diplomatic missions managed by REDAS</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missions.map((mission) => (
            <div key={mission.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#1b7b3c] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Building2 className="text-[#1b7b3c]" size={24} />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{mission.name}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-[#1b7b3c]" />
                  {mission.city}, {mission.country}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={16} className="text-[#1b7b3c]" />
                  {mission.staff} staff members
                </div>
                <div className="text-xs text-gray-500 mt-4 pt-4 border-t">Region: {mission.region}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
