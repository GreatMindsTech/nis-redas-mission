"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import AdminDashboard from "@/components/pages/dashboards/AdminDashboard"

export default function Page() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
}
