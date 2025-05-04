"use client"

import { type FC, useRef } from "react"
import { Link } from "react-router-dom"
import {
  Title,
  Text,
  Container,
  Button,
  Group,
  createStyles,
  rem,
  Box,
  useMantineTheme,
  Overlay,
  keyframes,
  SimpleGrid,
} from "@mantine/core"
import { useAuthStore } from "../../store/auth.store"
import { Rocket, ArrowDown } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import PortalScene from "./components/PortalScene"
import CharacterShowcase from "./components/CharacterShowcase"
import StatsCounter from "./components/StatsCounter"
import FeaturesSection from "./components/FeaturesSection"
import EpisodesShowcase from "./components/EpisodesShowcase"

// Animation keyframes
const pulse = keyframes({
  "0%": { boxShadow: "0 0 0 0 rgba(17, 161, 255, 0.4)" },
  "70%": { boxShadow: "0 0 10px rgba(17, 161, 255, 0)" },
  "100%": { boxShadow: "0 0 0 0 rgba(17, 161, 255, 0)" },
})

const shimmer = keyframes({
  "0%": { backgroundPosition: "-200% 0" },
  "100%": { backgroundPosition: "200% 0" },
})

const gradientMove = keyframes({
  "0%": { backgroundPosition: "0% 50%" },
  "50%": { backgroundPosition: "100% 50%" },
  "100%": { backgroundPosition: "0% 50%" },
})

const textGlow = keyframes({
  "0%": { textShadow: "0 0 5px rgba(61, 255, 244, 0.3), 0 0 10px rgba(61, 255, 244, 0.2)" },
  "50%": { textShadow: "0 0 20px rgba(61, 255, 244, 0.8), 0 0 30px rgba(61, 255, 244, 0.5)" },
  "100%": { textShadow: "0 0 5px rgba(61, 255, 244, 0.3), 0 0 10px rgba(61, 255, 244, 0.2)" },
})

const float = keyframes({
  "0%": { transform: "translateY(0px)" },
  "50%": { transform: "translateY(-10px)" },
  "100%": { transform: "translateY(0px)" },
})

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: `${rem(100)} 0`,
    position: "relative",
    overflow: "hidden",
  },

  heroSection: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },

  heroContent: {
    position: "relative",
    zIndex: 5,
    width: "100%",
  },

  heroTitle: {
    fontSize: rem(72),
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
    background: `linear-gradient(90deg, #11a1ff, #35ff93, #ff8111, #11a1ff)`,
    backgroundSize: "300% 100%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block",
    animation: `${gradientMove} 6s ease infinite, ${textGlow} 3s ease-in-out infinite`,
    padding: "0 8px",
    borderRadius: "4px",
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

  sectionTitle: {
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: rem(60),
    textAlign: "center",
    background: `linear-gradient(135deg, ${theme.colors.primary[7]} 0%, ${theme.colors.primary[7]} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(36),
    },
  },

  ctaSection: {
    position: "relative",
    padding: `${rem(100)} 0`,
    overflow: "hidden",
    background: `linear-gradient(135deg, ${theme.colors.primary[7]} 0%, ${theme.colors.primary[7]} 100%)`,
  },

  ctaTitle: {
    color: theme.white,
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
    textShadow: "0 2px 10px rgba(0,0,0,0.2)",

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(36),
    },
  },

  ctaDescription: {
    color: theme.white,
    fontSize: rem(22),
    lineHeight: 1.6,
    marginBottom: `calc(${theme.spacing.xl} * 2)`,
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
    background: `linear-gradient(90deg, #11a1ff, #35ff93, #ff8111, #11a1ff)`,
    backgroundSize: "300% 100%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: `${gradientMove} 6s ease infinite, ${textGlow} 3s ease-in-out infinite`,
    display: "inline-block",
    padding: "0 8px",
    borderRadius: "4px",
  },

  statsSection: {
    padding: `${rem(80)} 0`,
    background: theme.fn.linearGradient(
      45,
      theme.fn.rgba(theme.colors.primary[9], 0.8),
      theme.fn.rgba(theme.colors.primary[9], 0.8),
    ),
    color: theme.white,
  },

  statValue: {
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
    color: theme.white,
    textShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },

  statTitle: {
    fontSize: rem(18),
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  showcaseSection: {
    padding: `${rem(100)} 0`,
    background: theme.fn.rgba(theme.colors.gray[0], 0.5),
    position: "relative",
    overflow: "hidden",
  },

  showcaseTitle: {
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: rem(60),
    textAlign: "center",
    color: theme.colors.dark[7],

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(36),
    },
  },

  showcaseHighlight: {
    color: theme.colors.primary[7],
  },

  scrollDownButton: {
    position: "absolute",
    bottom: rem(30),
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    backgroundColor: "transparent",
    border: `2px solid ${theme.white}`,
    color: theme.white,
    borderRadius: "50%",
    width: rem(50),
    height: rem(50),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: `${float} 2s ease-in-out infinite`,
    transition: "all 0.3s ease",

    "&:hover": {
      backgroundColor: theme.fn.rgba(theme.white, 0.1),
      transform: "translateX(-50%) scale(1.1)",
    },
  },
}))

