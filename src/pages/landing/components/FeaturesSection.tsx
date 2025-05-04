"use client"

import { useRef } from "react"
import { Container, Title, Text, SimpleGrid, Box, createStyles, rem, keyframes, useMantineTheme } from "@mantine/core"
import { Users, Search, Globe, Compass, Star, Zap, ChevronRight, Sparkles } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { Link } from "react-router-dom"
import { useAuthStore } from "../../../store/auth.store"

// Animation keyframes
const float = keyframes({
  "0%": { transform: "translateY(0px)" },
  "50%": { transform: "translateY(-10px)" },
  "100%": { transform: "translateY(0px)" },
})

const pulse = keyframes({
  "0%": { boxShadow: "0 0 0 0 rgba(17, 161, 255, 0.4)" },
  "70%": { boxShadow: "0 0 0 10px rgba(17, 161, 255, 0)" },
  "100%": { boxShadow: "0 0 0 0 rgba(17, 161, 255, 0)" },
})

const glow = keyframes({
  "0%": { filter: "drop-shadow(0 0 2px rgba(17, 161, 255, 0.7))" },
  "50%": { filter: "drop-shadow(0 0 10px rgba(17, 161, 255, 0.9))" },
  "100%": { filter: "drop-shadow(0 0 2px rgba(17, 161, 255, 0.7))" },
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

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: `${rem(80)} 0`,
    position: "relative",
    overflow: "hidden",
    background: `linear-gradient(180deg, ${theme.fn.rgba(
      theme.colors.primary[9],
      0.05,
    )} 0%, ${theme.fn.rgba(theme.colors.primary[9], 0.05)} 100%)`,
  },

  portalBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundImage: "url('/placeholder.svg?key=ymg2e')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
  },

  title: {
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: rem(60),
    textAlign: "center",
    position: "relative",
    zIndex: 1,
    color: theme.white,
    textShadow: "0 2px 10px rgba(0,0,0,0.3)",

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(36),
    },
  },

  titleGradient: {
    background: `linear-gradient(90deg, #11a1ff, #35ff93, #ff8111, #11a1ff)`,
    backgroundSize: "300% 100%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block",
    animation: `${gradientMove} 6s ease infinite, ${textGlow} 3s ease-in-out infinite`,
    padding: "0 8px",
    borderRadius: "4px",
    position: "relative",
    zIndex: 2,
  },

  titleGradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.1)",
    filter: "blur(8px)",
    opacity: 0.5,
    zIndex: 1,
  },

  featureCard: {
    position: "relative",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    backgroundColor: theme.fn.rgba(theme.white, 0.9),
    border: `1px solid ${theme.fn.rgba(theme.colors.primary[1], 0.5)}`,
    backdropFilter: "blur(10px)",
    boxShadow: theme.shadows.md,
    height: "100%",
    transition: "all 0.3s ease",
    overflow: "hidden",
    zIndex: 1,

    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: theme.shadows.xl,
      border: `1px solid ${theme.colors.primary[3]}`,
    },
  },

  featureIcon: {
    float: "right",
    marginLeft: theme.spacing.sm,
    animation: `${float} 3s ease-in-out infinite`,
  },

  featureTitle: {
    fontSize: rem(22),
    fontWeight: 700,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    color: theme.colors.primary[7],
  },

  featureDescription: {
    color: theme.colors.gray[7],
    lineHeight: 1.6,
  },

  learnMore: {
    display: "inline-flex",
    alignItems: "center",
    color: theme.colors.primary[6],
    fontWeight: 600,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.md,
    textDecoration: "none",
    transition: "color 0.2s ease, transform 0.2s ease",

    "&:hover": {
      color: theme.colors.primary[8],
      transform: "translateX(5px)",
    },
  },

  iconWrapper: {
    position: "relative",
    width: rem(80),
    height: rem(80),
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    background: `linear-gradient(135deg, ${theme.colors.primary[6]} 0%, ${theme.colors.primary[6]} 100%)`,
    boxShadow: `0 10px 20px rgba(0, 0, 0, 0.1)`,
    animation: `${pulse} 3s infinite`,
  },

  iconGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${theme.fn.rgba(theme.colors.primary[5], 0.8)} 0%, ${theme.fn.rgba(
      theme.colors.primary[5],
      0,
    )} 70%)`,
    filter: "blur(10px)",
    opacity: 0.5,
    animation: `${glow} 3s ease-in-out infinite`,
  },

  portalParticle: {
    position: "absolute",
    borderRadius: "50%",
    background: theme.colors.primary[3],
    opacity: 0.6,
    zIndex: 0,
  },

  featureCardInner: {
    position: "relative",
    zIndex: 2,
  },

  featureBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 0,
  },

  sparkle: {
    position: "absolute",
    animation: `${glow} 2s ease-in-out infinite`,
    zIndex: 0,
  },

  sectionBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
    zIndex: 0,
  },

  titleContainer: {
    position: "relative",
    zIndex: 2,
    padding: "20px",
    borderRadius: theme.radius.lg,
    marginBottom: rem(60),
  },

  titleParticle: {
    position: "absolute",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.6)",
    zIndex: 1,
    pointerEvents: "none",
  },
}))

const features = [
  {
    icon: Users,
    title: "Character Database",
    description:
      "Explore a comprehensive database of Rick and Morty characters with detailed information about their origins, species, and status.",
    background: "characters-bg",
    color: "primary",
  },
  {
    icon: Search,
    title: "Advanced Search",
    description:
      "Find characters quickly with our powerful search and filtering capabilities. Sort by name, status, species, or gender.",
    background: "search-bg",
    color: "secondary",
  },
  {
    icon: Globe,
    title: "Multiverse Locations",
    description:
      "Discover the countless dimensions and planets from the show, from Earth C-137 to the Citadel of Ricks.",
    background: "locations-bg",
    color: "accent",
  },
  {
    icon: Compass,
    title: "Interactive Explorer",
    description: "Navigate through the Rick and Morty universe with our intuitive and interactive explorer interface.",
    background: "explorer-bg",
    color: "primary",
  },
  {
    icon: Star,
    title: "Favorites Collection",
    description: "Save your favorite characters to your personal collection for quick access and reference.",
    background: "favorites-bg",
    color: "secondary",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Our database is constantly updated with the latest information from the show as new episodes are released.",
    background: "updates-bg",
    color: "accent",
  },
]

const TitleParticles = () => {
  // Generate random particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 10 + 5}s`,
    animationDelay: `${Math.random() * 5}s`,
  }))

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="titleParticle"
          style={{
            position: "absolute",
            width: particle.size,
            height: particle.size,
            top: particle.top,
            left: particle.left,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.6)",
            zIndex: 1,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Number.parseInt(particle.animationDuration),
            delay: Number.parseInt(particle.animationDelay),
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  )
}

