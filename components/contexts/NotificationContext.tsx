"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "./AuthContext"
import { getApiUrl } from "@/lib/api-config"

export interface Notification {
  id: number
  user_id: number
  type: "system" | "message" | "report" | "document" | "mission"
  title: string
  message: string
  data?: any
  action_url?: string
  is_read: boolean
  read_at?: string
  created_at: string
  updated_at: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  fetchNotifications: () => Promise<void>
  fetchUnreadCount: () => Promise<void>
  markAsRead: (notificationId: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: number) => Promise<void>
  deleteAllRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await fetch(getApiUrl("/notifications"), {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch notifications")

      const data = await response.json()
      setNotifications(data.data || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(getApiUrl("/notifications/unread-count"), {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch unread count")

      const data = await response.json()
      setUnreadCount(data.count || 0)
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }, [user])

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(getApiUrl(`/notifications/${notificationId}/mark-read`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to mark notification as read")

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true, read_at: new Date().toISOString() } : notif
        )
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(getApiUrl("/notifications/mark-all-read"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to mark all notifications as read")

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true, read_at: new Date().toISOString() }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const deleteNotification = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(getApiUrl(`/notifications/${notificationId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to delete notification")

      // Update local state
      const deletedNotif = notifications.find((n) => n.id === notificationId)
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const deleteAllRead = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(getApiUrl("/notifications/read/all"), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to delete read notifications")

      // Update local state
      setNotifications((prev) => prev.filter((notif) => !notif.is_read))
    } catch (error) {
      console.error("Error deleting read notifications:", error)
    }
  }

  // Fetch notifications and unread count when user logs in
  useEffect(() => {
    if (user) {
      fetchNotifications()
      fetchUnreadCount()
    } else {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [user, fetchNotifications, fetchUnreadCount])

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [user, fetchUnreadCount])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}
