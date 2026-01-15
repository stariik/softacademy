'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'gradient'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    fullWidth,
    children,
    disabled,
    ...props
  }, ref) => {
    const variants = {
      primary: cn(
        'bg-gradient-to-r from-primary-600 to-primary-500 text-white',
        'shadow-lg shadow-primary-500/25',
        'hover:from-primary-700 hover:to-primary-600 hover:shadow-xl hover:shadow-primary-500/30',
        'hover:-translate-y-0.5 active:translate-y-0',
        'focus:ring-primary-500/50'
      ),
      secondary: cn(
        'bg-white text-primary-600 border-2 border-primary-200',
        'hover:bg-primary-50 hover:border-primary-300 hover:-translate-y-0.5',
        'active:translate-y-0',
        'focus:ring-primary-500/30'
      ),
      ghost: cn(
        'text-slate-600 bg-transparent',
        'hover:bg-slate-100 hover:text-slate-900',
        'focus:ring-slate-400/30'
      ),
      danger: cn(
        'bg-gradient-to-r from-red-600 to-red-500 text-white',
        'shadow-lg shadow-red-500/25',
        'hover:from-red-700 hover:to-red-600 hover:shadow-xl hover:shadow-red-500/30',
        'hover:-translate-y-0.5 active:translate-y-0',
        'focus:ring-red-500/50'
      ),
      success: cn(
        'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white',
        'shadow-lg shadow-emerald-500/25',
        'hover:from-emerald-700 hover:to-emerald-600 hover:shadow-xl hover:shadow-emerald-500/30',
        'hover:-translate-y-0.5 active:translate-y-0',
        'focus:ring-emerald-500/50'
      ),
      outline: cn(
        'bg-transparent text-slate-700 border-2 border-slate-200',
        'hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5',
        'active:translate-y-0',
        'focus:ring-slate-400/30'
      ),
      gradient: cn(
        'bg-gradient-to-r from-primary-600 via-purple-500 to-pink-500 text-white',
        'shadow-lg shadow-purple-500/25',
        'hover:shadow-xl hover:shadow-purple-500/30',
        'hover:-translate-y-0.5 active:translate-y-0',
        'focus:ring-purple-500/50',
        'animate-shimmer bg-[length:200%_100%]'
      ),
    }

    const sizes = {
      xs: 'px-3 py-1.5 text-xs gap-1.5',
      sm: 'px-4 py-2 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
      xl: 'px-8 py-4 text-lg gap-2.5',
    }

    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className={cn('animate-spin', iconSizes[size])} />
        ) : leftIcon ? (
          <span className={iconSizes[size]}>{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && (
          <span className={iconSizes[size]}>{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

// Icon Button variant
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: cn(
        'bg-primary-600 text-white',
        'hover:bg-primary-700',
        'focus:ring-primary-500/50'
      ),
      secondary: cn(
        'bg-white text-primary-600 border border-primary-200',
        'hover:bg-primary-50 hover:border-primary-300',
        'focus:ring-primary-500/30'
      ),
      ghost: cn(
        'text-slate-500 bg-transparent',
        'hover:bg-slate-100 hover:text-slate-700',
        'focus:ring-slate-400/30'
      ),
      danger: cn(
        'text-red-500 bg-transparent',
        'hover:bg-red-50 hover:text-red-600',
        'focus:ring-red-500/30'
      ),
    }

    const sizes = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'

export { Button, IconButton }
