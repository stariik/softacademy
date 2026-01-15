'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  removable?: boolean
  onRemove?: () => void
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    dot,
    removable,
    onRemove,
    children,
    ...props
  }, ref) => {
    const variants = {
      default: cn(
        'bg-slate-100 text-slate-700',
        'ring-1 ring-slate-200'
      ),
      primary: cn(
        'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700',
        'ring-1 ring-primary-200'
      ),
      secondary: cn(
        'bg-slate-800 text-white',
        'ring-1 ring-slate-700'
      ),
      success: cn(
        'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700',
        'ring-1 ring-emerald-200'
      ),
      warning: cn(
        'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700',
        'ring-1 ring-amber-200'
      ),
      error: cn(
        'bg-gradient-to-r from-red-50 to-red-100 text-red-700',
        'ring-1 ring-red-200'
      ),
      outline: cn(
        'bg-transparent text-slate-600',
        'ring-2 ring-slate-200'
      ),
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1.5 text-sm',
    }

    const dotSizes = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-semibold',
          'transition-all duration-200',
          variants[variant],
          sizes[size],
          removable && 'pr-1',
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'rounded-full',
              dotSizes[size],
              variant === 'success' && 'bg-emerald-500',
              variant === 'warning' && 'bg-amber-500',
              variant === 'error' && 'bg-red-500',
              variant === 'primary' && 'bg-primary-500',
              (variant === 'default' || variant === 'outline') && 'bg-slate-400',
              variant === 'secondary' && 'bg-slate-400'
            )}
          />
        )}
        {children}
        {removable && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.()
            }}
            className={cn(
              'ml-0.5 rounded-full p-0.5',
              'hover:bg-black/10 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-1'
            )}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// Status Badge with animated dot
interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: 'online' | 'offline' | 'away' | 'busy'
}

const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, children, ...props }, ref) => {
    const statusColors = {
      online: 'bg-emerald-500',
      offline: 'bg-slate-400',
      away: 'bg-amber-500',
      busy: 'bg-red-500',
    }

    const statusLabels = {
      online: 'Online',
      offline: 'Offline',
      away: 'Away',
      busy: 'Busy',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
          'bg-white ring-1 ring-slate-200 text-sm font-medium text-slate-700',
          className
        )}
        {...props}
      >
        <span className="relative flex h-2.5 w-2.5">
          {status === 'online' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', statusColors[status])} />
        </span>
        {children || statusLabels[status]}
      </span>
    )
  }
)

StatusBadge.displayName = 'StatusBadge'

// Count Badge - for notifications, etc.
interface CountBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  count: number
  max?: number
  variant?: 'primary' | 'error' | 'success'
}

const CountBadge = forwardRef<HTMLSpanElement, CountBadgeProps>(
  ({ className, count, max = 99, variant = 'error', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary-600 text-white',
      error: 'bg-red-500 text-white',
      success: 'bg-emerald-500 text-white',
    }

    const displayCount = count > max ? `${max}+` : count

    if (count === 0) return null

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5',
          'rounded-full text-xs font-bold',
          'animate-scale-in',
          variants[variant],
          className
        )}
        {...props}
      >
        {displayCount}
      </span>
    )
  }
)

CountBadge.displayName = 'CountBadge'

export { Badge, StatusBadge, CountBadge }
