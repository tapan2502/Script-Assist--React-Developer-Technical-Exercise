"use client"

import { type FC, useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Group,
  Badge,
  Button,
  Tabs,
  Center,
  ThemeIcon,
  Paper,
  Divider,
  SimpleGrid,
  Skeleton,
  Alert,
  Box,
  createStyles,
  rem,
  Image,
  Tooltip,
  ActionIcon,
} from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { fetchCharacter, fetchLocation, fetchMultipleEpisodes, extractIdFromUrl } from "../../api/rickandmorty"
import { ArrowLeft, MapPin, Film, User, Calendar, Dna, AlertCircle, Heart, Share2, ExternalLink } from "lucide-react"
import RetryButton from "../../components/RetryButton"

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  backButton: {
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateX(-5px)",
    },
  },
  characterCard: {
    overflow: "visible",
    height: "100%",
  },
  characterImage: {
    borderRadius: theme.radius.md,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    transform: "translateY(-40px)",
    marginBottom: -20,
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-45px) scale(1.02)",
    },
  },
  characterInfo: {
    marginTop: theme.spacing.xl,
  },
  characterName: {
    fontSize: rem(32),
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: theme.spacing.md,
    background: `linear-gradient(135deg, ${theme.colors.primary[6]}, ${theme.colors.secondary[5]})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  badge: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
  infoCard: {
    height: "100%",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  tabsWrapper: {
    marginTop: theme.spacing.xl,
  },
  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  tabsList: {
    borderBottom: `2px solid ${theme.colors.gray[2]}`,
    paddingLeft: 0,
  },
  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: "transparent",
    position: "relative",
    "&[data-active]": {
      backgroundColor: "transparent",
      color: theme.colors.primary[6],
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: -2,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: theme.colors.primary[6],
      },
    },
  },
  tabPanel: {
    paddingTop: theme.spacing.xl,
  },
  episodeCard: {
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  actionButton: {
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  favoriteButton: {
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,

    [theme.fn.smallerThan("sm")]: {
      gridTemplateColumns: "1fr",
    },
  },
  detailCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.gray[2]}`,
    backgroundColor: theme.white,
    height: "100%",
  },
  detailIcon: {
    backgroundColor: theme.fn.rgba(theme.colors.primary[0], 0.7),
    color: theme.colors.primary[7],
  },
  detailLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.gray[6],
    fontWeight: 500,
  },
  detailValue: {
    fontSize: theme.fontSizes.md,
    fontWeight: 600,
    color: theme.colors.dark[7],
  },
}))

