"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import ArchivingPage from "@/components/pages/ArchivingPage"

export default function Page() {
  return (
    <ProtectedRoute>
      <ArchivingPage />
    </ProtectedRoute>
  )
}
