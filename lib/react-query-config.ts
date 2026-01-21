import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
})

// Query keys factory for consistent cache management
export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
  },
  // Missions
  missions: {
    all: ['missions'] as const,
    lists: () => [...queryKeys.missions.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.missions.lists(), filters] as const,
    details: () => [...queryKeys.missions.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.missions.details(), id] as const,
    staff: (id: number) => [...queryKeys.missions.detail(id), 'staff'] as const,
  },
  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
  // Reports
  reports: {
    all: ['reports'] as const,
    lists: () => [...queryKeys.reports.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.reports.lists(), filters] as const,
    details: () => [...queryKeys.reports.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.reports.details(), id] as const,
    statistics: ['reports', 'statistics'] as const,
  },
  // Documents
  documents: {
    all: ['documents'] as const,
    lists: () => [...queryKeys.documents.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.documents.lists(), filters] as const,
    details: () => [...queryKeys.documents.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.documents.details(), id] as const,
    statistics: ['documents', 'statistics'] as const,
  },
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.notifications.lists(), filters] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
  },
  // Messages
  messages: {
    all: ['messages'] as const,
    conversations: ['messages', 'conversations'] as const,
    conversation: (id: number) => ['messages', 'conversation', id] as const,
    unreadCount: ['messages', 'unread-count'] as const,
  },
  // Events
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.events.lists(), filters] as const,
    upcoming: ['events', 'upcoming'] as const,
    statistics: ['events', 'statistics'] as const,
  },
}
