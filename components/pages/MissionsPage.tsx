"use client"

import { useState, useEffect, useMemo } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { MapPin, Users, Building2, Mail, Phone, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { getApiUrl } from "@/lib/api-config"
import LoadingSpinner from "@/components/LoadingSpinner"

interface Mission {
  id: number
  name: string
  code: string
  description: string | null
  city: string
  country: string
  region: string
  address: string | null
  contact_email: string | null
  contact_phone: string | null
  status: string
  staff_count: number
  created_at: string
  updated_at: string
}

interface PaginationData {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

interface MissionsResponse {
  data: Mission[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

// Continent color mapping
const continentColors = {
  "Africa": {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    badge: "bg-green-100",
    icon: "text-green-600"
  },
  "Europe": {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100",
    icon: "text-blue-600"
  },
  "Asia": {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    badge: "bg-orange-100",
    icon: "text-orange-600"
  },
  "North America": {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    badge: "bg-amber-100",
    icon: "text-amber-700"
  },
  "South America": {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    badge: "bg-orange-100",
    icon: "text-orange-600"
  },
  "Oceania": {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100",
    icon: "text-red-600"
  },
  "Middle East": {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    badge: "bg-purple-100",
    icon: "text-purple-600"
  }
}

// Map regions to continents
const regionToContinentMap: { [key: string]: keyof typeof continentColors } = {
  "West Africa": "Africa",
  "East Africa": "Africa",
  "Southern Africa": "Africa",
  "North Africa": "Africa",
  "Central Africa": "Africa",
  "Europe": "Europe",
  "Asia": "Asia",
  "North America": "North America",
  "South America": "South America",
  "Oceania": "Oceania",
  "Middle East": "Middle East"
}

export default function MissionsPage() {
  const [allMissions, setAllMissions] = useState<Mission[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContinent, setSelectedContinent] = useState<string>("All")
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    from: 0,
    to: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchAllMissions()
  }, [])

  const fetchAllMissions = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        setError("Authentication required. Please log in.")
        setLoading(false)
        return
      }

      // Fetch all missions (we'll handle pagination client-side for filtering)
      const response = await fetch(getApiUrl(`/missions?per_page=100`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.")
        } else {
          setError("Failed to fetch missions. Please try again.")
        }
        setLoading(false)
        return
      }

      const data: MissionsResponse = await response.json()
      setAllMissions(data.data)
    } catch (err) {
      console.error("Error fetching missions:", err)
      setError("An error occurred while fetching missions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Get continent from region
  const getContinent = (region: string): keyof typeof continentColors => {
    return regionToContinentMap[region] || "Africa"
  }

  // Filter and search missions
  const filteredMissions = useMemo(() => {
    let filtered = allMissions

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(mission => 
        mission.name.toLowerCase().includes(query) ||
        mission.city.toLowerCase().includes(query) ||
        mission.country.toLowerCase().includes(query) ||
        mission.region.toLowerCase().includes(query) ||
        mission.code.toLowerCase().includes(query)
      )
    }

    // Filter by continent
    if (selectedContinent !== "All") {
      filtered = filtered.filter(mission => 
        getContinent(mission.region) === selectedContinent
      )
    }

    return filtered
  }, [allMissions, searchQuery, selectedContinent])

  // Group missions by continent
  const missionsByContinent = useMemo(() => {
    const grouped: { [key: string]: Mission[] } = {}
    
    filteredMissions.forEach(mission => {
      const continent = getContinent(mission.region)
      if (!grouped[continent]) {
        grouped[continent] = []
      }
      grouped[continent].push(mission)
    })

    // Sort continents
    const sortedContinents = Object.keys(grouped).sort()
    const result: { [key: string]: Mission[] } = {}
    sortedContinents.forEach(continent => {
      result[continent] = grouped[continent].sort((a, b) => a.country.localeCompare(b.country))
    })

    return result
  }, [filteredMissions])

  // Get unique continents for filter
  const availableContinents = useMemo(() => {
    const continents = new Set(allMissions.map(m => getContinent(m.region)))
    return ["All", ...Array.from(continents).sort()]
  }, [allMissions])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Diplomatic Missions</h1>
          <p className="text-gray-600">
            Explore all diplomatic missions managed by REDAS
            {filteredMissions.length > 0 && (
              <span className="ml-2 text-[#1b7b3c] font-medium">
                ({filteredMissions.length} {filteredMissions.length === 1 ? "mission" : "missions"})
              </span>
            )}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, city, country, region, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b7b3c] focus:border-transparent outline-none"
            />
          </div>

          {/* Continent Filter */}
          <div className="flex flex-wrap gap-2">
            {availableContinents.map((continent) => (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`px-4 py-2 rounded-lg border transition ${
                  selectedContinent === continent
                    ? "bg-[#1b7b3c] text-white border-[#1b7b3c]"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {continent}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchAllMissions()}
              className="px-6 py-2 bg-[#1b7b3c] text-white rounded-lg hover:bg-[#155730] transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredMissions.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <Building2 className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg">No missions found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchQuery || selectedContinent !== "All" 
                ? "Try adjusting your search or filter criteria."
                : "Missions will appear here once they are added to the system."}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(missionsByContinent).map(([continent, missions]) => {
              const colors = continentColors[continent as keyof typeof continentColors] || continentColors["Africa"]
              
              return (
                <div key={continent}>
                  {/* Continent Header */}
                  <div className={`${colors.bg} ${colors.border} border-l-4 rounded-lg p-4 mb-6`}>
                    <h2 className={`text-2xl font-bold ${colors.text}`}>
                      {continent}
                      <span className="ml-3 text-sm font-normal">
                        ({missions.length} {missions.length === 1 ? "mission" : "missions"})
                      </span>
                    </h2>
                  </div>

                  {/* Missions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {missions.map((mission) => (
                      <div
                        key={mission.id}
                        className={`${colors.bg} rounded-lg border ${colors.border} hover:shadow-lg transition p-6`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 ${colors.badge} rounded-lg flex items-center justify-center`}>
                            <Building2 className={colors.icon} size={24} />
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              mission.status === "active"
                                ? "bg-green-100 text-green-700"
                                : mission.status === "inactive"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {mission.status}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg mb-1 text-gray-900">{mission.name}</h3>
                        <p className="text-xs text-gray-500 mb-4">{mission.code}</p>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={16} className={`${colors.icon} flex-shrink-0`} />
                            <span className="truncate">
                              {mission.city}, {mission.country}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Users size={16} className={`${colors.icon} flex-shrink-0`} />
                            <span>{mission.staff_count} staff members</span>
                          </div>

                          {mission.contact_email && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail size={16} className={`${colors.icon} flex-shrink-0`} />
                              <span className="truncate text-xs">{mission.contact_email}</span>
                            </div>
                          )}

                          {mission.contact_phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone size={16} className={`${colors.icon} flex-shrink-0`} />
                              <span className="text-xs">{mission.contact_phone}</span>
                            </div>
                          )}

                          <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
                            Region: {mission.region}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
