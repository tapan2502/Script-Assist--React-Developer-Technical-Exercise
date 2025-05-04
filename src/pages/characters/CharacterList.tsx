"use client"

import type React from "react"
import { type FC, useState, useEffect, useCallback } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  Container,
  Title,
  Group,
  TextInput,
  Button,
  Pagination,
  Card,
  Text,
  Select,
  Alert,
  Box,
  ActionIcon,
  Grid,
  Image,
  createStyles,
  rem,
  Skeleton,
  Tooltip,
  Paper,
  useMantineTheme,
} from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { fetchCharacters, type Character } from "../../api/rickandmorty"
import { Search, AlertCircle, X, Filter, SortAsc, SortDesc, Heart, Download } from "lucide-react"
import RetryButton from "../../components/RetryButton"
import { useDebouncedValue } from "@mantine/hooks"
import { motion, AnimatePresence } from "framer-motion"

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    zIndex: 1,
  },
  header: {
    marginBottom: rem(30),
  },
  title: {
    fontSize: rem(32),
    fontWeight: 900,
    lineHeight: 1.1,
    background: `linear-gradient(135deg, ${theme.colors.primary[6]} 0%, ${theme.colors.secondary[6]} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: rem(18),
    color: theme.colors.gray[6],
    marginTop: theme.spacing.xs,
  },
  filterCard: {
    overflow: "visible",
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    border: `1px solid ${theme.colors.gray[2]}`,
    boxShadow: theme.shadows.sm,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      boxShadow: theme.shadows.md,
    },
  },
  searchInput: {
    flex: 1,
    minWidth: "250px",
  },
  characterCard: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows.md,
    },
  },
  characterImage: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
  },
  characterContent: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    padding: theme.spacing.md,
  },
  characterName: {
    fontSize: rem(18),
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: theme.spacing.xs,
    color: theme.colors.primary[7],
  },
  characterMeta: {
    marginTop: "auto",
  },
  badge: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
  pagination: {
    marginTop: theme.spacing.xl * 2,
  },
  sortButton: {
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  favoriteButton: {
    position: "absolute",
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(4px)",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
  actionButton: {
    position: "absolute",
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(4px)",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
  downloadButton: {
    top: theme.spacing.xs,
    right: theme.spacing.xl * 2,
  },
  shareButton: {
    top: theme.spacing.xs,
    right: theme.spacing.xl * 3.5,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    display: "inline-block",
    marginRight: theme.spacing.xs,
  },
  noResults: {
    textAlign: "center",
    padding: theme.spacing.xl * 2,
  },
  skeletonCard: {
    height: "100%",
  },
  compareButton: {
    marginLeft: theme.spacing.md,
  },
  viewToggle: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
  },
  statusBadge: {
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    padding: `${rem(2)} ${rem(10)}`,
    borderRadius: theme.radius.sm,
    letterSpacing: "0.05em",
  },
  statusAlive: {
    backgroundColor: theme.colors.green[5],
    color: theme.white,
  },
  statusDead: {
    backgroundColor: theme.colors.red[5],
    color: theme.white,
  },
  statusUnknown: {
    backgroundColor: theme.colors.gray[5],
    color: theme.white,
  },
  genderBadge: {
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    padding: `${rem(2)} ${rem(10)}`,
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.gray[3]}`,
    backgroundColor: theme.white,
    color: theme.colors.gray[7],
  },
}))

