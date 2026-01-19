"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import MessagingPage from "@/components/pages/MessagingPage"

export default function Page() {
  return (
    <ProtectedRoute>
      <MessagingPage />
    </ProtectedRoute>
  )
}
