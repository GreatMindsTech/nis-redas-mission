"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import CalendarPage from "@/components/pages/CalendarPage"

export default function Page() {
  return (
    <ProtectedRoute>
      <CalendarPage />
    </ProtectedRoute>
  )
}
