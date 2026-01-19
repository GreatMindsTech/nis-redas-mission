"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Search, Send, Paperclip, MoreVertical, X, Edit2, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role?: string
}

interface Message {
  id: number
  conversation_id: number
  user_id: string
  content: string
  attachment_path?: string
  attachment_name?: string
  attachment_url?: string
  is_edited: boolean
  created_at: string
  user: User
}

interface Conversation {
  id: number
  title?: string
  type: string
  other_user?: User
  latest_message?: Message
  unread_count: number
  updated_at: string
}

export default function MessagingPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageContent, setMessageContent] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch(`${apiUrl}/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    }
  }

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await fetch(`${apiUrl}/conversations/${conversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!messageContent.trim() || !selectedConversation) return

    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/conversations/${selectedConversation.id}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ content: messageContent }),
      })

      if (response.ok) {
        const result = await response.json()
        setMessages([...messages, result.data])
        setMessageContent("")
        fetchConversations() // Refresh to update latest message
      } else {
        toast.error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Error sending message")
    } finally {
      setLoading(false)
    }
  }

  // Update message
  const updateMessage = async () => {
    if (!editingMessage || !messageContent.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/messages/${editingMessage.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ content: messageContent }),
      })

      if (response.ok) {
        const result = await response.json()
        setMessages(messages.map((m) => (m.id === editingMessage.id ? result.data : m)))
        setMessageContent("")
        setEditingMessage(null)
        toast.success("Message updated")
      } else {
        toast.error("Failed to update message")
      }
    } catch (error) {
      console.error("Error updating message:", error)
      toast.error("Error updating message")
    } finally {
      setLoading(false)
    }
  }

  // Delete message
  const deleteMessage = async (messageId: number) => {
    try {
      const response = await fetch(`${apiUrl}/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setMessages(messages.filter((m) => m.id !== messageId))
        toast.success("Message deleted")
      } else {
        toast.error("Failed to delete message")
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error("Error deleting message")
    }
  }

  // Search users
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`${apiUrl}/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      }
    } catch (error) {
      console.error("Error searching users:", error)
    }
  }

  // Start conversation with user
  const startConversation = async (userId: string) => {
    try {
      const response = await fetch(`${apiUrl}/conversations/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        const conv = result.conversation
        setSelectedConversation({
          id: conv.id,
          title: conv.title,
          type: conv.type,
          other_user: conv.other_user,
          unread_count: 0,
          updated_at: conv.updated_at,
        })
        setMessages(conv.messages || [])
        setIsNewMessageOpen(false)
        setUserSearchQuery("")
        setSearchResults([])
        fetchConversations()
      }
    } catch (error) {
      console.error("Error starting conversation:", error)
      toast.error("Error starting conversation")
    }
  }

  // Select conversation
  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    fetchMessages(conversation.id)
  }

  useEffect(() => {
    fetchConversations()
    // Poll for new messages every 10 seconds
    const interval = setInterval(() => {
      if (selectedConversation) {
        fetchMessages(selectedConversation.id)
      }
      fetchConversations()
    }, 10000)

    return () => clearInterval(interval)
  }, [selectedConversation])

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = conv.other_user
    if (!otherUser) return false
    const fullName = `${otherUser.first_name} ${otherUser.last_name}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase()) || otherUser.email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#1b7b3c] hover:bg-[#155730]">
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Search users..."
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value)
                        searchUsers(e.target.value)
                      }}
                    />
                  </div>
                  <ScrollArea className="h-64">
                    {searchResults.map((searchUser) => (
                      <div
                        key={searchUser.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg"
                        onClick={() => startConversation(searchUser.id)}
                      >
                        <Avatar>
                          <AvatarFallback>{getInitials(searchUser.first_name, searchUser.last_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {searchUser.first_name} {searchUser.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{searchUser.email}</p>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? "bg-blue-50" : ""
              }`}
              onClick={() => selectConversation(conversation)}
            >
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>
                    {conversation.other_user
                      ? getInitials(conversation.other_user.first_name, conversation.other_user.last_name)
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">
                      {conversation.other_user
                        ? `${conversation.other_user.first_name} ${conversation.other_user.last_name}`
                        : "Unknown User"}
                    </p>
                    {conversation.unread_count > 0 && (
                      <span className="bg-[#1b7b3c] text-white text-xs rounded-full px-2 py-1">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.latest_message?.content || "No messages yet"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {conversation.updated_at && formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedConversation.other_user
                      ? getInitials(selectedConversation.other_user.first_name, selectedConversation.other_user.last_name)
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedConversation.other_user
                      ? `${selectedConversation.other_user.first_name} ${selectedConversation.other_user.last_name}`
                      : "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-500">{selectedConversation.other_user?.email}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.user_id === user?.id
                  return (
                    <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : "order-1"}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            isOwnMessage ? "bg-[#1b7b3c] text-white" : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="break-words">{message.content}</p>
                            {isOwnMessage && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-[#155730]">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingMessage(message)
                                      setMessageContent(message.content)
                                    }}
                                  >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => deleteMessage(message.id)} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          {message.attachment_url && (
                            <a
                              href={message.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 mt-2 text-sm underline"
                            >
                              <Paperclip className="h-4 w-4" />
                              {message.attachment_name}
                            </a>
                          )}
                          <p className={`text-xs mt-1 ${isOwnMessage ? "text-green-100" : "text-gray-500"}`}>
                            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                            {message.is_edited && " (edited)"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              {editingMessage && (
                <div className="flex items-center justify-between mb-2 p-2 bg-blue-50 rounded">
                  <span className="text-sm text-blue-600">Editing message</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingMessage(null)
                      setMessageContent("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Type a message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      if (editingMessage) {
                        updateMessage()
                      } else {
                        sendMessage()
                      }
                    }
                  }}
                  className="flex-1 min-h-[60px] max-h-[120px]"
                />
                <Button
                  onClick={editingMessage ? updateMessage : sendMessage}
                  disabled={!messageContent.trim() || loading}
                  className="bg-[#1b7b3c] hover:bg-[#155730]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No conversation selected</p>
              <p className="text-sm">Choose a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
