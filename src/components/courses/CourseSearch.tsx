'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CourseSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

export function CourseSearch({
  onSearch,
  placeholder = 'კურსის ძიება...',
  className,
  debounceMs = 300
}: CourseSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, onSearch, debounceMs])

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div
      className={cn(
        "relative group",
        className
      )}
    >
      <div
        className={cn(
          "relative flex items-center rounded-xl overflow-hidden",
          "bg-white border-2 transition-all duration-300",
          isFocused
            ? "border-primary-500 shadow-lg shadow-primary-100"
            : "border-slate-200 hover:border-slate-300"
        )}
      >
        <Search
          className={cn(
            "absolute left-4 w-5 h-5 transition-colors",
            isFocused ? "text-primary-500" : "text-slate-400"
          )}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full py-3.5 pl-12 pr-10",
            "bg-transparent text-slate-800 placeholder:text-slate-400",
            "focus:outline-none"
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Animated underline effect */}
      <div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary-500 rounded-full transition-all duration-300",
          isFocused ? "w-[calc(100%-16px)]" : "w-0"
        )}
      />
    </div>
  )
}
