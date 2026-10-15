import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const getBaseApiUrl = () => {
  const envUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001').trim()
  return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`
}
export const API_BASE_URL = getBaseApiUrl()

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  role: string
  accounts?: { provider: string }[]
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean

  // Actions
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void
  logout: () => Promise<void>
  refreshAccessToken: () => Promise<boolean>
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken })
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      },

      logout: async () => {
        const { refreshToken, accessToken } = get()
        try {
          if (accessToken) {
            await axios.post(
              `${API_BASE_URL}/auth/logout`,
              { refreshToken },
              { headers: { Authorization: `Bearer ${accessToken}` } },
            )
          }
        } catch {}
        set({ user: null, accessToken: null, refreshToken: null })
        delete axios.defaults.headers.common['Authorization']
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) return false
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
          const { accessToken, refreshToken: newRefreshToken, user } = res.data
          set({ accessToken, refreshToken: newRefreshToken, user })
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          return true
        } catch {
          set({ user: null, accessToken: null, refreshToken: null })
          return false
        }
      },

      fetchMe: async () => {
        const { accessToken } = get()
        if (!accessToken) return
        try {
          const res = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          set({ user: res.data })
        } catch (err: any) {
          if (err?.response?.status === 401) {
            const refreshed = await get().refreshAccessToken()
            if (refreshed) {
              const res = await axios.get(`${API_BASE_URL}/auth/me`)
              set({ user: res.data })
            }
          }
        }
      },
    }),
    {
      name: 'profile-plus-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)

// Setup axios interceptor for token refresh
let isRefreshing = false
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// Automatically inject Authorization header if token exists
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return axios(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const store = useAuthStore.getState()
      const success = await store.refreshAccessToken()

      isRefreshing = false
      if (success) {
        const newToken = useAuthStore.getState().accessToken
        processQueue(null, newToken)
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        return axios(originalRequest)
      } else {
        processQueue(error, null)
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)
