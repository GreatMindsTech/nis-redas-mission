import { getApiUrl } from './api-config'

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

/**
 * Enhanced API client with automatic token handling and error management
 */
export const apiClient = {
  async get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  },

  async post<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  async put<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  },

  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  },

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const url = getApiUrl(path)
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      const isJson = contentType?.includes('application/json')

      if (!response.ok) {
        if (isJson) {
          const errorData = await response.json()
          throw new ApiClientError(
            errorData.message || 'An error occurred',
            response.status,
            errorData.errors
          )
        } else {
          throw new ApiClientError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status
          )
        }
      }

      // Return empty object for 204 No Content
      if (response.status === 204) {
        return {} as T
      }

      if (isJson) {
        return await response.json()
      }

      // For non-JSON responses, return the text
      const text = await response.text()
      return text as unknown as T
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error
      }
      
      // Network or other errors
      throw new ApiClientError(
        error instanceof Error ? error.message : 'Network error occurred'
      )
    }
  },
}

/**
 * Helper to get authorization headers
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/**
 * Helper to build query string from params
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}
