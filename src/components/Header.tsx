"use client"

import type { FC } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  Header as MantineHeader,
  Group,
  Button,
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
  Container,
} from "@mantine/core"
import { useAuthStore } from "../store/auth.store"
import { LogOut, User, Home, Users, Settings } from "lucide-react"
import { useDisclosure } from "@mantine/hooks"
import { motion } from "framer-motion"

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottom: `1px solid ${theme.colors.gray[2]}`,
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(10px)",
  },

  headerInner: {
    height: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
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

  links: {
    display: "flex",
    gap: theme.spacing.md,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  navLink: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.md,
    textDecoration: "none",
    color: theme.colors.gray[7],
    fontWeight: 600,
    fontSize: theme.fontSizes.sm,
    transition: "background-color 200ms ease",

    "&:hover": {
      backgroundColor: theme.fn.rgba(theme.colors.primary[0], 0.5),
    },
  },

  navLinkActive: {
    backgroundColor: theme.fn.rgba(theme.colors.primary[0], 0.7),
    color: theme.colors.primary[7],
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
  },

  avatar: {
    border: `2px solid ${theme.colors.primary[5]}`,
    transition: "transform 0.2s ease",
    cursor: "pointer",

    "&:hover": {
      transform: "scale(1.05)",
    },
  },

  burger: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  mobileMenu: {
    padding: theme.spacing.xl,
  },

  mobileNavLink: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    textDecoration: "none",
    color: theme.colors.gray[7],
    fontWeight: 600,
    fontSize: theme.fontSizes.sm,
    transition: "background-color 200ms ease",

    "&:hover": {
      backgroundColor: theme.fn.rgba(theme.colors.primary[0], 0.5),
    },
  },

  mobileNavLinkActive: {
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
      <Container size="xl">
        <div className={classes.headerInner}>
          {/* Logo */}
          <div className={classes.logoSection}>
            <Link to="/" className={classes.logo}>
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Box className={classes.logoIcon}>
                  <Text fw={700} fz="xl" c="white">
                    R
                  </Text>
                </Box>
              </motion.div>
              <Box sx={{ display: { base: "none", sm: "block" } }}>
                <Text className={classes.logoText}>Rick and Morty Explorer</Text>
              </Box>
            </Link>
          </div>

          {/* Navigation Links */}
          <Group className={classes.links} spacing={5}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link to="/" className={cx(classes.navLink, isActive("/") && classes.navLinkActive)}>
                <Home size={16} />
                <span>Home</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Link to="/characters" className={cx(classes.navLink, isActive("/characters") && classes.navLinkActive)}>
                <Users size={16} />
                <span>Characters</span>
              </Link>
            </motion.div>
          </Group>

          {/* User Section */}
          <div className={classes.userSection}>
            {isAuthenticated ? (
              <Menu position="bottom-end" shadow="md" width={200} transition="pop">
                <Menu.Target>
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <Avatar color="primary" radius="xl" className={classes.avatar}>
                      {user?.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </motion.div>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item icon={<User size={14} />}>
                    <Text size="sm" fw={500}>
                      {user?.username}
                    </Text>
                  </Menu.Item>
                  <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" icon={<LogOut size={14} />} onClick={handleLogout}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Button variant="subtle" component={Link} to="/login">
                    Login
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="gradient"
                    gradient={{ from: theme.colors.primary[6], to: theme.colors.secondary[6], deg: 45 }}
                  >
                    Register
                  </Button>
                </motion.div>
              </>
            )}

            {/* Mobile Menu Button */}
            <Burger opened={mobileMenuOpened} onClick={toggleMobileMenu} className={classes.burger} size="sm" />
          </div>
        </div>
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
                className={cx(classes.mobileNavLink, isActive("/") && classes.mobileNavLinkActive)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>

              <Link
                to="/characters"
                onClick={closeMobileMenu}
                className={cx(classes.mobileNavLink, isActive("/characters") && classes.mobileNavLinkActive)}
              >
                <Users size={18} />
                <span>Characters</span>
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
