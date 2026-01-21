import { lazy } from 'react'

// Lazy load heavy page components
export const LazyMissionsPage = lazy(() => import('@/components/pages/MissionsPage'))
export const LazyUserManagementPage = lazy(() => import('@/components/pages/UserManagementPage'))
export const LazyReportingPage = lazy(() => import('@/components/pages/ReportingPage'))
export const LazyDocumentsReviewPage = lazy(() => import('@/components/pages/DocumentsReviewPage'))
export const LazyMessagingPage = lazy(() => import('@/components/pages/MessagingPage'))
export const LazyCalendarPage = lazy(() => import('@/components/pages/CalendarPage'))
export const LazyArchivingPage = lazy(() => import('@/components/pages/ArchivingPage'))

// Lazy load dashboard pages
export const LazyUserDashboard = lazy(() => import('@/components/pages/dashboards/UserDashboard'))
export const LazySupervisorDashboard = lazy(() => import('@/components/pages/dashboards/SupervisorDashboard'))
export const LazyAdminDashboard = lazy(() => import('@/components/pages/dashboards/AdminDashboard'))
export const LazySuperAdminDashboard = lazy(() => import('@/components/pages/dashboards/SuperAdminDashboard'))
