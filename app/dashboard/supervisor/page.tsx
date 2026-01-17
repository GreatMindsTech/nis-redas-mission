"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import SupervisorDashboard from "@/components/pages/dashboards/SupervisorDashboard"

export default function Page() {
  return (
    <ProtectedRoute requiredRole="supervisor">
      <SupervisorDashboard />
    </ProtectedRoute>
  )
}
