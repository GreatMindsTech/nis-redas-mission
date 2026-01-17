"use client"

import Header from "../../Header"
import Footer from "../../Footer"
import { useAuth } from "../../contexts/AuthContext"
import { ClipboardList, FileText, Clock, CheckCircle } from "lucide-react"

export default function UserDashboard() {
  const { user } = useAuth()

  const applications = [
    { id: 1, type: "Visa Application", status: "pending", date: "2024-01-15" },
    { id: 2, type: "Mission Request", status: "approved", date: "2024-01-10" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.firstName}!</h1>
        <p className="text-gray-600 mb-8">Manage your applications and missions</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: FileText, label: "Total Applications", value: "5", color: "bg-blue-50" },
            { icon: Clock, label: "Pending", value: "2", color: "bg-yellow-50" },
            { icon: CheckCircle, label: "Approved", value: "3", color: "bg-green-50" },
            { icon: ClipboardList, label: "In Progress", value: "1", color: "bg-purple-50" },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} rounded-lg p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <stat.icon className="w-12 h-12 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Recent Applications</h2>
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{app.type}</p>
                  <p className="text-sm text-gray-600">{app.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    app.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
