"use client"

import Header from "../../Header"
import Footer from "../../Footer"
import { BarChart3, Settings, Lock, Database } from "lucide-react"

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">System-wide administration and compliance oversight</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#1b7b3c]">
            <div className="flex items-center gap-4 mb-4">
              <BarChart3 className="w-8 h-8 text-[#1b7b3c]" />
              <h2 className="text-lg font-bold">System Analytics</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">View comprehensive system statistics and reports</p>
            <button className="px-4 py-2 bg-[#1b7b3c] text-white rounded-lg hover:bg-[#155730]">View Analytics</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#1b7b3c]">
            <div className="flex items-center gap-4 mb-4">
              <Settings className="w-8 h-8 text-[#1b7b3c]" />
              <h2 className="text-lg font-bold">System Settings</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">Configure system-wide settings and policies</p>
            <button className="px-4 py-2 bg-[#1b7b3c] text-white rounded-lg hover:bg-[#155730]">
              Configure Settings
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#1b7b3c]">
            <div className="flex items-center gap-4 mb-4">
              <Lock className="w-8 h-8 text-[#1b7b3c]" />
              <h2 className="text-lg font-bold">Access Control</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">Manage user roles and security permissions</p>
            <button className="px-4 py-2 bg-[#1b7b3c] text-white rounded-lg hover:bg-[#155730]">Manage Access</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#1b7b3c]">
            <div className="flex items-center gap-4 mb-4">
              <Database className="w-8 h-8 text-[#1b7b3c]" />
              <h2 className="text-lg font-bold">Data Management</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">Backup, restore, and manage system data</p>
            <button className="px-4 py-2 bg-[#1b7b3c] text-white rounded-lg hover:bg-[#155730]">Manage Data</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
