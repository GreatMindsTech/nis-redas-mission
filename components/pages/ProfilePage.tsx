"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/components/contexts/AuthContext"
import { User, Mail, Shield, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">User Profile</h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-[#1b7b3c] text-white rounded-full flex items-center justify-center text-3xl font-bold">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600 capitalize">{user.role.replace("_", " ")}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-[#1b7b3c]" size={24} />
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Shield className="text-[#1b7b3c]" size={24} />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-semibold text-gray-900 capitalize">{user.role.replace("_", " ")}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <User className="text-[#1b7b3c]" size={24} />
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-semibold text-gray-900">{user.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Calendar className="text-[#1b7b3c]" size={24} />
              <div>
                <p className="text-sm text-gray-600">Email Status</p>
                <p className="font-semibold text-gray-900">{user.isVerified ? "✓ Verified" : "Pending Verification"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
