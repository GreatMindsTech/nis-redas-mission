import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { apiClient, ApiClientError } from '@/lib/api-client'
import { queryKeys } from '@/lib/react-query-config'
import { buildQueryString } from '@/lib/api-client'

// Types
export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// Missions Hooks
export function useMissions(filters?: Record<string, any>) {
  const queryString = filters ? buildQueryString(filters) : ''
  
  return useQuery({
    queryKey: queryKeys.missions.list(filters || {}),
    queryFn: () => apiClient.get<PaginatedResponse<any>>(`/missions${queryString}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useMission(id: number, options?: UseQueryOptions) {
  return useQuery({
    queryKey: queryKeys.missions.detail(id),
    queryFn: () => apiClient.get(`/missions/${id}`),
    enabled: !!id,
    ...options,
  })
}

// Users Hooks
export function useUsers(filters?: Record<string, any>) {
  const queryString = filters ? buildQueryString(filters) : ''
  
  return useQuery({
    queryKey: queryKeys.users.list(filters || {}),
    queryFn: () => apiClient.get<PaginatedResponse<any>>(`/users${queryString}`),
    staleTime: 3 * 60 * 1000, // 3 minutes
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => apiClient.get(`/users/${id}`),
    enabled: !!id,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiClient.put(`/users/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
  })
}

// Reports Hooks
export function useReports(filters?: Record<string, any>) {
  const queryString = filters ? buildQueryString(filters) : ''
  
  return useQuery({
    queryKey: queryKeys.reports.list(filters || {}),
    queryFn: () => apiClient.get<PaginatedResponse<any>>(`/reports${queryString}`),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useReportStatistics() {
  return useQuery({
    queryKey: queryKeys.reports.statistics,
    queryFn: () => apiClient.get('/reports/statistics'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: any) => apiClient.post('/reports', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.statistics })
    },
  })
}

export function useUpdateReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiClient.put(`/reports/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.statistics })
    },
  })
}

export function useDeleteReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/reports/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.statistics })
    },
  })
}

export function useVetReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, comments }: { id: number; comments: string }) =>
      apiClient.post(`/reports/${id}/vet`, { comments }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.statistics })
    },
  })
}

export function useApproveReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, comments }: { id: number; comments: string }) =>
      apiClient.post(`/reports/${id}/approve`, { comments }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.statistics })
    },
  })
}

export function useRejectReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, comments }: { id: number; comments: string }) =>
      apiClient.post(`/reports/${id}/reject`, { comments }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.statistics })
    },
  })
}

// Documents Hooks
export function useDocuments(filters?: Record<string, any>) {
  const queryString = filters ? buildQueryString(filters) : ''
  
  return useQuery({
    queryKey: queryKeys.documents.list(filters || {}),
    queryFn: () => apiClient.get<PaginatedResponse<any>>(`/documents${queryString}`),
    staleTime: 3 * 60 * 1000,
  })
}

export function useDocumentStatistics() {
  return useQuery({
    queryKey: queryKeys.documents.statistics,
    queryFn: () => apiClient.get('/documents/statistics'),
    staleTime: 5 * 60 * 1000,
  })
}

// Notifications Hooks
export function useNotifications(filters?: Record<string, any>) {
  const queryString = filters ? buildQueryString(filters) : ''
  
  return useQuery({
    queryKey: queryKeys.notifications.list(filters || {}),
    queryFn: () => apiClient.get<PaginatedResponse<any>>(`/notifications${queryString}`),
    staleTime: 1 * 60 * 1000, // 1 minute for notifications
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: () => apiClient.get<{ count: number }>('/notifications/unread-count'),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => apiClient.post(`/notifications/${id}/mark-read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount })
    },
  })
}

// Events Hooks
export function useEvents(filters?: Record<string, any>) {
  const queryString = filters ? buildQueryString(filters) : ''
  
  return useQuery({
    queryKey: queryKeys.events.list(filters || {}),
    queryFn: () => apiClient.get<PaginatedResponse<any>>(`/events${queryString}`),
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: queryKeys.events.upcoming,
    queryFn: () => apiClient.get('/events/upcoming'),
    staleTime: 2 * 60 * 1000,
  })
}

export function useEventStatistics() {
  return useQuery({
    queryKey: queryKeys.events.statistics,
    queryFn: () => apiClient.get('/events/statistics'),
    staleTime: 5 * 60 * 1000,
  })
}
