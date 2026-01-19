"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Edit2, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"
import { toast } from "sonner"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, addDays, parseISO } from "date-fns"

interface Event {
  id: number
  user_id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  all_day: boolean
  category: "meeting" | "deadline" | "mission" | "personal" | "other"
  location?: string
  color: string
  is_recurring: boolean
  recurrence_pattern?: string
  attendees?: string[]
  reminder_enabled: boolean
  reminder_minutes_before?: number
}

const categoryColors = {
  meeting: "#3b82f6",
  deadline: "#ef4444",
  mission: "#1b7b3c",
  personal: "#8b5cf6",
  other: "#6b7280",
}

export default function CalendarPage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    all_day: false,
    category: "other" as Event["category"],
    location: "",
    color: "#1b7b3c",
    reminder_enabled: false,
    reminder_minutes_before: 15,
  })

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // Fetch events
  const fetchEvents = async () => {
    try {
      const startDate = format(startOfMonth(currentDate), "yyyy-MM-dd")
      const endDate = format(endOfMonth(currentDate), "yyyy-MM-dd")

      const response = await fetch(`${apiUrl}/events?start_date=${startDate}&end_date=${endDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  // Create or update event
  const saveEvent = async () => {
    if (!formData.title || !formData.start_date || !formData.end_date) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const url = editingEvent ? `${apiUrl}/events/${editingEvent.id}` : `${apiUrl}/events`
      const method = editingEvent ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingEvent ? "Event updated" : "Event created")
        setIsEventModalOpen(false)
        resetForm()
        fetchEvents()
      } else {
        toast.error("Failed to save event")
      }
    } catch (error) {
      console.error("Error saving event:", error)
      toast.error("Error saving event")
    } finally {
      setLoading(false)
    }
  }

  // Delete event
  const deleteEvent = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`${apiUrl}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        toast.success("Event deleted")
        fetchEvents()
      } else {
        toast.error("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("Error deleting event")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      all_day: false,
      category: "other",
      location: "",
      color: "#1b7b3c",
      reminder_enabled: false,
      reminder_minutes_before: 15,
    })
    setEditingEvent(null)
  }

  const openEditModal = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || "",
      start_date: format(parseISO(event.start_date), "yyyy-MM-dd'T'HH:mm"),
      end_date: format(parseISO(event.end_date), "yyyy-MM-dd'T'HH:mm"),
      all_day: event.all_day,
      category: event.category,
      location: event.location || "",
      color: event.color,
      reminder_enabled: event.reminder_enabled,
      reminder_minutes_before: event.reminder_minutes_before || 15,
    })
    setIsEventModalOpen(true)
  }

  const openNewEventModal = (date?: Date) => {
    resetForm()
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd")
      setFormData((prev) => ({
        ...prev,
        start_date: `${dateStr}T09:00`,
        end_date: `${dateStr}T10:00`,
      }))
    }
    setIsEventModalOpen(true)
  }

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventStart = parseISO(event.start_date)
      const eventEnd = parseISO(event.end_date)
      return isSameDay(date, eventStart) || isSameDay(date, eventEnd) || (date >= eventStart && date <= eventEnd)
    })
  }

  // Render month view
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-semibold">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={day.toString()}
              className={`min-h-[120px] bg-white p-2 ${!isCurrentMonth ? "text-gray-400" : ""} ${
                isToday ? "bg-blue-50" : ""
              } cursor-pointer hover:bg-gray-50`}
              onClick={() => openNewEventModal(day)}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : ""}`}>{format(day, "d")}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: event.color + "20", borderLeft: `3px solid ${event.color}` }}
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditModal(event)
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 pl-1">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Render week view
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayEvents = getEventsForDate(day)
          const isToday = isSameDay(day, new Date())

          return (
            <div key={day.toString()} className={`border rounded-lg p-3 ${isToday ? "bg-blue-50 border-blue-300" : ""}`}>
              <div className="text-center mb-3">
                <div className="text-xs text-gray-500">{format(day, "EEE")}</div>
                <div className={`text-lg font-semibold ${isToday ? "text-blue-600" : ""}`}>{format(day, "d")}</div>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-2 rounded cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: event.color + "20", borderLeft: `3px solid ${event.color}` }}
                      onClick={() => openEditModal(event)}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-gray-600 mt-1">{format(parseISO(event.start_date), "HH:mm")}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )
        })}
      </div>
    )
  }

  // Render day view
  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate).sort(
      (a, b) => parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime()
    )

    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-bold mb-4">{format(currentDate, "EEEE, MMMM d, yyyy")}</h3>
        <ScrollArea className="h-[600px]">
          {dayEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No events scheduled for this day</p>
              <Button onClick={() => openNewEventModal(currentDate)} className="mt-4 bg-[#1b7b3c] hover:bg-[#155730]">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  style={{ borderLeft: `4px solid ${event.color}` }}
                  onClick={() => openEditModal(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{event.title}</h4>
                      {event.description && <p className="text-sm text-gray-600 mt-1">{event.description}</p>}
                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.all_day
                            ? "All day"
                            : `${format(parseISO(event.start_date), "HH:mm")} - ${format(parseISO(event.end_date), "HH:mm")}`}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <Badge variant="secondary" className="capitalize">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteEvent(event.id)
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Calendar</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="text-lg font-semibold ml-2">{format(currentDate, "MMMM yyyy")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={view === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("month")}
                className={view === "month" ? "bg-[#1b7b3c] hover:bg-[#155730]" : ""}
              >
                Month
              </Button>
              <Button
                variant={view === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("week")}
                className={view === "week" ? "bg-[#1b7b3c] hover:bg-[#155730]" : ""}
              >
                Week
              </Button>
              <Button
                variant={view === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("day")}
                className={view === "day" ? "bg-[#1b7b3c] hover:bg-[#155730]" : ""}
              >
                Day
              </Button>
            </div>

            <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openNewEventModal()} className="bg-[#1b7b3c] hover:bg-[#155730]">
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Event title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Event description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date">Start Date & Time *</Label>
                      <Input
                        id="start_date"
                        type="datetime-local"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_date">End Date & Time *</Label>
                      <Input
                        id="end_date"
                        type="datetime-local"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="all_day"
                      checked={formData.all_day}
                      onCheckedChange={(checked) => setFormData({ ...formData, all_day: checked })}
                    />
                    <Label htmlFor="all_day">All day event</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                          <SelectItem value="mission">Mission</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Event location"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="reminder"
                        checked={formData.reminder_enabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, reminder_enabled: checked })}
                      />
                      <Label htmlFor="reminder">Enable reminder</Label>
                    </div>
                    {formData.reminder_enabled && (
                      <div>
                        <Label htmlFor="reminder_minutes">Minutes before</Label>
                        <Input
                          id="reminder_minutes"
                          type="number"
                          min="0"
                          value={formData.reminder_minutes_before}
                          onChange={(e) => setFormData({ ...formData, reminder_minutes_before: parseInt(e.target.value) })}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEventModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveEvent} disabled={loading} className="bg-[#1b7b3c] hover:bg-[#155730]">
                    {loading ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Calendar Views */}
        <div className="bg-white rounded-lg shadow">
          {view === "month" && renderMonthView()}
          {view === "week" && <div className="p-4">{renderWeekView()}</div>}
          {view === "day" && <div className="p-4">{renderDayView()}</div>}
        </div>
      </div>
    </div>
  )
}
