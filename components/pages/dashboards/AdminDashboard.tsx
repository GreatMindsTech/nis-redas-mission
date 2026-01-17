"use client"

import Header from "../../Header"
import Footer from "../../Footer"
import { Users, Building2, AlertTriangle, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage missions, users, and system operations</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, label: "Total Users", value: "156", color: "bg-blue-50" },
            { icon: Building2, label: "Active Missions", value: "12", color: "bg-green-50" },
            { icon: AlertTriangle, label: "Issues", value: "3", color: "bg-red-50" },
            { icon: TrendingUp, label: "System Health", value: "98%", color: "bg-purple-50" },
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">User Management</h2>
            <p className="text-gray-600 text-sm mb-4">Manage user accounts, roles, and permissions</p>
            <button className="px-4 py-2 bg-[#1b7b3c] text-white rounded-lg hover:bg-[#155730]">Manage Users</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">Mission Management</h2>
            <p className="text-gray-600 text-sm mb-4">Create and manage regional missions</p>
            <button className="px-4 py-2 bg-[#1b7b3c] text-white rounded-lg hover:bg-[#155730]">Manage Missions</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
