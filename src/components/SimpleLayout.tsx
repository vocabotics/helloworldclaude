import React from 'react'
import { cn } from '@/lib/utils'

interface SimpleLayoutProps {
  children: React.ReactNode
  className?: string
  centered?: boolean
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({
  children,
  className,
  centered = true
}) => {
  return (
    <div className={cn(
      'min-h-screen w-full',
      centered && 'flex items-center justify-center',
      'bg-gradient-to-br from-gray-50 to-gray-100',
      className
    )}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  )
}

export default SimpleLayout