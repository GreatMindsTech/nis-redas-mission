"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import SuperAdminDashboard from "@/components/pages/dashboards/SuperAdminDashboard"

export default function Page() {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <SuperAdminDashboard />
    </ProtectedRoute>
  )
}