const CharacterList: FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { classes, cx } = useStyles()
  const theme = useMantineTheme()

  // Get URL parameters with defaults
  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  const searchQuery = searchParams.get("search") || ""
  const sortField = searchParams.get("sort") || "name"
  const sortOrder = searchParams.get("order") || "asc"

  const [search, setSearch] = useState(searchQuery)
  const [debouncedSearch] = useDebouncedValue(search, 300)
  const [favorites, setFavorites] = useState<number[]>([])
  const [selectedCharacters, setSelectedCharacters] = useState<number[]>([])
  const [isCompareMode, setIsCompareMode] = useState(false)

  // Update search state when URL param changes
  useEffect(() => {
    setSearch(searchQuery)
  }, [searchQuery])

  // Update search params when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      searchParams.set("search", debouncedSearch)
      searchParams.set("page", "1") // Reset to first page on new search
      setSearchParams(searchParams)
    }
  }, [debouncedSearch, searchParams, setSearchParams, searchQuery])

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteCharacters")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage
  const toggleFavorite = useCallback((id: number, event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()

    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]

      localStorage.setItem("favoriteCharacters", JSON.stringify(newFavorites))
      return newFavorites
    })
  }, [])

  // Toggle character selection for comparison
  const toggleCharacterSelection = useCallback((id: number, event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()

    setSelectedCharacters((prev) => {
      if (prev.includes(id)) {
        return prev.filter((charId) => charId !== id)
      } else {
        // Limit to 2 characters for comparison
        if (prev.length < 2) {
          return [...prev, id]
        }
        // Replace the first selected character if already have 2
        return [prev[1], id]
      }
    })
  }, [])

  // Fetch characters with React Query
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["characters", currentPage, searchQuery],
    queryFn: () => fetchCharacters(currentPage, searchQuery),
    keepPreviousData: true,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Calculate total pages
  const totalPages = data ? data.info.pages : 0

  // Handle pagination change
  const handlePageChange = (page: number) => {
    searchParams.set("page", page.toString())
    setSearchParams(searchParams)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle search clear
  const handleSearchClear = () => {
    setSearch("")
    searchParams.delete("search")
    searchParams.set("page", "1") // Reset to first page
    setSearchParams(searchParams)
  }

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle order if clicking the same field
      searchParams.set("order", sortOrder === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      searchParams.set("sort", field)
      searchParams.set("order", "asc")
    }
    setSearchParams(searchParams)
  }

  // Sort the results
  const sortedResults = data?.results
    ? [...data.results].sort((a, b) => {
        const fieldA = a[sortField as keyof Character]
        const fieldB = b[sortField as keyof Character]

        if (typeof fieldA === "string" && typeof fieldB === "string") {
          return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
        }

        return 0
      })
    : []

  // Navigate to character detail
  const handleCharacterClick = (character: Character) => {
    navigate(`/characters/${character.id}`)
  }

  // Compare selected characters
  const handleCompareCharacters = () => {
    if (selectedCharacters.length === 2) {
      navigate(`/characters/compare/${selectedCharacters[0]}/${selectedCharacters[1]}`)
    }
  }

  // Toggle compare mode
  const toggleCompareMode = () => {
    setIsCompareMode(!isCompareMode)
    if (isCompareMode) {
      setSelectedCharacters([])
    }
  }

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

  // Get status class
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "alive":
        return classes.statusAlive
      case "dead":
        return classes.statusDead
      default:
        return classes.statusUnknown
    }
  }

  // Render skeleton cards during loading
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, i) => (
        <Grid.Col key={i} xs={12} sm={6} md={4} lg={3}>
          <Card padding={0} radius="md" className={classes.skeletonCard}>
            <Skeleton height={220} radius={0} />
            <Box p="md">
              <Skeleton height={20} width="70%" mb="sm" />
              <Skeleton height={15} width="40%" mb="sm" />
              <Skeleton height={15} width="60%" mb="sm" />
              <Box mt="md">
                <Skeleton height={24} width={80} radius="xl" />
              </Box>
            </Box>
          </Card>
        </Grid.Col>
      ))
  }

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  }

  return (
    <Container size="xl" py="xl" className={classes.container}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box className={classes.header}>
          <Title className={classes.title}>Rick and Morty Characters</Title>
          <Text className={classes.subtitle}>Explore the multiverse and discover all characters from the show</Text>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper shadow="sm" radius="md" className={classes.filterCard}>
          <Grid align="flex-end" gutter="md">
            <Grid.Col xs={12} md={6}>
              <TextInput
                label="Search characters"
                placeholder="Enter character name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={16} />}
                className={classes.searchInput}
                rightSection={
                  search ? (
                    <ActionIcon onClick={handleSearchClear} variant="subtle" radius="xl" size="sm">
                      <X size={14} />
                    </ActionIcon>
                  ) : null
                }
              />
            </Grid.Col>
            <Grid.Col xs={12} md={3}>
              <Select
                label="Sort by"
                value={sortField}
                onChange={(value) => handleSortChange(value || "name")}
                data={[
                  { value: "name", label: "Name" },
                  { value: "species", label: "Species" },
                  { value: "status", label: "Status" },
                  { value: "gender", label: "Gender" },
                ]}
                icon={<Filter size={16} />}
              />
            </Grid.Col>
            <Grid.Col xs={12} md={3}>
              <Group position="apart" noWrap>
                <Select
                  label="Order"
                  value={sortOrder}
                  onChange={(value) => {
                    searchParams.set("order", value || "asc")
                    setSearchParams(searchParams)
                  }}
                  data={[
                    { value: "asc", label: "Ascending" },
                    { value: "desc", label: "Descending" },
                  ]}
                  style={{ flex: 1 }}
                />
                <Tooltip label={sortOrder === "asc" ? "Sort ascending" : "Sort descending"}>
                  <ActionIcon
                    variant="light"
                    color="primary"
                    size="lg"
                    onClick={() => {
                      searchParams.set("order", sortOrder === "asc" ? "desc" : "asc")
                      setSearchParams(searchParams)
                    }}
                    className={classes.sortButton}
                    mt={24}
                  >
                    {sortOrder === "asc" ? <SortAsc size={18} /> : <SortDesc size={18} />}
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Grid.Col>
            <Grid.Col span={12}>
              <Group position="right">
                <Button
                  variant={isCompareMode ? "filled" : "outline"}
                  color={isCompareMode ? "primary" : "gray"}
                  onClick={toggleCompareMode}
                >
                  {isCompareMode ? "Cancel Compare" : "Compare Characters"}
                </Button>

                {isCompareMode && selectedCharacters.length === 2 && (
                  <Button
                    onClick={handleCompareCharacters}
                    variant="gradient"
                    gradient={{ from: theme.colors.primary[6], to: theme.colors.secondary[6], deg: 45 }}
                  >
                    Compare Selected ({selectedCharacters.length})
                  </Button>
                )}

                <Button
                  type="submit"
                  leftIcon={<Search size={16} />}
                  loading={isFetching && !isLoading}
                  variant="gradient"
                  gradient={{ from: theme.colors.primary[6], to: theme.colors.secondary[6], deg: 45 }}
                >
                  Search
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Paper>
      </motion.div>

      {isLoading ? (
        <Grid gutter="md">{renderSkeletons()}</Grid>
      ) : isError ? (
        <>
          <Alert icon={<AlertCircle size={16} />} title="Error" color="red" mb="md">
            {error instanceof Error ? error.message : "Error loading characters. Please try again later."}
          </Alert>
          <RetryButton onRetry={refetch} isLoading={isFetching} />
        </>
      ) : (
        <>
          <AnimatePresence>
            {sortedResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Grid gutter="md">
                  {sortedResults.map((character) => (
                    <Grid.Col key={character.id} xs={12} sm={6} md={4} lg={3}>
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                      >
                        <Card
                          padding={0}
                          radius="md"
                          className={classes.characterCard}
                          component="a"
                          href={`/characters/${character.id}`}
                          onClick={(e) => {
                            e.preventDefault()
                            if (!isCompareMode) {
                              handleCharacterClick(character)
                            }
                          }}
                          sx={isCompareMode ? { cursor: "default" } : {}}
                        >
                          <Box sx={{ position: "relative" }}>
                            <Tooltip
                              label={favorites.includes(character.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                              <ActionIcon
                                className={classes.favoriteButton}
                                color="pink"
                                variant={favorites.includes(character.id) ? "filled" : "light"}
                                onClick={(e) => toggleFavorite(character.id, e)}
                              >
                                <Heart size={16} />
                              </ActionIcon>
                            </Tooltip>

                            {isCompareMode && (
                              <Tooltip
                                label={selectedCharacters.includes(character.id) ? "Unselect" : "Select for comparison"}
                              >
                                <ActionIcon
                                  className={cx(classes.actionButton, classes.downloadButton)}
                                  color={selectedCharacters.includes(character.id) ? "primary" : "gray"}
                                  variant={selectedCharacters.includes(character.id) ? "filled" : "light"}
                                  onClick={(e) => toggleCharacterSelection(character.id, e)}
                                >
                                  {selectedCharacters.includes(character.id) ? (
                                    selectedCharacters.indexOf(character.id) + 1
                                  ) : (
                                    <Download size={16} />
                                  )}
                                </ActionIcon>
                              </Tooltip>
                            )}

                            <Image
                              src={character.image || "/placeholder.svg"}
                              alt={character.name}
                              className={classes.characterImage}
                            />
                          </Box>
                          <Box className={classes.characterContent}>
                            <Text className={classes.characterName}>{character.name}</Text>
                            <Group spacing="xs">
                              <Box
                                className={classes.statusIndicator}
                                sx={{ backgroundColor: theme.colors[getStatusColor(character.status)][6] }}
                              />
                              <Text size="sm" color="dimmed">
                                {character.status} - {character.species}
                              </Text>
                            </Group>
                            <Text size="sm" color="dimmed" mt={5}>
                              <Text component="span" weight={500}>
                                Origin:
                              </Text>{" "}
                              {character.origin.name}
                            </Text>
                            <Box className={classes.characterMeta} mt="md">
                              <Group position="apart">
                                <Text className={cx(classes.statusBadge, getStatusClass(character.status))}>
                                  {character.status}
                                </Text>
                                <Text className={classes.genderBadge}>{character.gender}</Text>
                              </Group>
                            </Box>
                          </Box>
                        </Card>
                      </motion.div>
                    </Grid.Col>
                  ))}
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>

          {sortedResults.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Paper withBorder p="xl" radius="md" className={classes.noResults}>
                <Title order={3} mb="md">
                  No characters found
                </Title>
                <Text color="dimmed">Try a different search term or clear your filters</Text>
                <Button onClick={handleSearchClear} mt="lg" variant="outline">
                  Clear search
                </Button>
              </Paper>
            </motion.div>
          )}

          {totalPages > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Group position="center" className={classes.pagination}>
                <Pagination
                  total={totalPages}
                  value={currentPage}
                  onChange={handlePageChange}
                  withEdges
                  size="lg"
                  radius="md"
                  styles={(theme) => ({
                    item: {
                      "&[data-active]": {
                        backgroundImage: `linear-gradient(135deg, ${theme.colors.primary[6]} 0%, ${theme.colors.secondary[6]} 100%)`,
                      },
                    },
                  })}
                />
              </Group>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Text color="dimmed" size="sm" align="center" mt="sm">
              Showing {sortedResults.length} of {data.info.count} characters
            </Text>
          </motion.div>
        </>
      )}
    </Container>
  )
}

export default CharacterList
