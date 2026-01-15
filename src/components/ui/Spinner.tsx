'use client'

import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'white' | 'slate'
  className?: string
}

export function Spinner({ size = 'md', variant = 'primary', className }: SpinnerProps) {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  const variants = {
    primary: 'border-primary-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    slate: 'border-slate-300 border-t-slate-600',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2',
        sizes[size],
        variants[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Page Spinner with backdrop
interface PageSpinnerProps {
  text?: string
  fullScreen?: boolean
}

export function PageSpinner({ text, fullScreen }: PageSpinnerProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen ? 'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm' : 'min-h-[400px]'
      )}
    >
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 rounded-full border-4 border-primary-100" />
        {/* Spinning ring */}
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-primary-600 animate-pulse" />
        </div>
      </div>
      {text && (
        <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Inline loading dots
export function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
    </span>
  )
}

// Skeleton loading placeholder
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  }

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]',
    none: '',
  }

  return (
    <div
      className={cn(
        'bg-slate-200',
        variants[variant],
        animations[animation],
        variant === 'text' && 'h-4',
        className
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  )
}

// Progress spinner with percentage
interface ProgressSpinnerProps {
  progress: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

export function ProgressSpinner({ progress, size = 'md', showValue = true }: ProgressSpinnerProps) {
  const sizes = {
    sm: { container: 'w-12 h-12', stroke: 4, text: 'text-xs' },
    md: { container: 'w-16 h-16', stroke: 5, text: 'text-sm' },
    lg: { container: 'w-24 h-24', stroke: 6, text: 'text-lg' },
  }

  const { container, stroke, text } = sizes[size]
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn('relative', container)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-200"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary-600 transition-all duration-500 ease-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-semibold text-slate-700', text)}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}
