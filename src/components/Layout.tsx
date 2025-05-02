import type { FC, ReactNode } from "react"
import Header from "./Header"
import { Box } from "@mantine/core"

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ flex: 1, padding: "0 16px" }}>
        {children}
      </Box>
    </Box>
  )
}

export default Layout
