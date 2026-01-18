"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import DocumentsReviewPage from "@/components/pages/DocumentsReviewPage"

export default function Page() {
  return (
    <ProtectedRoute>
      <DocumentsReviewPage />
    </ProtectedRoute>
  )
}
