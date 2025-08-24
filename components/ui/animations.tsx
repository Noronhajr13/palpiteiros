"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion'
import { useRef } from 'react'

// Animação de entrada suave
interface FadeInProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  className?: string
}

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = 'up', 
  duration = 0.5,
  className = '' 
}: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
      x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animação de escala no hover
interface ScaleOnHoverProps {
  children: React.ReactNode
  scale?: number
  className?: string
}

export function ScaleOnHover({ children, scale = 1.05, className = '' }: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animação de bounce
interface BounceProps {
  children: React.ReactNode
  duration?: number
  className?: string
}

export function Bounce({ children, duration = 2, className = '' }: BounceProps) {
  return (
    <motion.div
      animate={{ 
        y: [0, -10, 0] 
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animação de pulsação
interface PulseProps {
  children: React.ReactNode
  duration?: number
  scale?: [number, number]
  className?: string
}

export function Pulse({ 
  children, 
  duration = 2, 
  scale = [1, 1.05],
  className = '' 
}: PulseProps) {
  return (
    <motion.div
      animate={{ 
        scale 
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animação de deslize lateral
interface SlideProps {
  children: React.ReactNode
  direction?: 'left' | 'right'
  distance?: number
  duration?: number
  className?: string
}

export function Slide({ 
  children, 
  direction = 'left', 
  distance = 100,
  duration = 0.5,
  className = '' 
}: SlideProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  return (
    <motion.div
      ref={ref}
      initial={{ 
        x: direction === 'left' ? -distance : distance,
        opacity: 0 
      }}
      animate={isInView ? { 
        x: 0,
        opacity: 1 
      } : {}}
      transition={{ duration }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Loading animado
interface AnimatedLoadingProps {
  type?: 'dots' | 'spinner' | 'bars' | 'wave'
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export function AnimatedLoading({ 
  type = 'dots', 
  size = 'md', 
  color = 'bg-blue-600' 
}: AnimatedLoadingProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3', 
    lg: 'w-4 h-4'
  }

  if (type === 'dots') {
    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`rounded-full ${color} ${sizeClasses[size]}`}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    )
  }

  if (type === 'spinner') {
    const spinnerSize = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    }
    
    return (
      <motion.div
        className={`border-2 border-gray-200 border-t-blue-600 rounded-full ${spinnerSize[size]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    )
  }

  if (type === 'bars') {
    return (
      <div className="flex space-x-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`${color} ${sizeClasses[size]} rounded`}
            animate={{
              scaleY: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    )
  }

  // Wave
  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`w-1 bg-blue-600 rounded-full`}
          animate={{
            height: ['4px', '20px', '4px']
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  )
}

// Contador animado
interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  suffix?: string
  className?: string
}

export function AnimatedCounter({ 
  from, 
  to, 
  duration = 2, 
  suffix = '',
  className = '' 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from)
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const endTime = startTime + duration * 1000

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (endTime - startTime), 1)
      
      setCount(Math.floor(from + (to - from) * progress))
      
      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    updateCount()
  }, [isInView, from, to, duration])

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  )
}

// Revelação progressiva de texto
interface TypewriterProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function Typewriter({ 
  text, 
  speed = 50, 
  className = '',
  onComplete 
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return <span className={className}>{displayText}</span>
}

// Progress Bar animada
interface AnimatedProgressProps {
  value: number
  max?: number
  duration?: number
  color?: string
  className?: string
  showText?: boolean
}

export function AnimatedProgress({ 
  value, 
  max = 100, 
  duration = 1,
  color = 'bg-blue-600',
  className = '',
  showText = true 
}: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration, ease: "easeOut" }}
        />
      </div>
      {showText && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          <AnimatedCounter from={0} to={Math.round(percentage)} suffix="%" />
        </div>
      )}
    </div>
  )
}

// Card com animação de flip
interface FlipCardProps {
  frontContent: React.ReactNode
  backContent: React.ReactNode
  className?: string
}

export function FlipCard({ frontContent, backContent, className = '' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ transformStyle: 'preserve-3d' }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Front */}
      <motion.div
        className="w-full h-full absolute backface-hidden"
        style={{ backfaceVisibility: 'hidden' }}
      >
        {frontContent}
      </motion.div>

      {/* Back */}
      <motion.div
        className="w-full h-full absolute backface-hidden"
        style={{ 
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)' 
        }}
      >
        {backContent}
      </motion.div>
    </motion.div>
  )
}

// Stagger animation para listas
interface StaggeredListProps {
  children: React.ReactNode[]
  delay?: number
  className?: string
}

export function StaggeredList({ children, delay = 0.1, className = '' }: StaggeredListProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * delay, duration: 0.5 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

// Shake animation para erros
interface ShakeProps {
  children: React.ReactNode
  trigger: boolean
  className?: string
}

export function Shake({ children, trigger, className = '' }: ShakeProps) {
  return (
    <motion.div
      className={className}
      animate={trigger ? {
        x: [0, -10, 10, -10, 10, 0],
      } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// Glow effect animado
interface GlowProps {
  children: React.ReactNode
  color?: string
  intensity?: number
  className?: string
}

export function Glow({ 
  children, 
  color = 'blue', 
  intensity = 1,
  className = '' 
}: GlowProps) {
  const glowColors = {
    blue: 'shadow-blue-500/50',
    green: 'shadow-green-500/50',
    purple: 'shadow-purple-500/50',
    yellow: 'shadow-yellow-500/50',
    red: 'shadow-red-500/50'
  }

  return (
    <motion.div
      className={`${className}`}
      animate={{
        boxShadow: [
          `0 0 ${5 * intensity}px ${glowColors[color as keyof typeof glowColors]}`,
          `0 0 ${20 * intensity}px ${glowColors[color as keyof typeof glowColors]}`,
          `0 0 ${5 * intensity}px ${glowColors[color as keyof typeof glowColors]}`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

// Particles background animado
export function ParticlesBackground() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-blue-500/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}