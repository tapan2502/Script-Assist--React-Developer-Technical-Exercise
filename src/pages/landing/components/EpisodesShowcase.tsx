"use client"

import { useState, useEffect } from "react"
import { Box, Container, Title, Text, createStyles, rem, Grid, Card, Tabs, Group, Button } from "@mantine/core"
import { Calendar, Play, Users, ChevronRight, TrendingUp } from "lucide-react"
import axios from "axios"

// Styles
const useStyles = createStyles((theme) => ({
  section: {
    padding: `${rem(100)} 0`,
    position: "relative",
    overflow: "hidden",
    background: `#0B0B1A`,
  },

  title: {
    fontSize: rem(48),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: rem(20),
    textAlign: "center",
    color: theme.white,
    textShadow: "0 2px 10px rgba(0,0,0,0.3)",

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(36),
    },
  },

  subtitle: {
    fontSize: rem(20),
    color: theme.fn.rgba(theme.white, 0.7),
    textAlign: "center",
    maxWidth: 800,
    margin: "0 auto",
    marginBottom: rem(50),
    textShadow: "0 2px 5px rgba(0,0,0,0.2)",

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(16),
    },
  },

  titleHighlight: {
    background: `linear-gradient(90deg, #11a1ff, #35ff93, #ff8111, #11a1ff)`,
    backgroundSize: "300% 100%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block",
    padding: "0 8px",
    borderRadius: "4px",
  },

  seasonTabs: {
    marginBottom: rem(40),
  },

  tab: {
    backgroundColor: "transparent",
    color: theme.white,
    fontWeight: 600,
    fontSize: theme.fontSizes.md,
    borderColor: theme.fn.rgba(theme.white, 0.2),
    padding: "8px 16px",

    "&[data-active]": {
      backgroundColor: theme.fn.rgba(theme.white, 0.1),
      color: theme.white,
      borderColor: theme.fn.rgba(theme.white, 0.5),
    },
  },

  episodeCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: "#1A1A2E",
    borderRadius: theme.radius.md,
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",

    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.4)",
      backgroundColor: "#1A1A2E", // Ensure it stays dark on hover
    },
  },

  episodeImage: {
    height: 200,
    position: "relative",
    background: "linear-gradient(180deg, #333344 0%, #1A1A2E 100%)",
    overflow: "hidden",

    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 50%)",
      zIndex: 1,
    },
  },

  episodeCode: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#1A1A2E",
    color: theme.white,
    padding: "6px 12px",
    fontWeight: 700,
    fontSize: theme.fontSizes.sm,
    zIndex: 3,
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  },

  fanFavorite: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "#FF4081", // Vibrant pink color without background
    padding: "6px 12px",
    fontWeight: 800,
    fontSize: theme.fontSizes.sm,
    zIndex: 3,
    textTransform: "uppercase",
    letterSpacing: "1px",
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
  },

  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 3,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 70,
    height: 70,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",

    "&:hover": {
      transform: "translate(-50%, -50%) scale(1.1)",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
    },
  },

  episodeContent: {
    padding: theme.spacing.md,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    backgroundColor: "#1A1A2E",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    "&:hover": {
      backgroundColor: "#1A1A2E", // Ensure content stays dark on hover
    },
  },

  episodeTitle: {
    fontSize: rem(20),
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: theme.spacing.xs,
    height: rem(48),
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    color: theme.white,
  },

  episodeInfo: {
    fontSize: rem(14),
    color: theme.fn.rgba(theme.white, 0.7),
    marginBottom: theme.spacing.sm,
  },

  episodeStats: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: theme.fn.rgba(theme.white, 0.7),
    fontSize: theme.fontSizes.sm,
  },

  popularEpisode: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#00E676", // Bright green for popular episode
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,
    marginTop: theme.spacing.xs,
  },

  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: theme.spacing.md,
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },

  watchButton: {
    backgroundColor: "#FF4081", // Matching the fan favorite color
    color: theme.white,
    fontWeight: 600,
    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor: "#FF6699",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 10px rgba(255, 64, 129, 0.4)",
    },
  },

  detailsButton: {
    color: theme.white,
    fontWeight: 600,
    padding: "4px 8px",
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor: "transparent",
      textDecoration: "underline",
    },
  },
}))

// Types
interface Episode {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
}

interface EpisodesResponse {
  info: {
    count: number
    pages: number
    next: string | null
    prev: string | null
  }
  results: Episode[]
}

