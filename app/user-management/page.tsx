"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import UserManagementPage from "@/components/pages/UserManagementPage"

export default function Page() {
  return (
    <ProtectedRoute requiredRole={["admin", "super_admin"]}>
      <UserManagementPage />
    </ProtectedRoute>
  )
}