const FeatureCard = ({ feature, index }: { feature: (typeof features)[0]; index: number }) => {
  const { classes, theme } = useStyles()
  const { isAuthenticated } = useAuthStore()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  const FeatureIcon = feature.icon
  const colorGradient = {
    primary: { from: theme.colors.primary[5], to: theme.colors.primary[7] },
    secondary: { from: theme.colors.primary[5], to: theme.colors.primary[7] },
    accent: { from: theme.colors.primary[5], to: theme.colors.primary[7] },
  }[feature.color]

  // Generate random sparkles
  const sparkles = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    size: Math.random() * 10 + 5,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
  }))

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
    >
      <Box className={classes.featureCard}>
        <div className={classes.featureBackground} />

        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className={classes.sparkle}
            style={{
              top: sparkle.top,
              left: sparkle.left,
              width: sparkle.size,
              height: sparkle.size,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              delay: sparkle.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Sparkles size={sparkle.size} color={theme.colors.primary[3]} />
          </motion.div>
        ))}

        <div className={classes.featureCardInner}>
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
          >
            <Box className={classes.iconWrapper}>
              <div className={classes.iconGlow} />
              <FeatureIcon size={40} color="white" strokeWidth={1.5} />
            </Box>
          </motion.div>

          <Title order={3} className={classes.featureTitle}>
            {feature.title}
          </Title>

          <Text className={classes.featureDescription}>{feature.description}</Text>

          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
            <Link to={isAuthenticated ? "/characters" : "/login"} className={classes.learnMore}>
              Learn more <ChevronRight size={16} style={{ marginLeft: 5 }} />
            </Link>
          </motion.div>
        </div>
      </Box>
    </motion.div>
  )
}

export function FeaturesSection() {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

  return (
    <Box className={classes.wrapper} ref={ref}>
      <div className={classes.sectionBackground} />
      <div className={classes.portalBg} />
      <TitleParticles />

      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
          className={classes.titleContainer}
        >
          <Title className={classes.title}>
            Explore the <span className={classes.titleGradient}>Interdimensional</span> Rick and Morty Universe
          </Title>
        </motion.div>

        <SimpleGrid
          cols={3}
          spacing={30}
          breakpoints={[
            { maxWidth: "md", cols: 2 },
            { maxWidth: "xs", cols: 1 },
          ]}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default FeaturesSection
