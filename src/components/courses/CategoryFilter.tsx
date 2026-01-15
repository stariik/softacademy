'use client'

import { cn } from '@/lib/utils'
import { LayoutGrid, Code, Palette, TrendingUp, Briefcase } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  _count?: {
    courses: number
  }
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string | null
  onSelect: (slug: string | null) => void
  variant?: 'pills' | 'cards'
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  programming: Code,
  design: Palette,
  marketing: TrendingUp,
  business: Briefcase,
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
  variant = 'pills'
}: CategoryFilterProps) {
  if (variant === 'cards') {
    return (
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "group relative flex items-center gap-3 px-5 py-3 rounded-xl",
            "border-2 transition-all duration-300",
            selectedCategory === null
              ? "bg-primary-50 border-primary-500 text-primary-700"
              : "bg-white border-slate-200 text-slate-600 hover:border-primary-200 hover:bg-primary-50/50"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
            selectedCategory === null
              ? "bg-primary-500 text-white"
              : "bg-slate-100 text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-500"
          )}>
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-semibold">ყველა</p>
            <p className="text-xs text-slate-400">ყველა კურსი</p>
          </div>
        </button>

        {categories.map((category) => {
          const Icon = categoryIcons[category.slug] || LayoutGrid
          const isSelected = selectedCategory === category.slug

          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.slug)}
              className={cn(
                "group relative flex items-center gap-3 px-5 py-3 rounded-xl",
                "border-2 transition-all duration-300",
                isSelected
                  ? "bg-primary-50 border-primary-500 text-primary-700"
                  : "bg-white border-slate-200 text-slate-600 hover:border-primary-200 hover:bg-primary-50/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                isSelected
                  ? "bg-primary-500 text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-500"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold">{category.name}</p>
                {category._count && (
                  <p className="text-xs text-slate-400">{category._count.courses} კურსი</p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "relative px-5 py-2.5 rounded-full text-sm font-medium",
          "transition-all duration-300 overflow-hidden",
          selectedCategory === null
            ? "bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg shadow-primary-200"
            : "bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600"
        )}
      >
        <span className="relative z-10">ყველა</span>
        {selectedCategory === null && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-blue-700 opacity-0 hover:opacity-100 transition-opacity" />
        )}
      </button>

      {categories.map((category) => {
        const isSelected = selectedCategory === category.slug

        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.slug)}
            className={cn(
              "relative px-5 py-2.5 rounded-full text-sm font-medium",
              "transition-all duration-300 overflow-hidden",
              isSelected
                ? "bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg shadow-primary-200"
                : "bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-600"
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              {category.name}
              {category._count && (
                <span className={cn(
                  "inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-xs",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                )}>
                  {category._count.courses}
                </span>
              )}
            </span>
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-blue-700 opacity-0 hover:opacity-100 transition-opacity" />
            )}
          </button>
        )
      })}
    </div>
  )
}
