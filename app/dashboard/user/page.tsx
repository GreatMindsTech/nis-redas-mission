"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import UserDashboard from "@/components/pages/dashboards/UserDashboard"

export default function Page() {
  return (
    <ProtectedRoute requiredRole="user">
      <UserDashboard />
    </ProtectedRoute>
  )
}
