"use client"

import { useState, useEffect } from "react"
import { Box, createStyles, rem, Text, Group, Badge } from "@mantine/core"
import { motion } from "framer-motion"
import axios from "axios"

const useStyles = createStyles((theme) => ({
  showcaseContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing.xl,
  },

  charactersRow: {
    display: "flex",
    gap: theme.spacing.md,
    width: "100%",
    overflowX: "hidden",
    padding: theme.spacing.md,

    [theme.fn.smallerThan("sm")]: {
      gap: theme.spacing.xs,
    },
  },

  characterCard: {
    minWidth: rem(200),
    borderRadius: theme.radius.md,
    overflow: "hidden",
    boxShadow: theme.shadows.md,
    background: theme.white,
    flexShrink: 0,

    [theme.fn.smallerThan("sm")]: {
      minWidth: rem(150),
    },
  },

  characterImage: {
    width: "100%",
    height: rem(200),
    objectFit: "cover",

    [theme.fn.smallerThan("sm")]: {
      height: rem(150),
    },
  },

  characterInfo: {
    padding: theme.spacing.sm,
  },

  characterName: {
    fontSize: rem(16),
    fontWeight: 700,
    marginBottom: theme.spacing.xs,
  },

  badge: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}))

interface Character {
  id: number
  name: string
  status: string
  species: string
  image: string
}

const CharacterShowcase = () => {
  const { classes, theme } = useStyles()
  const [characters, setCharacters] = useState<Character[]>([])
  
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        // Get 20 random characters
        const ids = Array.from({ length: 20 }, () => Math.floor(Math.random() * 826) + 1)
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${ids.join(',')}`)
        setCharacters(response.data)
      } catch (error) {
        console.error('Error fetching characters:', error)
      }
    }
    
    fetchCharacters()
  }, [])
  
  // Split characters into two rows
  const firstRow = characters.slice(0, 10)
  const secondRow = characters.slice(10)
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'green';
      case 'dead':
        return 'red';
      default:
        return 'gray';
    }
  }
  
  
  return (
    <Box className={classes.showcaseContainer}>
      <Box className={classes.charactersRow}>
        <motion.div
          initial={{ x: -1000 }}
          animate={{ x: 0 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ display: 'flex', gap: theme.spacing.md }}
        >
          {firstRow.map((character) => (
            <Box key={character.id} className={classes.characterCard}>
              <img src={character.image || "/placeholder.svg"} alt={character.name} className={classes.characterImage} />
              <Box className={classes.characterInfo}>
                <Text className={classes.characterName}>{character.name}</Text>
                <Group position="apart">
                  <Badge color={getStatusColor(character.status)} className={classes.badge}>
                    {character.status}
                  </Badge>
                  <Text size="xs" color="dimmed">{character.species}</Text>
                </Group>
              </Box>
            </Box>
          ))}
          {/* Duplicate for infinite scroll effect */}
          {firstRow.map((character) => (
            <Box key={`dup-${character.id}`} className={classes.characterCard}>
              <img src={character.image || "/placeholder.svg"} alt={character.name} className={classes.characterImage} />
              <Box className={classes.characterInfo}>
                <Text className={classes.characterName}>{character.name}</Text>
                <Group position="apart">
                  <Badge color={getStatusColor(character.status)} className={classes.badge}>
                    {character.status}
                  </Badge>
                  <Text size="xs" color="dimmed">{character.species}</Text>
                </Group>
              </Box>
            </Box>
          ))}
        </motion.div>
      </Box>
      
      <Box className={classes.charactersRow}>
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: -1000 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ display: 'flex', gap: theme.spacing.md }}
        >
          {secondRow.map((character) => (
            <Box key={character.id} className={classes.characterCard}>
              <img src={character.image || "/placeholder.svg"} alt={character.name} className={classes.characterImage} />
              <Box className={classes.characterInfo}>
                <Text className={classes.characterName}>{character.name}</Text>
                <Group position="apart">
                  <Badge color={getStatusColor(character.status)} className={classes.badge}>
                    {character.status}
                  </Badge>
                  <Text size="xs" color="dimmed">{character.species}</Text>
                </Group>
              </Box>
            </Box>
          ))}
          {/* Duplicate for infinite scroll effect */}
          {secondRow.map((character) => (
            <Box key={`dup-${character.id}`} className={classes.characterCard}>
              <img src={character.image || "/placeholder.svg"} alt={character.name} className={classes.characterImage} />
              <Box className={classes.characterInfo}>
                <Text className={classes.characterName}>{character.name}</Text>
                <Group position="apart">
                  <Badge color={getStatusColor(character.status)} className={classes.badge}>
                    {character.status}
                  </Badge>
                  <Text size="xs" color="dimmed">{character.species}</Text>
                </Group>
              </Box>
            </Box>
          ))}
        </motion.div>
      </Box>
    </Box>
  )
}

export default CharacterShowcase
