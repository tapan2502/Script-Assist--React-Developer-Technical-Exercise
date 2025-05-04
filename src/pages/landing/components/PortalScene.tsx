"use client"

import { useEffect, useRef } from "react"
import { Box, createStyles } from "@mantine/core"
import { motion } from "framer-motion"

const useStyles = createStyles((theme) => ({
  canvasContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
  },
  canvas: {
    width: "100%",
    height: "100%",
  },
  portalGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${theme.colors.primary[3]} 0%, ${theme.colors.primary[5]} 30%, rgba(17, 161, 255, 0) 70%)`,
    filter: "blur(20px)",
    opacity: 0.8,
    zIndex: 1,
  },
  portalRing: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    border: `15px solid ${theme.colors.primary[5]}`,
    boxShadow: `0 0 50px ${theme.colors.primary[3]}, inset 0 0 30px ${theme.colors.primary[3]}`,
    zIndex: 2,
  },
}))

const PortalScene = () => {
  const { classes } = useStyles()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 2
        this.speedY = (Math.random() - 0.5) * 2
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = 200
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation function
    const animate = () => {
      if (!ctx) return

      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw portal effect
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxRadius = 150

      // Create radial gradient for portal
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius)

      gradient.addColorStop(0, "rgba(17, 255, 129, 0.6)") // Green center
      gradient.addColorStop(0.5, "rgba(17, 161, 255, 0.3)") // Blue middle
      gradient.addColorStop(1, "rgba(17, 161, 255, 0)") // Transparent edge

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2)
      ctx.fill()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <Box className={classes.canvasContainer}>
      <canvas ref={canvasRef} className={classes.canvas} />
      <motion.div
        className={classes.portalGlow}
        animate={{
          opacity: [0.6, 0.9, 0.6],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={classes.portalRing}
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </Box>
  )
}

export default PortalScene
