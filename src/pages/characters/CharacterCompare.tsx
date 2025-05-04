"use client"

import type { FC } from "react"
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
  Paper,
  Divider,
  Skeleton,
  Alert,
  Box,
  createStyles,
  rem,
  Image,
  ThemeIcon,
} from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { fetchCharacter } from "../../api/rickandmorty"
import { ArrowLeft, AlertCircle, Check, X, Dna, User, MapPin, Calendar } from "lucide-react"
import RetryButton from "../../components/RetryButton"
import { motion } from "framer-motion"

const useStyles = createStyles((theme) => ({
  container: {
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  backButton: {
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateX(-5px)",
    },
  },
  title: {
    fontSize: rem(32),
    fontWeight: 900,
    lineHeight: 1.1,
    background: `linear-gradient(135deg, ${theme.colors.primary[6]} 0%, ${theme.colors.secondary[6]} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: theme.spacing.xl,
  },
  characterCard: {
    overflow: "visible",
    height: "100%",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows.md,
    },
  },
  characterImage: {
    width: "100%",
    height: 300,
    objectFit: "cover",
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    boxShadow: theme.shadows.md,
  },
  characterName: {
    fontSize: rem(24),
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: theme.spacing.md,
    color: theme.colors.primary[7],
  },
  badge: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
  compareSection: {
    marginTop: parseInt(theme.spacing.xl) * 2,
  },
  
  compareTitle: {
    fontSize: rem(24),
    fontWeight: 700,
    marginBottom: theme.spacing.lg,
  },
  compareRow: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.fn.rgba(theme.colors.gray[0], 0.7),
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: theme.fn.rgba(theme.colors.gray[1], 0.7),
    },
  },
  compareLabel: {
    fontWeight: 600,
    color: theme.colors.gray[7],
  },
  compareValue: {
    fontWeight: 500,
  },
  matchIcon: {
    color: theme.colors.green[6],
  },
  mismatchIcon: {
    color: theme.colors.red[6],
  },
  vsText: {
    fontSize: rem(24),
    fontWeight: 700,
    textAlign: "center",
    color: theme.colors.gray[6],
  },
}))

const CharacterCompare: FC = () => {
  const { id1, id2 } = useParams<{ id1: string; id2: string }>()
  const navigate = useNavigate()
  const { classes } = useStyles()

  // Fetch first character
  const {
    data: character1,
    isLoading: isLoading1,
    isError: isError1,
    error: error1,
    refetch: refetch1,
  } = useQuery({
    queryKey: ["character", id1],
    queryFn: () => fetchCharacter(id1 || ""),
    enabled: !!id1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch second character
  const {
    data: character2,
    isLoading: isLoading2,
    isError: isError2,
    error: error2,
    refetch: refetch2,
  } = useQuery({
    queryKey: ["character", id2],
    queryFn: () => fetchCharacter(id2 || ""),
    enabled: !!id2,
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

  const isLoading = isLoading1 || isLoading2
  const isError = isError1 || isError2
  const error = error1 || error2

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
        <Title className={classes.title}>Character Comparison</Title>
        <Grid gutter="xl">
          <Grid.Col md={5}>
            <Skeleton height={300} radius="md" mb="md" />
            <Skeleton height={30} width="70%" mb="md" />
            <Skeleton height={20} width="40%" mb="md" />
            <Skeleton height={100} />
          </Grid.Col>
          <Grid.Col md={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Skeleton height={50} width={50} radius="xl" />
          </Grid.Col>
          <Grid.Col md={5}>
            <Skeleton height={300} radius="md" mb="md" />
            <Skeleton height={30} width="70%" mb="md" />
            <Skeleton height={20} width="40%" mb="md" />
            <Skeleton height={100} />
          </Grid.Col>
        </Grid>
      </Container>
    )
  }

  if (isError || !character1 || !character2) {
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
        <Group>
          {isError1 && <RetryButton onRetry={refetch1} isLoading={isLoading1} />}
          {isError2 && <RetryButton onRetry={refetch2} isLoading={isLoading2} />}
        </Group>
      </Container>
    )
  }

  const compareItems = [
    {
      label: "Status",
      value1: character1.status,
      value2: character2.status,
      icon: <User size={18} />,
    },
    {
      label: "Species",
      value1: character1.species,
      value2: character2.species,
      icon: <Dna size={18} />,
    },
    {
      label: "Gender",
      value1: character1.gender,
      value2: character2.gender,
      icon: <User size={18} />,
    },
    {
      label: "Origin",
      value1: character1.origin.name,
      value2: character2.origin.name,
      icon: <MapPin size={18} />,
    },
    {
      label: "Location",
      value1: character1.location.name,
      value2: character2.location.name,
      icon: <MapPin size={18} />,
    },
    {
      label: "Episodes",
      value1: character1.episode.length.toString(),
      value2: character2.episode.length.toString(),
      icon: <Calendar size={18} />,
    },
  ]

  return (
    <Container size="lg" py="xl" className={classes.container}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
        <Title className={classes.title}>Character Comparison</Title>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Grid gutter="xl">
          <Grid.Col md={5}>
            <Card withBorder p="lg" radius="md" className={classes.characterCard}>
              <Image
                src={character1.image || "/placeholder.svg"}
                alt={character1.name}
                className={classes.characterImage}
              />
              <Title order={2} className={classes.characterName}>
                {character1.name}
              </Title>
              <Group mb="md">
                <Badge size="lg" color={getStatusColor(character1.status)} className={classes.badge}>
                  {character1.status}
                </Badge>
                <Badge size="lg" variant="outline" className={classes.badge}>
                  {character1.species}
                </Badge>
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col md={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Text className={classes.vsText}>VS</Text>
          </Grid.Col>

          <Grid.Col md={5}>
            <Card withBorder p="lg" radius="md" className={classes.characterCard}>
              <Image
                src={character2.image || "/placeholder.svg"}
                alt={character2.name}
                className={classes.characterImage}
              />
              <Title order={2} className={classes.characterName}>
                {character2.name}
              </Title>
              <Group mb="md">
                <Badge size="lg" color={getStatusColor(character2.status)} className={classes.badge}>
                  {character2.status}
                </Badge>
                <Badge size="lg" variant="outline" className={classes.badge}>
                  {character2.species}
                </Badge>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Box className={classes.compareSection}>
          <Title order={3} className={classes.compareTitle}>
            Comparison
          </Title>
          <Divider mb="xl" />

          {compareItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Paper className={classes.compareRow} withBorder>
                <Grid align="center">
                  <Grid.Col span={2}>
                    <Group>
                      <ThemeIcon size="lg" variant="light" radius="xl">
                        {item.icon}
                      </ThemeIcon>
                      <Text className={classes.compareLabel}>{item.label}</Text>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Text className={classes.compareValue}>{item.value1}</Text>
                  </Grid.Col>
                  <Grid.Col span={2} sx={{ textAlign: "center" }}>
                    {item.value1 === item.value2 ? (
                      <Check size={24} className={classes.matchIcon} />
                    ) : (
                      <X size={24} className={classes.mismatchIcon} />
                    )}
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Text className={classes.compareValue}>{item.value2}</Text>
                  </Grid.Col>
                </Grid>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Container>
  )
}

export default CharacterCompare
