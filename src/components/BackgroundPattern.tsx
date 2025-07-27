import React from 'react'
import { motion } from 'framer-motion'

const BackgroundPattern: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      
      {/* Floating circles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-20"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-20"
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-1/2 right-1/3 w-16 h-16 bg-pink-200 rounded-full opacity-20"
        animate={{
          y: [-15, 15, -15],
          x: [-5, 5, -5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-grid-pattern bg-[length:50px_50px]" />
      </div>
    </div>
  )
}

export default BackgroundPattern