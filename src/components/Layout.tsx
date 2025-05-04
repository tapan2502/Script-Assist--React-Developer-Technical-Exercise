import type { FC, ReactNode } from "react"
import { Box } from "@mantine/core"
import Header from "./Header"

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, rgba(244,247,252,1) 0%, rgba(255,255,255,1) 100%)",
      })}
    >
      <Header />
      <Box
        component="main"
        sx={(theme) => ({
          flex: 1,
          position: "relative",
        })}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Layout
