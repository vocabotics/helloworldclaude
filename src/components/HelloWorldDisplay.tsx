import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HelloWorldDisplayProps {
  className?: string
  animated?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'gradient' | 'outline'
}

const HelloWorldDisplay: React.FC<HelloWorldDisplayProps> = ({
  className,
  animated = true,
  size = 'large',
  variant = 'default'
}) => {
  const sizeClasses = {
    small: 'text-2xl md:text-3xl',
    medium: 'text-4xl md:text-5xl',
    large: 'text-6xl md:text-8xl'
  }

  const variantClasses = {
    default: 'text-pink-600',
    gradient: 'bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 bg-clip-text text-transparent',
    outline: 'text-transparent stroke-pink-600 stroke-2'
  }

  const textClasses = cn(
    'font-bold tracking-tight text-center',
    sizeClasses[size],
    variantClasses[variant],
    className
  )

  const content = "Hello World"

  if (animated) {
    return (
      <motion.h1
        className={textClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {content.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            {char === ' ' ? '' : char}
          </motion.span>
        ))}
      </motion.h1>
    )
  }

  return (
    <h1 className={textClasses}>
      {content}
    </h1>
  )
}

export default HelloWorldDisplay
