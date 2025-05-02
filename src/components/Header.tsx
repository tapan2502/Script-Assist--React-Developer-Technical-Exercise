"use client"

import type { FC } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  Header as MantineHeader,
  Group,
  Button,
  Container,
  Avatar,
  Menu,
  Text,
  Box,
  useMantineTheme,
  Burger,
  Drawer,
  Stack,
  createStyles,
  rem,
} from "@mantine/core"
import { useAuthStore } from "../store/auth.store"
import { LogOut, User, Home, Users } from "lucide-react"
import { useDisclosure } from "@mantine/hooks"

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottom: `1px solid ${theme.colors.gray[2]}`,
    zIndex: 100,
    transition: "all 0.3s ease",
  },

  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "inherit",
  },

  logoIcon: {
    background: `linear-gradient(135deg, ${theme.colors.primary[6]} 0%, ${theme.colors.secondary[6]} 100%)`,
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: theme.shadows.sm,
  },

  logoText: {
    fontSize: rem(22),
    fontWeight: 800,
    background: `linear-gradient(135deg, ${theme.colors.primary[6]} 0%, ${theme.colors.secondary[6]} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginLeft: theme.spacing.xs,
  },

  navItem: {
    borderRadius: theme.radius.md,
    padding: `${rem(8)} ${rem(12)}`,
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,
    transition: "all 0.2s ease",
    color: theme.colors.gray[7],
    textDecoration: "none",

    "&:hover": {
      backgroundColor: theme.fn.rgba(theme.colors.primary[0], 0.5),
    },
  },

  navItemActive: {
    backgroundColor: theme.fn.rgba(theme.colors.primary[0], 0.7),
    color: theme.colors.primary[7],
  },

  avatar: {
    border: `2px solid ${theme.colors.primary[5]}`,
    transition: "transform 0.2s ease",
    cursor: "pointer",

    "&:hover": {
      transform: "scale(1.05)",
    },
  },

  mobileMenu: {
    padding: theme.spacing.xl,
  },

  mobileNavItem: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    fontWeight: 600,
    textDecoration: "none",
    color: theme.colors.gray[7],
    display: "block",

    "&:hover": {
      backgroundColor: theme.fn.rgba(theme.colors.primary[0], 0.5),
    },
  },

  mobileNavItemActive: {
    backgroundColor: theme.fn.rgba(theme.colors.primary[0], 0.7),
    color: theme.colors.primary[7],
  },
}))

const Header: FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useMantineTheme()
  const { classes, cx } = useStyles()
  const [mobileMenuOpened, { toggle: toggleMobileMenu, close: closeMobileMenu }] = useDisclosure(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
    closeMobileMenu()
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <MantineHeader height={70} className={classes.header}>
      <Container size="xl" className={classes.container}>
        <Link to="/" className={classes.logo}>
          <Box className={classes.logoIcon}>
            <Text fw={700} fz="xl" c="white">
              R
            </Text>
          </Box>
          <Box sx={{ display: { base: "none", sm: "block" } }}>
            <Text className={classes.logoText}>Rick and Morty Explorer</Text>
          </Box>
        </Link>

        {/* Desktop Navigation */}
        <Group spacing="md" sx={{ display: { base: "none", md: "flex" } }}>
          {isAuthenticated ? (
            <>
              <Link to="/" className={cx(classes.navItem, isActive("/") && classes.navItemActive)}>
                <Group spacing="xs">
                  <Home size={16} />
                  <Text>Home</Text>
                </Group>
              </Link>

              <Link to="/characters" className={cx(classes.navItem, isActive("/characters") && classes.navItemActive)}>
                <Group spacing="xs">
                  <Users size={16} />
                  <Text>Characters</Text>
                </Group>
              </Link>

              <Menu position="bottom-end" shadow="md" width={200} transition="pop">
                <Menu.Target>
                  <Avatar color="primary" radius="xl" className={classes.avatar}>
                    {user?.username.charAt(0).toUpperCase()}
                  </Avatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item icon={<User size={14} />}>
                    <Text size="sm" fw={500}>
                      {user?.username}
                    </Text>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" icon={<LogOut size={14} />} onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          ) : (
            <>
              <Button variant="subtle" component={Link} to="/login">
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="gradient"
                gradient={{ from: theme.colors.primary[6], to: theme.colors.secondary[6], deg: 45 }}
              >
                Register
              </Button>
            </>
          )}
        </Group>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { md: "none" } }}>
          <Burger opened={mobileMenuOpened} onClick={toggleMobileMenu} size="sm" />
        </Box>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={mobileMenuOpened}
        onClose={closeMobileMenu}
        padding="xl"
        size="xs"
        position="right"
        title={
          <Group>
            <Box className={classes.logoIcon}>
              <Text fw={700} fz="xl" c="white">
                R
              </Text>
            </Box>
            <Text className={classes.logoText}>Menu</Text>
          </Group>
        }
      >
        <Stack spacing="md" className={classes.mobileMenu}>
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={cx(classes.mobileNavItem, isActive("/") && classes.mobileNavItemActive)}
              >
                <Group>
                  <Home size={18} />
                  <Text>Home</Text>
                </Group>
              </Link>

              <Link
                to="/characters"
                onClick={closeMobileMenu}
                className={cx(classes.mobileNavItem, isActive("/characters") && classes.mobileNavItemActive)}
              >
                <Group>
                  <Users size={18} />
                  <Text>Characters</Text>
                </Group>
              </Link>

              <Button color="red" leftIcon={<LogOut size={18} />} onClick={handleLogout} variant="light">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button fullWidth variant="subtle" component={Link} to="/login" onClick={closeMobileMenu}>
                Login
              </Button>
              <Button
                fullWidth
                component={Link}
                to="/register"
                onClick={closeMobileMenu}
                variant="gradient"
                gradient={{ from: theme.colors.primary[6], to: theme.colors.secondary[6], deg: 45 }}
              >
                Register
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </MantineHeader>
  )
}

export default Header
