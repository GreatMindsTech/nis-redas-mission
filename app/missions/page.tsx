"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import MissionsPage from "@/components/pages/MissionsPage"

export default function Page() {
  return (
    <ProtectedRoute>
      <MissionsPage />
    </ProtectedRoute>
  )
}
