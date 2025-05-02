import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  username: string
  email?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

// Mock user database for demo purposes
const MOCK_USERS = [
  { id: "1", username: "admin", password: "password", email: "admin@example.com" },
  { id: "2", username: "user", password: "password", email: "user@example.com" },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Find user in mock database
        const user = MOCK_USERS.find((u) => u.username === username && u.password === password)

        if (user) {
          const { password: _, ...userWithoutPassword } = user
          set({ user: userWithoutPassword, isAuthenticated: true })
          return true
        }

        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage
    },
  ),
)
