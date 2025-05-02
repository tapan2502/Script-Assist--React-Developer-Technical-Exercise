import axios from "axios"

// The main Rick and Morty API endpoint
const BASE_URL = "https://rickandmortyapi.com/api"

// Create axios instance with configuration
const rmClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export interface PaginatedResponse<T> {
  info: {
    count: number
    pages: number
    next: string | null
    prev: string | null
  }
  results: T[]
}

export interface Character {
  id: number
  name: string
  status: string
  species: string
  type: string
  gender: string
  origin: {
    name: string
    url: string
  }
  location: {
    name: string
    url: string
  }
  image: string
  episode: string[]
  url: string
  created: string
}

export interface Location {
  id: number
  name: string
  type: string
  dimension: string
  residents: string[]
  url: string
  created: string
}

export interface Episode {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}

// Fetch characters with optional filters
export const fetchCharacters = async (page = 1, name = ""): Promise<PaginatedResponse<Character>> => {
  const params: Record<string, string> = { page: page.toString() }
  if (name) params.name = name

  const response = await rmClient.get<PaginatedResponse<Character>>("/character", { params })
  return response.data
}

// Fetch a single character by ID
export const fetchCharacter = async (id: string): Promise<Character> => {
  const response = await rmClient.get<Character>(`/character/${id}`)
  return response.data
}

// Fetch a location by URL or ID
export const fetchLocation = async (urlOrId: string): Promise<Location> => {
  // If full URL is provided, extract the ID
  const id = urlOrId.includes("location/") ? urlOrId.split("location/")[1] : urlOrId

  const response = await rmClient.get<Location>(`/location/${id}`)
  return response.data
}

// Fetch an episode by URL or ID
export const fetchEpisode = async (urlOrId: string): Promise<Episode> => {
  // If full URL is provided, extract the ID
  const id = urlOrId.includes("episode/") ? urlOrId.split("episode/")[1] : urlOrId

  const response = await rmClient.get<Episode>(`/episode/${id}`)
  return response.data
}

// Fetch multiple episodes by IDs
export const fetchMultipleEpisodes = async (ids: string[]): Promise<Episode[]> => {
  const response = await rmClient.get<Episode[]>(`/episode/${ids.join(",")}`)
  return Array.isArray(response.data) ? response.data : [response.data]
}

// Helper to extract ID from URL
export const extractIdFromUrl = (url: string): string => {
  const matches = url.match(/\/(\d+)$/)
  return matches ? matches[1] : ""
}
