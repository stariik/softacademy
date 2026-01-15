'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { User } from 'lucide-react'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  fallback?: string
  status?: 'online' | 'offline' | 'away' | 'busy'
  bordered?: boolean
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({
    className,
    src,
    alt = 'Avatar',
    size = 'md',
    fallback,
    status,
    bordered,
    ...props
  }, ref) => {
    const sizes = {
      xs: 'w-6 h-6 text-[10px]',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
      '2xl': 'w-24 h-24 text-2xl',
    }

    const iconSizes = {
      xs: 12,
      sm: 14,
      md: 18,
      lg: 22,
      xl: 28,
      '2xl': 40,
    }

    const statusSizes = {
      xs: 'w-1.5 h-1.5 -right-0 -bottom-0',
      sm: 'w-2 h-2 right-0 bottom-0',
      md: 'w-2.5 h-2.5 right-0 bottom-0',
      lg: 'w-3 h-3 right-0.5 bottom-0.5',
      xl: 'w-3.5 h-3.5 right-0.5 bottom-0.5',
      '2xl': 'w-4 h-4 right-1 bottom-1',
    }

    const statusColors = {
      online: 'bg-emerald-500',
      offline: 'bg-slate-400',
      away: 'bg-amber-500',
      busy: 'bg-red-500',
    }

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex shrink-0 rounded-full',
          'overflow-hidden',
          'bg-gradient-to-br from-primary-100 to-primary-200',
          'ring-2 ring-white',
          bordered && 'ring-4 ring-primary-100',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : fallback ? (
          <span className={cn(
            'flex items-center justify-center w-full h-full',
            'font-semibold text-primary-700'
          )}>
            {getInitials(fallback)}
          </span>
        ) : (
          <span className="flex items-center justify-center w-full h-full text-primary-600">
            <User size={iconSizes[size]} />
          </span>
        )}

        {status && (
          <span
            className={cn(
              'absolute rounded-full ring-2 ring-white',
              statusSizes[size],
              statusColors[status]
            )}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

// Avatar Group
interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 4, size = 'md', children, ...props }, ref) => {
    const childArray = Array.isArray(children) ? children : [children]
    const visibleChildren = childArray.slice(0, max)
    const remainingCount = childArray.length - max

    const sizes = {
      sm: 'w-8 h-8 text-xs -space-x-2',
      md: 'w-10 h-10 text-sm -space-x-3',
      lg: 'w-12 h-12 text-base -space-x-4',
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center', sizes[size].split(' ').pop(), className)}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <div
            key={index}
            className="ring-2 ring-white rounded-full"
            style={{ zIndex: visibleChildren.length - index }}
          >
            {child}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              'flex items-center justify-center rounded-full',
              'bg-slate-100 text-slate-600 font-semibold',
              'ring-2 ring-white',
              sizes[size].split(' ').slice(0, 2).join(' ')
            )}
            style={{ zIndex: 0 }}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'

// Avatar with name
interface AvatarWithNameProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  name: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
  status?: 'online' | 'offline' | 'away' | 'busy'
}

const AvatarWithName = forwardRef<HTMLDivElement, AvatarWithNameProps>(
  ({ className, src, name, subtitle, size = 'md', status, ...props }, ref) => {
    const textSizes = {
      sm: { name: 'text-sm', subtitle: 'text-xs' },
      md: { name: 'text-sm', subtitle: 'text-xs' },
      lg: { name: 'text-base', subtitle: 'text-sm' },
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-3', className)}
        {...props}
      >
        <Avatar src={src} fallback={name} size={size} status={status} />
        <div className="min-w-0 flex-1">
          <p className={cn(
            'font-semibold text-slate-900 truncate',
            textSizes[size].name
          )}>
            {name}
          </p>
          {subtitle && (
            <p className={cn(
              'text-slate-500 truncate',
              textSizes[size].subtitle
            )}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    )
  }
)

AvatarWithName.displayName = 'AvatarWithName'

export { Avatar, AvatarGroup, AvatarWithName }
