import type { FC } from "react"
import { Link } from "react-router-dom"
import {
  Title,
  Text,
  Container,
  Button,
  Group,
  Card,
  SimpleGrid,
  ThemeIcon,
  createStyles,
  rem,
  Box,
  useMantineTheme,
  Overlay,
  keyframes,
} from "@mantine/core"
import { useAuthStore } from "../../store/auth.store"
import { Users, Search, ChevronRight, Rocket, Globe } from "lucide-react"

// Animation keyframes
const pulse = keyframes({
  "0%": { boxShadow: "0 0 0 0 rgba(17, 161, 255, 0.4)" },
  "70%": { boxShadow: "0 0 0 10px rgba(17, 161, 255, 0)" },
  "100%": { boxShadow: "0 0 0 0 rgba(17, 161, 255, 0)" },
})

const shimmer = keyframes({
  "0%": { backgroundPosition: "-200% 0" },
  "100%": { backgroundPosition: "200% 0" },
})

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: `${rem(80)} 0`,
  },

  heroSection: {
    position: "relative",
    minHeight: "90vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    width: "100%",
  },

  heroTitle: {
    fontSize: rem(64),
    fontWeight: 900,
    lineHeight: 1.1,
    color: theme.white,
    textShadow: "0 2px 30px rgba(0,0,0,0.15)",

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(50),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(36),
      lineHeight: 1.3,
    },
  },

  heroHighlight: {
    background: `linear-gradient(135deg, ${theme.colors.primary[5]} 0%, ${theme.colors.secondary[5]} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline",
  },

  heroDescription: {
    color: theme.white,
    maxWidth: 600,
    fontSize: rem(22),
    lineHeight: 1.6,
    marginTop: theme.spacing.xl,
    textShadow: "0 2px 10px rgba(0,0,0,0.2)",

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(18),
    },
  },

  heroControls: {
    marginTop: `calc(${theme.spacing.xl} * 2)`,

    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xl,
    },
  },

  heroControl: {
    height: rem(58),
    paddingLeft: rem(40),
    paddingRight: rem(40),
    fontSize: rem(18),
    fontWeight: 600,

    [theme.fn.smallerThan("sm")]: {
      height: rem(54),
      paddingLeft: rem(18),
      paddingRight: rem(18),
      flex: 1,
    },
  },

  pulseButton: {
    animation: `${pulse} 2s infinite`,
  },

  featureIcon: {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "rotate(10deg) scale(1.1)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    },
  },

  featureCard: {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    height: "100%",
    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: theme.shadows.lg,
    },
  },

  featureTitle: {
    fontSize: rem(20),
    fontWeight: 700,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },

  sectionTitle: {
    fontSize: rem(40),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: rem(40),
    textAlign: "center",
    background: `linear-gradient(135deg, ${theme.colors.primary[7]} 0%, ${theme.colors.secondary[7]} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(32),
    },
  },

  ctaSection: {
    position: "relative",
    padding: `${rem(80)} 0`,
    overflow: "hidden",
    background: `linear-gradient(135deg, ${theme.colors.primary[7]} 0%, ${theme.colors.secondary[7]} 100%)`,
  },

  ctaTitle: {
    color: theme.white,
    fontSize: rem(40),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
    textShadow: "0 2px 10px rgba(0,0,0,0.2)",

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(32),
    },
  },

  ctaDescription: {
    color: theme.white,
    fontSize: rem(20),
    lineHeight: 1.6,
    marginBottom: theme.spacing.xl * 2,
    textAlign: "center",
    maxWidth: 800,
    margin: "0 auto",
    textShadow: "0 2px 10px rgba(0,0,0,0.2)",

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(18),
    },
  },

  ctaButton: {
    height: rem(58),
    paddingLeft: rem(40),
    paddingRight: rem(40),
    fontSize: rem(18),
    fontWeight: 600,
    background: theme.white,
    color: theme.colors.primary[7],

    "&:hover": {
      background: theme.fn.lighten(theme.white, 0.05),
      transform: "translateY(-5px)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    },

    [theme.fn.smallerThan("sm")]: {
      height: rem(54),
      paddingLeft: rem(18),
      paddingRight: rem(18),
    },
  },

  shimmerText: {
    background: `linear-gradient(90deg, ${theme.colors.primary[5]} 0%, ${theme.colors.secondary[5]} 50%, ${theme.colors.primary[5]} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: `${shimmer} 3s linear infinite`,
    display: "inline",
  },
}))

const features = [
  {
    icon: Users,
    title: "Character Database",
    description:
      "Explore a comprehensive database of Rick and Morty characters with detailed information about their origins, species, and status.",
  },
  {
    icon: Search,
    title: "Advanced Search",
    description:
      "Find characters quickly with our powerful search and filtering capabilities. Sort by name, status, species, or gender.",
  },
  {
    icon: Globe,
    title: "Multiverse Locations",
    description:
      "Discover the countless dimensions and planets from the show, from Earth C-137 to the Citadel of Ricks.",
  },
]

const Landing: FC = () => {
  const { classes } = useStyles()
  const { isAuthenticated } = useAuthStore()
  const theme = useMantineTheme()

  const items = features.map((feature, index) => (
    <Card key={feature.title} shadow="md" radius="lg" className={classes.featureCard} padding="xl">
      <ThemeIcon
        size={rem(70)}
        radius={rem(70)}
        variant="gradient"
        gradient={{ deg: 133, from: theme.colors.primary[5], to: theme.colors.secondary[5] }}
        className={classes.featureIcon}
      >
        <feature.icon size={rem(34)} />
      </ThemeIcon>
      <Text className={classes.featureTitle}>{feature.title}</Text>
      <Text fz="md" c="dimmed">
        {feature.description}
      </Text>
      <Button
        variant="subtle"
        rightIcon={<ChevronRight size={16} />}
        mt="md"
        component={Link}
        to={isAuthenticated ? "/characters" : "/login"}
      >
        Learn more
      </Button>
    </Card>
  ))

  return (
    <>
      <Box className={classes.heroSection}>
        <Overlay
          gradient={`linear-gradient(45deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.65) 50%, rgba(0, 0, 0, 0.45) 100%)`}
          opacity={1}
          zIndex={1}
        />
        <Container size="lg" className={classes.heroContent}>
          <Title className={classes.heroTitle}>
            Explore the <span className={classes.shimmerText}>Infinite Dimensions</span> of Rick and Morty
          </Title>

          <Text className={classes.heroDescription}>
            Dive into the multiverse and discover detailed information about every character, location, and episode from
            the hit animated series.
          </Text>

          <Group className={classes.heroControls}>
            {isAuthenticated ? (
              <Button
                component={Link}
                to="/characters"
                size="xl"
                className={`${classes.heroControl} ${classes.pulseButton}`}
                variant="gradient"
                gradient={{ from: theme.colors.primary[5], to: theme.colors.secondary[5], deg: 45 }}
                leftIcon={<Rocket size={20} />}
              >
                Explore Characters
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  size="xl"
                  className={classes.heroControl}
                  variant="white"
                  color="dark"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  size="xl"
                  className={`${classes.heroControl} ${classes.pulseButton}`}
                  variant="gradient"
                  gradient={{ from: theme.colors.primary[5], to: theme.colors.secondary[5], deg: 45 }}
                  leftIcon={<Rocket size={20} />}
                >
                  Get Started
                </Button>
              </>
            )}
          </Group>
        </Container>
      </Box>

      <Container className={classes.wrapper} size="lg">
        <Title className={classes.sectionTitle}>Discover the Rick and Morty Universe</Title>

        <SimpleGrid
          mt={60}
          cols={3}
          spacing={30}
          breakpoints={[
            { maxWidth: "md", cols: 2 },
            { maxWidth: "xs", cols: 1 },
          ]}
        >
          {items}
        </SimpleGrid>
      </Container>

      <Box className={classes.ctaSection}>
        <Container size="lg">
          <Title className={classes.ctaTitle}>Ready to start exploring?</Title>
          <Text className={classes.ctaDescription}>
            Join our community and discover all the secrets of the Rick and Morty universe.
          </Text>
          <Group position="center">
            <Button
              component={Link}
              to={isAuthenticated ? "/characters" : "/register"}
              className={classes.ctaButton}
              leftIcon={<Rocket size={19} />}
            >
              {isAuthenticated ? "Explore Now" : "Sign Up for Free"}
            </Button>
          </Group>
        </Container>
      </Box>
    </>
  )
}

export default Landing