const Landing: FC = () => {
  const { classes } = useStyles()
  const { isAuthenticated } = useAuthStore()
  const theme = useMantineTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [showcaseRef, showcaseInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Box ref={containerRef}>
      <Box className={classes.heroSection}>
        <PortalScene />
        <Overlay
          gradient={`linear-gradient(45deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.65) 50%, rgba(0, 0, 0, 0.45) 100%)`}
          opacity={0.7}
          zIndex={2}
        />
        <motion.div className={classes.heroContent} style={{ opacity, scale, y }}>
          <Container size="lg">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Title className={classes.heroTitle}>
                Explore the <span className={classes.shimmerText}>Infinite Dimensions</span> of Rick and Morty
              </Title>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <Text className={classes.heroDescription}>
                Dive into the multiverse and discover detailed information about every character, location, and episode
                from the hit animated series.
              </Text>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Group className={classes.heroControls}>
                {isAuthenticated ? (
                  <Button
                    component={Link}
                    to="/characters"
                    size="xl"
                    className={`${classes.heroControl} ${classes.pulseButton}`}
                    variant="gradient"
                    gradient={{ from: theme.colors.primary[5], to: theme.colors.primary[5], deg: 45 }}
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
                      gradient={{ from: theme.colors.primary[5], to: theme.colors.primary[5], deg: 45 }}
                      leftIcon={<Rocket size={20} />}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </Group>
            </motion.div>
          </Container>
        </motion.div>

        <Button className={classes.scrollDownButton} onClick={scrollToFeatures} variant="outline">
          <ArrowDown size={20} />
        </Button>
      </Box>

      <Box className={classes.statsSection} ref={statsRef}>
        <Container size="lg">
          <SimpleGrid
            cols={3}
            spacing={50}
            breakpoints={[
              { maxWidth: "md", cols: 3 },
              { maxWidth: "sm", cols: 1 },
            ]}
          >
            <AnimatePresence>
              {statsInView && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <StatsCounter end={826} duration={2.5} className={classes.statValue} />
                      <Text className={classes.statTitle}>Characters</Text>
                    </Box>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <StatsCounter end={126} duration={2} className={classes.statValue} />
                      <Text className={classes.statTitle}>Episodes</Text>
                    </Box>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <StatsCounter end={108} duration={1.5} className={classes.statValue} />
                      <Text className={classes.statTitle}>Locations</Text>
                    </Box>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </SimpleGrid>
        </Container>
      </Box>

      <div ref={featuresRef}>
        <FeaturesSection />
      </div>

      <EpisodesShowcase />

      <Box className={classes.showcaseSection} ref={showcaseRef}>
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={showcaseInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
          >
            <Title className={classes.showcaseTitle}>
              Meet Your Favorite <span className={classes.showcaseHighlight}>Characters</span>
            </Title>
          </motion.div>

          <CharacterShowcase />
        </Container>
      </Box>

      <Box className={classes.ctaSection} ref={ctaRef}>
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
          >
            <Title className={classes.ctaTitle}>Ready to start exploring?</Title>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Text className={classes.ctaDescription}>
              Join our community and discover all the secrets of the Rick and Morty universe.
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Group position="center">
              <Button
                component={Link}
                to={isAuthenticated ? "/characters" : "/register"}
                className={classes.ctaButton}
                leftIcon={<Rocket size={20} />}
              >
                {isAuthenticated ? "Explore Now" : "Sign Up for Free"}
              </Button>
            </Group>
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}

export default Landing
