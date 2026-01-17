"use client"

import Header from "../../Header"
import Footer from "../../Footer"
import { FileText, CheckCircle, AlertCircle, Users } from "lucide-react"

export default function SupervisorDashboard() {
  const pendingReviews = [
    { id: 1, applicant: "John Doe", type: "Visa Application", submitted: "2024-01-15" },
    { id: 2, applicant: "Jane Smith", type: "Mission Request", submitted: "2024-01-14" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Supervisor Dashboard</h1>
        <p className="text-gray-600 mb-8">Review and manage user applications</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: FileText, label: "Total Submissions", value: "24", color: "bg-blue-50" },
            { icon: AlertCircle, label: "Pending Review", value: "8", color: "bg-yellow-50" },
            { icon: CheckCircle, label: "Approved", value: "12", color: "bg-green-50" },
            { icon: Users, label: "Users", value: "45", color: "bg-purple-50" },
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
          <h2 className="text-xl font-bold mb-6">Pending Reviews</h2>
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <div key={review.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{review.applicant}</p>
                  <p className="text-sm text-gray-600">
                    {review.type} - {review.submitted}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve</button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
