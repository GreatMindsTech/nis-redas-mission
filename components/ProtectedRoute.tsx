"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "./contexts/AuthContext"
import LoadingSpinner from "./LoadingSpinner"
import { useEffect, useState } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, hasRole } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/login")
      return
    }

    if (requiredRole && !hasRole(requiredRole)) {
      router.push("/")
      return
    }

    setIsChecking(false)
  }, [user, loading, requiredRole, hasRole, router])

  if (loading || isChecking) {
    return <LoadingSpinner />
  }

  return <>{children}</>
}