const CharacterDetail: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { classes } = useStyles()
  const [activeTab, setActiveTab] = useState<string | null>("info")
  const [isFavorite, setIsFavorite] = useState(false)

  // Check if character is in favorites
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteCharacters")
    if (savedFavorites && id) {
      const favorites = JSON.parse(savedFavorites) as number[]
      setIsFavorite(favorites.includes(Number(id)))
    }
  }, [id])

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!id) return

    const characterId = Number(id)
    const savedFavorites = localStorage.getItem("favoriteCharacters")
    let favorites: number[] = []

    if (savedFavorites) {
      favorites = JSON.parse(savedFavorites)
    }

    if (isFavorite) {
      favorites = favorites.filter((favId) => favId !== characterId)
    } else {
      favorites.push(characterId)
    }

    localStorage.setItem("favoriteCharacters", JSON.stringify(favorites))
    setIsFavorite(!isFavorite)
  }

  // Fetch character data
  const {
    data: character,
    isLoading,
    isError,
    error,
    refetch: refetchCharacter,
    isFetching: isFetchingCharacter,
  } = useQuery({
    queryKey: ["character", id],
    queryFn: () => fetchCharacter(id || ""),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch location data for enrichment
  const {
    data: location,
    isLoading: isLoadingLocation,
    isError: isErrorLocation,
    refetch: refetchLocation,
    isFetching: isFetchingLocation,
  } = useQuery({
    queryKey: ["location", character?.location.url],
    queryFn: () => fetchLocation(character?.location.url || ""),
    enabled: !!character?.location.url && character.location.url !== "",
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch episodes data for enrichment
  const {
    data: episodes,
    isLoading: isLoadingEpisodes,
    isError: isErrorEpisodes,
    refetch: refetchEpisodes,
    isFetching: isFetchingEpisodes,
  } = useQuery({
    queryKey: ["episodes", character?.episode],
    queryFn: async () => {
      if (!character?.episode.length) return []
      const episodeIds = character.episode.map((url) => extractIdFromUrl(url))
      return fetchMultipleEpisodes(episodeIds)
    },
    enabled: !!character?.episode.length,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "alive":
        return "green"
      case "dead":
        return "red"
      default:
        return "gray"
    }
  }

  if (isLoading) {
    return (
      <Container size="lg" py="xl" className={classes.container}>
        <Box className={classes.header}>
          <Button
            leftIcon={<ArrowLeft size={16} />}
            variant="subtle"
            onClick={() => navigate("/characters")}
            className={classes.backButton}
          >
            Back to Characters
          </Button>
        </Box>
        <Grid gutter="xl">
          <Grid.Col md={4}>
            <Skeleton height={400} radius="md" />
          </Grid.Col>
          <Grid.Col md={8}>
            <Skeleton height={50} width="70%" mb="xl" />
            <Skeleton height={30} width="40%" mb="lg" />
            <Skeleton height={100} mb="xl" />
            <Skeleton height={200} />
          </Grid.Col>
        </Grid>
      </Container>
    )
  }

  if (isError || !character) {
    return (
      <Container size="md" py="xl" className={classes.container}>
        <Button
          leftIcon={<ArrowLeft size={16} />}
          variant="subtle"
          onClick={() => navigate("/characters")}
          mb="lg"
          className={classes.backButton}
        >
          Back to Characters
        </Button>
        <Alert icon={<AlertCircle size={16} />} title="Error" color="red" mb="md">
          {error instanceof Error ? error.message : "Error loading character details"}
        </Alert>
        <RetryButton onRetry={refetchCharacter} isLoading={isFetchingCharacter} />
      </Container>
    )
  }

  return (
    <Container size="lg" py="xl" className={classes.container}>
      <Box className={classes.header}>
        <Button
          leftIcon={<ArrowLeft size={16} />}
          variant="subtle"
          onClick={() => navigate("/characters")}
          className={classes.backButton}
        >
          Back to Characters
        </Button>

        <Group>
          <Tooltip label="Share character">
            <ActionIcon variant="light" radius="xl" size="lg" className={classes.actionButton}>
              <Share2 size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <ActionIcon
              variant={isFavorite ? "filled" : "light"}
              radius="xl"
              size="lg"
              color="pink"
              className={classes.favoriteButton}
              onClick={toggleFavorite}
            >
              <Heart size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Box>

      <Grid gutter="xl">
        <Grid.Col md={4}>
          <Card withBorder shadow="sm" p="lg" radius="md" className={classes.characterCard}>
            <Card.Section sx={{ height: 80, backgroundColor: "#f8f9fa" }} />

            <Center>
              <Image
                src={character.image || "/placeholder.svg"}
                alt={character.name}
                width={200}
                height={200}
                radius={100}
                className={classes.characterImage}
              />
            </Center>

            <Box className={classes.characterInfo}>
              <Title order={2} align="center" className={classes.characterName}>
                {character.name}
              </Title>

              <Group position="center" mb="md">
                <Badge size="lg" color={getStatusColor(character.status)} className={classes.badge}>
                  {character.status}
                </Badge>
              </Group>

              <Divider my="md" />

              <div className={classes.detailsGrid}>
                <div className={classes.detailCard}>
                  <Group spacing="xs">
                    <ThemeIcon size="lg" variant="light" radius="xl" className={classes.detailIcon}>
                      <Dna size={18} />
                    </ThemeIcon>
                    <div>
                      <Text className={classes.detailLabel}>Species</Text>
                      <Text className={classes.detailValue}>{character.species}</Text>
                    </div>
                  </Group>
                </div>

                <div className={classes.detailCard}>
                  <Group spacing="xs">
                    <ThemeIcon size="lg" variant="light" radius="xl" className={classes.detailIcon}>
                      <User size={18} />
                    </ThemeIcon>
                    <div>
                      <Text className={classes.detailLabel}>Gender</Text>
                      <Text className={classes.detailValue}>{character.gender}</Text>
                    </div>
                  </Group>
                </div>

                <div className={classes.detailCard}>
                  <Group spacing="xs">
                    <ThemeIcon size="lg" variant="light" radius="xl" className={classes.detailIcon}>
                      <MapPin size={18} />
                    </ThemeIcon>
                    <div>
                      <Text className={classes.detailLabel}>Origin</Text>
                      <Text className={classes.detailValue}>{character.origin.name}</Text>
                    </div>
                  </Group>
                </div>

                <div className={classes.detailCard}>
                  <Group spacing="xs">
                    <ThemeIcon size="lg" variant="light" radius="xl" className={classes.detailIcon}>
                      <Calendar size={18} />
                    </ThemeIcon>
                    <div>
                      <Text className={classes.detailLabel}>Created</Text>
                      <Text className={classes.detailValue}>{new Date(character.created).toLocaleDateString()}</Text>
                    </div>
                  </Group>
                </div>
              </div>

              <Text size="sm" color="dimmed" align="center" mt="xl">
                Appears in {character.episode.length} episodes
              </Text>
            </Box>
          </Card>
        </Grid.Col>

        <Grid.Col md={8}>
          <Box className={classes.tabsWrapper}>
            <Tabs value={activeTab} onTabChange={setActiveTab} classNames={classes}>
              <Tabs.List className={classes.tabsList}>
                <Tabs.Tab value="info" icon={<User size={16} />} className={classes.tab}>
                  Basic Info
                </Tabs.Tab>
                <Tabs.Tab value="location" icon={<MapPin size={16} />} className={classes.tab}>
                  Location
                </Tabs.Tab>
                <Tabs.Tab value="episodes" icon={<Film size={16} />} className={classes.tab}>
                  Episodes
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="info" className={classes.tabPanel}>
                <Card withBorder p="lg" radius="md">
                  <Title order={3} mb="md">
                    Character Details
                  </Title>
                  <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
                    <Paper p="md" withBorder>
                      <Text weight={600}>Status</Text>
                      <Group spacing="xs">
                        <Badge color={getStatusColor(character.status)}>{character.status}</Badge>
                        <Text>
                          {character.status === "Alive"
                            ? "Currently alive and well"
                            : character.status === "Dead"
                              ? "No longer with us"
                              : "Status unknown"}
                        </Text>
                      </Group>
                    </Paper>

                    <Paper p="md" withBorder>
                      <Text weight={600}>Species</Text>
                      <Text>{character.species}</Text>
                      {character.type && (
                        <Text size="sm" color="dimmed" mt="xs">
                          Type: {character.type}
                        </Text>
                      )}
                    </Paper>

                    <Paper p="md" withBorder>
                      <Text weight={600}>Origin</Text>
                      <Text>{character.origin.name}</Text>
                    </Paper>

                    <Paper p="md" withBorder>
                      <Text weight={600}>Current Location</Text>
                      <Text>{character.location.name}</Text>
                    </Paper>
                  </SimpleGrid>
                </Card>
              </Tabs.Panel>

              <Tabs.Panel value="location" className={classes.tabPanel}>
                {isLoadingLocation ? (
                  <Skeleton height={200} />
                ) : isErrorLocation ? (
                  <>
                    <Alert icon={<AlertCircle size={16} />} title="Error" color="red" mb="md">
                      Error loading location data
                    </Alert>
                    <RetryButton onRetry={refetchLocation} isLoading={isFetchingLocation} />
                  </>
                ) : location ? (
                  <Card withBorder p="lg" radius="md">
                    <Group position="apart" mb="md">
                      <Title order={3}>{location.name}</Title>
                      <Badge size="lg" variant="gradient" gradient={{ from: "primary.6", to: "accent.5" }}>
                        {location.type}
                      </Badge>
                    </Group>
                    <Divider mb="lg" />

                    <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
                      <Paper p="md" withBorder>
                        <Text weight={600}>Dimension</Text>
                        <Text>{location.dimension}</Text>
                      </Paper>

                      <Paper p="md" withBorder>
                        <Text weight={600}>Residents</Text>
                        <Group spacing="xs">
                          <Text>{location.residents.length}</Text>
                          <Text color="dimmed">characters</Text>
                        </Group>
                      </Paper>

                      <Paper p="md" withBorder>
                        <Text weight={600}>Created</Text>
                        <Text>{new Date(location.created).toLocaleDateString()}</Text>
                      </Paper>

                      <Paper p="md" withBorder>
                        <Text weight={600}>API Link</Text>
                        <Group spacing="xs">
                          <ExternalLink size={14} />
                          <Text size="sm" component="a" href={location.url} target="_blank" rel="noopener noreferrer">
                            View in API
                          </Text>
                        </Group>
                      </Paper>
                    </SimpleGrid>
                  </Card>
                ) : (
                  <Card withBorder p="lg" radius="md">
                    <Text align="center">No location information available</Text>
                  </Card>
                )}
              </Tabs.Panel>

              <Tabs.Panel value="episodes" className={classes.tabPanel}>
                {isLoadingEpisodes ? (
                  <Skeleton height={200} />
                ) : isErrorEpisodes ? (
                  <>
                    <Alert icon={<AlertCircle size={16} />} title="Error" color="red" mb="md">
                      Error loading episode data
                    </Alert>
                    <RetryButton onRetry={refetchEpisodes} isLoading={isFetchingEpisodes} />
                  </>
                ) : episodes ? (
                  <SimpleGrid cols={1} spacing="md">
                    {episodes.map((episode) => (
                      <Card withBorder p="lg" radius="md" key={episode.id} className={classes.episodeCard}>
                        <Group position="apart" mb="md">
                          <Title order={4}>{episode.name}</Title>
                          <Badge size="lg" variant="gradient" gradient={{ from: "primary.6", to: "accent.5" }}>
                            {episode.episode}
                          </Badge>
                        </Group>
                        <Divider mb="lg" />
                        <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
                          <Paper p="md" withBorder>
                            <Text weight={600}>Air Date</Text>
                            <Text>{episode.air_date}</Text>
                          </Paper>
                          <Paper p="md" withBorder>
                            <Text weight={600}>API Link</Text>
                            <Group spacing="xs">
                              <ExternalLink size={14} />
                              <Text
                                size="sm"
                                component="a"
                                href={episode.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View in API
                              </Text>
                            </Group>
                          </Paper>
                        </SimpleGrid>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Card withBorder p="lg" radius="md">
                    <Text align="center">No episode information available</Text>
                  </Card>
                )}
              </Tabs.Panel>
            </Tabs>
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default CharacterDetail
