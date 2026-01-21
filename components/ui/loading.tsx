import { Loader2 } from "lucide-react"

interface LoadingProps {
  message?: string
  fullScreen?: boolean
  size?: "sm" | "md" | "lg"
}

export function Loading({ message = "Loading...", fullScreen = false, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50"
    : "flex items-center justify-center py-12"

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-[#1b7b3c]`} />
        {message && (
          <p className="text-sm text-gray-600 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  )
}

export function PageLoading() {
  return <Loading message="Loading page..." fullScreen size="lg" />
}

export function ComponentLoading() {
  return <Loading message="Loading..." size="md" />
}

export function InlineLoading() {
  return <Loading message="" size="sm" />
}
