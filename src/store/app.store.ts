import { create } from "zustand"
import { persist } from "zustand/middleware"

type ApiStatus = "online" | "offline" | "checking" | "unknown"

interface AppState {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  apiStatus: ApiStatus
  setApiStatus: (status: ApiStatus) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      error: null,
      setError: (error) => set({ error }),
      apiStatus: "unknown",
      setApiStatus: (apiStatus) => set({ apiStatus }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({ apiStatus: state.apiStatus }),
    },
  ),
)
