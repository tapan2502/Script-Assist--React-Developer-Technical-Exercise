import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "./App"
import Landing from "./pages/landing/Landing"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import CharacterList from "./pages/characters/CharacterList"
import CharacterDetail from "./pages/characters/CharacterDetail"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import ErrorBoundary from "./components/ErrorBoundary"

export const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Layout>
            <Landing />
          </Layout>
        ),
      },
      {
        path: "/login",
        element: (
          <Layout>
            <Login />
          </Layout>
        ),
      },
      {
        path: "/register",
        element: (
          <Layout>
            <Register />
          </Layout>
        ),
      },
      {
        path: "/characters",
        element: (
          <ProtectedRoute>
            <Layout>
              <ErrorBoundary>
                <CharacterList />
              </ErrorBoundary>
            </Layout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/characters/:id",
        element: (
          <ProtectedRoute>
            <Layout>
              <ErrorBoundary>
                <CharacterDetail />
              </ErrorBoundary>
            </Layout>
          </ProtectedRoute>
        ),
      },
    ],
  },
]

const router = createBrowserRouter(routes)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 1000 * 60 * 15,
    },
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
