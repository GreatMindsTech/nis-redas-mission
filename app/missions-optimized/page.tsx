import { Suspense } from 'react'
import { PageLoading } from '@/components/ui/loading'
import ProtectedRoute from '@/components/ProtectedRoute'
import { LazyMissionsPage } from '@/components/lazy'

// This page demonstrates the optimizations:
// 1. Lazy loading with Suspense
// 2. Protected route wrapper
// 3. Loading state during code splitting

export default function MissionsOptimizedPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoading />}>
        <LazyMissionsPage />
      </Suspense>
    </ProtectedRoute>
  )
}

// Optional: Add metadata for SEO
export const metadata = {
  title: 'Diplomatic Missions | REDAS',
  description: 'View and manage diplomatic missions',
}

// Optional: Enable ISR (Incremental Static Regeneration)
// Uncomment when ready to implement SSR
// export const revalidate = 300 // Revalidate every 5 minutes
