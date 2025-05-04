"use client"

import { useState, useEffect } from "react"
import { Text } from "@mantine/core"

interface StatsCounterProps {
  end: number
  duration: number
  className?: string
}

const StatsCounter = ({ end, duration, className }: StatsCounterProps) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)

    return () => {
      startTimestamp = null
    }
  }, [end, duration])

  return <Text className={className}>{count}+</Text>
}

export default StatsCounter