// Component
const EpisodesShowcase = () => {
  const { classes } = useStyles()
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string | null>("1")

  // Helper functions
  const getSeasonNumber = (episodeCode: string): number => {
    const match = episodeCode.match(/S(\d+)E\d+/)
    return match ? Number.parseInt(match[1], 10) : 0
  }

  const getEpisodeNumber = (episodeCode: string): number => {
    const match = episodeCode.match(/S\d+E(\d+)/)
    return match ? Number.parseInt(match[1], 10) : 0
  }

  const isPopularEpisode = (episode: Episode): boolean => {
    return episode.characters.length > 15
  }

  const getEpisodeImage = (episode: Episode): string => {
    return `/placeholder.svg?height=200&width=400&query=Rick%20and%20Morty%20${encodeURIComponent(episode.name)}`
  }

  // Fetch episodes
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true)
        const responses = await Promise.all([
          axios.get<EpisodesResponse>("https://rickandmortyapi.com/api/episode?page=1"),
          axios.get<EpisodesResponse>("https://rickandmortyapi.com/api/episode?page=2"),
          axios.get<EpisodesResponse>("https://rickandmortyapi.com/api/episode?page=3"),
        ])

        const allEpisodes = [...responses[0].data.results, ...responses[1].data.results, ...responses[2].data.results]

        setEpisodes(allEpisodes)
      } catch (error) {
        console.error("Error fetching episodes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodes()
  }, [])

  // Group episodes by season
  const episodesBySeason = episodes.reduce<Record<string, Episode[]>>((acc, episode) => {
    const season = getSeasonNumber(episode.episode).toString()
    if (!acc[season]) {
      acc[season] = []
    }
    acc[season].push(episode)
    return acc
  }, {})

  // Get unique seasons
  const seasons = Object.keys(episodesBySeason).sort((a, b) => Number.parseInt(a) - Number.parseInt(b))

  if (loading) {
    return (
      <Box className={classes.section}>
        <Container>
          <Title className={classes.title}>
            Explore <span className={classes.titleHighlight}>Epic Adventures</span> Through Episodes
          </Title>
          <Text color="white" align="center">
            Loading episodes...
          </Text>
        </Container>
      </Box>
    )
  }

  return (
    <Box className={classes.section}>
      <Container size="lg">
        <Title className={classes.title}>
          Explore <span className={classes.titleHighlight}>Epic Adventures</span> Through Episodes
        </Title>
        <Text className={classes.subtitle}>
          Relive the most memorable moments from the multiverse with our comprehensive episode guide
        </Text>

        <Tabs
          value={activeTab}
          onTabChange={setActiveTab}
          variant="pills"
          className={classes.seasonTabs}
          styles={{
            tabsList: {
              border: "none",
              gap: "16px",
              flexWrap: "wrap",
              justifyContent: "center",
            },
          }}
        >
          <Tabs.List position="center">
            {seasons.map((season) => (
              <Tabs.Tab key={season} value={season} className={classes.tab}>
                Season {season}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {seasons.map((season) => (
            <Tabs.Panel key={season} value={season} pt="xl">
              <Grid gutter="xl">
                {episodesBySeason[season].map((episode) => (
                  <Grid.Col key={episode.id} xs={12} sm={6} md={4} lg={4}>
                    <Card className={classes.episodeCard} p={0} radius="md">
                      <Card.Section className={classes.episodeImage}>
                        <div className={classes.episodeCode}>{episode.episode}</div>
                        {isPopularEpisode(episode) && <div className={classes.fanFavorite}>FAN FAVORITE</div>}
                        <div className={classes.playButton}>
                          <Play size={30} color="#1A1A2E" />
                        </div>
                        <img
                          src={getEpisodeImage(episode) || "/placeholder.svg"}
                          alt={episode.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Card.Section>

                      <div className={classes.episodeContent}>
                        <Text className={classes.episodeTitle}>{episode.name}</Text>
                        <Text className={classes.episodeInfo}>
                          Season {getSeasonNumber(episode.episode)}, Episode {getEpisodeNumber(episode.episode)}
                        </Text>

                        <Group position="apart" mb="xs">
                          <Group spacing="xs" className={classes.episodeStats}>
                            <Calendar size={16} color="rgba(255, 255, 255, 0.7)" />
                            <Text size="sm">{episode.air_date}</Text>
                          </Group>
                          <Group spacing="xs" className={classes.episodeStats}>
                            <Users size={16} color="rgba(255, 255, 255, 0.7)" />
                            <Text size="sm">{episode.characters.length} characters</Text>
                          </Group>
                        </Group>

                        {isPopularEpisode(episode) && (
                          <div className={classes.popularEpisode}>
                            <TrendingUp size={16} color="#00E676" />
                            <span>Popular Episode</span>
                          </div>
                        )}

                        <div className={classes.buttonsContainer}>
                          <Button
                            variant="subtle"
                            className={classes.detailsButton}
                            rightIcon={<ChevronRight size={14} color="white" />}
                          >
                            Details
                          </Button>
                          <Button size="sm" className={classes.watchButton} leftIcon={<Play size={14} />}>
                            Watch Now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Container>
    </Box>
  )
}

export default EpisodesShowcase
