'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient'
  hover?: boolean
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover, interactive, padding = 'none', children, ...props }, ref) => {
    const variants = {
      default: cn(
        'bg-white border border-slate-100',
        'shadow-sm'
      ),
      elevated: cn(
        'bg-white border border-slate-100',
        'shadow-lg shadow-slate-200/50'
      ),
      outlined: cn(
        'bg-white border-2 border-slate-200',
        'shadow-none'
      ),
      glass: cn(
        'bg-white/70 backdrop-blur-xl',
        'border border-white/20',
        'shadow-lg shadow-slate-200/30'
      ),
      gradient: cn(
        'bg-gradient-to-br from-white to-slate-50',
        'border border-slate-100',
        'shadow-lg shadow-slate-200/50'
      ),
    }

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl overflow-hidden',
          'transition-all duration-300 ease-out',
          variants[variant],
          paddings[padding],
          hover && [
            'hover:shadow-xl hover:shadow-primary-500/10',
            'hover:border-primary-100',
            'hover:-translate-y-1',
          ],
          interactive && [
            'cursor-pointer',
            'hover:shadow-xl hover:shadow-primary-500/10',
            'hover:border-primary-100',
            'hover:-translate-y-1',
            'active:translate-y-0 active:shadow-lg',
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-6 py-5 border-b border-slate-100',
        'bg-gradient-to-r from-slate-50/50 to-transparent',
        className
      )}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'text-lg font-semibold text-slate-900 tracking-tight',
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm text-slate-500 mt-1',
        className
      )}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-5', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 border-t border-slate-100',
        'bg-gradient-to-r from-slate-50 to-slate-50/50',
        className
      )}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

// Feature Card - for showcasing features with icons
interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description: string
}

const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, icon, title, description, ...props }, ref) => (
    <Card
      ref={ref}
      hover
      className={cn('p-6 group', className)}
      {...props}
    >
      {icon && (
        <div className={cn(
          'w-12 h-12 rounded-xl mb-4',
          'bg-gradient-to-br from-primary-500 to-primary-600',
          'flex items-center justify-center text-white',
          'shadow-lg shadow-primary-500/30',
          'group-hover:scale-110 transition-transform duration-300'
        )}>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </Card>
  )
)
FeatureCard.displayName = 'FeatureCard'

// Stat Card - for displaying statistics
interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: React.ReactNode
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, icon, ...props }, ref) => (
    <Card
      ref={ref}
      variant="elevated"
      className={cn('p-6', className)}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          {change && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm font-medium',
              change.type === 'increase' ? 'text-emerald-600' : 'text-red-600'
            )}>
              <span>{change.type === 'increase' ? '↑' : '↓'}</span>
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            'w-12 h-12 rounded-xl',
            'bg-gradient-to-br from-primary-50 to-primary-100',
            'flex items-center justify-center text-primary-600'
          )}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
)
StatCard.displayName = 'StatCard'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, FeatureCard, StatCard }
