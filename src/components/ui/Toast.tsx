'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (type: ToastType, message: string, title?: string, duration?: number) => void
  removeToast: (id: string) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
  position?: ToastPosition
}

export function ToastProvider({ children, position = 'bottom-right' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string, title?: string, duration: number = 5000) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, type, message, title, duration }])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((message: string, title?: string) => {
    addToast('success', message, title)
  }, [addToast])

  const error = useCallback((message: string, title?: string) => {
    addToast('error', message, title)
  }, [addToast])

  const info = useCallback((message: string, title?: string) => {
    addToast('info', message, title)
  }, [addToast])

  const warning = useCallback((message: string, title?: string) => {
    addToast('warning', message, title)
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} position={position} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const positions: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
}

function ToastContainer({
  toasts,
  removeToast,
  position,
}: {
  toasts: Toast[]
  removeToast: (id: string) => void
  position: ToastPosition
}) {
  if (toasts.length === 0) return null

  return (
    <div className={cn('fixed z-[100] flex flex-col gap-3', positions[position])}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const config = {
    success: {
      icon: CheckCircle,
      bgClass: 'bg-white border-emerald-200',
      iconBgClass: 'bg-emerald-100',
      iconClass: 'text-emerald-600',
      titleClass: 'text-emerald-900',
      progressClass: 'bg-emerald-500',
    },
    error: {
      icon: AlertCircle,
      bgClass: 'bg-white border-red-200',
      iconBgClass: 'bg-red-100',
      iconClass: 'text-red-600',
      titleClass: 'text-red-900',
      progressClass: 'bg-red-500',
    },
    info: {
      icon: Info,
      bgClass: 'bg-white border-primary-200',
      iconBgClass: 'bg-primary-100',
      iconClass: 'text-primary-600',
      titleClass: 'text-primary-900',
      progressClass: 'bg-primary-500',
    },
    warning: {
      icon: AlertTriangle,
      bgClass: 'bg-white border-amber-200',
      iconBgClass: 'bg-amber-100',
      iconClass: 'text-amber-600',
      titleClass: 'text-amber-900',
      progressClass: 'bg-amber-500',
    },
  }

  const { icon: Icon, bgClass, iconBgClass, iconClass, titleClass, progressClass } = config[toast.type]

  return (
    <div
      className={cn(
        'relative flex items-start gap-4 p-4 rounded-xl border shadow-lg',
        'min-w-[320px] max-w-md',
        'animate-slide-up',
        'backdrop-blur-xl',
        bgClass
      )}
      role="alert"
    >
      {/* Icon */}
      <div className={cn(
        'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
        iconBgClass
      )}>
        <Icon className={cn('w-5 h-5', iconClass)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        {toast.title && (
          <p className={cn('font-semibold text-sm mb-0.5', titleClass)}>
            {toast.title}
          </p>
        )}
        <p className="text-sm text-slate-600 leading-relaxed">
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className={cn(
          'flex-shrink-0 p-1.5 -m-1 rounded-lg',
          'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400'
        )}
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
          <div
            className={cn(
              'h-full origin-left animate-[shrink_linear]',
              progressClass
            )}
            style={{
              animation: `shrink ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  )
}

// Simple toast for standalone use
interface SimpleToastProps {
  type: ToastType
  message: string
  title?: string
  onClose?: () => void
  className?: string
}

export function SimpleToast({ type, message, title, onClose, className }: SimpleToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  }

  const iconColors = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    info: 'text-primary-500',
    warning: 'text-amber-500',
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border',
        colors[type],
        className
      )}
      role="alert"
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColors[type])} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 -m-1 rounded hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
