"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/components/contexts/AuthContext"
import { getApiUrl } from "@/lib/api-config"
import { FileText, Download, CheckCircle, XCircle, Clock, Search, Filter, User, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface Document {
  id: number
  title: string
  description: string | null
  document_type: string
  file_name: string
  file_size: number
  file_size_formatted: string
  status: "pending" | "approved" | "rejected"
  review_comments: string | null
  reviewed_at: string | null
  created_at: string
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  reviewer?: {
    first_name: string
    last_name: string
  }
}

interface Statistics {
  total: number
  pending: number
  approved: number
  rejected: number
  by_type: {
    passport: number
    visa: number
    other: number
  }
}

export default function DocumentsReviewPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [documents, setDocuments] = useState<Document[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("pending")
  const [filterType, setFilterType] = useState<string>("all")

  // Review modal state
  const [reviewingDoc, setReviewingDoc] = useState<Document | null>(null)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null)
  const [reviewComments, setReviewComments] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Check if user is admin
  useEffect(() => {
    if (user && !["admin", "super_admin"].includes(user.role)) {
      router.push("/")
    }
  }, [user, router])

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(getApiUrl("/documents/statistics"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStatistics(data)
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    }
  }

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token")
      let url = getApiUrl("/documents")

      const params = new URLSearchParams()
      if (filterStatus !== "all") params.append("status", filterStatus)
      if (filterType !== "all") params.append("document_type", filterType)
      if (searchTerm) params.append("search", searchTerm)

      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDocuments(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
    fetchDocuments()
  }, [filterStatus, filterType, searchTerm])

  // Handle download
  const handleDownload = async (documentId: number, fileName: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        getApiUrl(`/documents/${documentId}/download`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error downloading document:", error)
    }
  }

  // Open review modal
  const openReviewModal = (doc: Document, action: "approve" | "reject") => {
    setReviewingDoc(doc)
    setReviewAction(action)
    setReviewComments("")
  }

  // Close review modal
  const closeReviewModal = () => {
    setReviewingDoc(null)
    setReviewAction(null)
    setReviewComments("")
  }

  // Submit review
  const submitReview = async () => {
    if (!reviewingDoc || !reviewAction) return

    if (reviewAction === "reject" && !reviewComments.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    setSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        getApiUrl(`/documents/${reviewingDoc.id}/${reviewAction}`),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comments: reviewComments,
          }),
        }
      )

      if (response.ok) {
        closeReviewModal()
        fetchDocuments()
        fetchStatistics()
      } else {
        const data = await response.json()
        alert(data.message || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("An error occurred while submitting review")
    } finally {
      setSubmitting(false)
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle size={14} />
            Approved
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <XCircle size={14} />
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <Clock size={14} />
            Pending Review
          </span>
        )
    }
  }

  if (!user || !["admin", "super_admin"].includes(user.role)) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Review</h1>
          <p className="text-gray-600 mt-1">Review and manage user-submitted documents</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documents</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{statistics.total}</p>
                </div>
                <FileText className="text-gray-400" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{statistics.pending}</p>
                </div>
                <Clock className="text-yellow-400" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{statistics.approved}</p>
                </div>
                <CheckCircle className="text-green-400" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{statistics.rejected}</p>
                </div>
                <XCircle className="text-red-400" size={40} />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search size={16} className="inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b7b3c] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b7b3c] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b7b3c] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="passport">Passport</option>
                <option value="visa">Visa</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b7b3c]"></div>
            <p className="text-gray-600 mt-4">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600">No documents match your current filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="text-red-600" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{doc.title}</h3>
                        {getStatusBadge(doc.status)}
                      </div>
                      {doc.description && <p className="text-gray-600 text-sm mb-2">{doc.description}</p>}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <span className="capitalize">{doc.document_type}</span>
                        <span>•</span>
                        <span>{doc.file_size_formatted}</span>
                        <span>•</span>
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User size={16} />
                          <span>
                            {doc.user.first_name} {doc.user.last_name}
                          </span>
                          <span className="text-gray-400">({doc.user.email})</span>
                        </div>
                      </div>
                      {doc.review_comments && (
                        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Review Comments:</strong> {doc.review_comments}
                          </p>
                          {doc.reviewer && doc.reviewed_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              Reviewed by {doc.reviewer.first_name} {doc.reviewer.last_name} on{" "}
                              {new Date(doc.reviewed_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleDownload(doc.id, doc.file_name)}
                      className="p-2 text-[#1b7b3c] hover:bg-green-50 rounded-lg transition"
                      title="Download"
                    >
                      <Download size={20} />
                    </button>
                    {doc.status === "pending" && (
                      <>
                        <button
                          onClick={() => openReviewModal(doc, "approve")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openReviewModal(doc, "reject")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewingDoc && reviewAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {reviewAction === "approve" ? "Approve Document" : "Reject Document"}
            </h2>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Document:</strong> {reviewingDoc.title}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Submitted by:</strong> {reviewingDoc.user.first_name} {reviewingDoc.user.last_name}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments {reviewAction === "reject" && <span className="text-red-600">*</span>}
              </label>
              <textarea
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b7b3c] focus:border-transparent"
                rows={4}
                placeholder={
                  reviewAction === "approve"
                    ? "Optional: Add any comments for the user..."
                    : "Required: Explain why this document is being rejected..."
                }
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={submitReview}
                disabled={submitting}
                className={`flex-1 px-6 py-3 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  reviewAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {submitting ? "Submitting..." : reviewAction === "approve" ? "Approve" : "Reject"}
              </button>
              <button
                onClick={closeReviewModal}
                disabled={submitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
