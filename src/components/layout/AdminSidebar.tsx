'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Users,
  ShoppingCart,
  Ticket,
  MessageSquare,
  Star,
  Settings,
  ArrowLeft,
  Newspaper,
  GraduationCap,
  ChevronRight,
  LogOut,
} from 'lucide-react'

const menuGroups = [
  {
    title: 'მთავარი',
    items: [
      { name: 'დეშბორდი', href: '/admin', icon: LayoutDashboard },
    ]
  },
  {
    title: 'კონტენტი',
    items: [
      { name: 'კურსები', href: '/admin/courses', icon: BookOpen },
      { name: 'კატეგორიები', href: '/admin/categories', icon: FolderTree },
      { name: 'ბლოგი', href: '/admin/blog', icon: Newspaper },
    ]
  },
  {
    title: 'გაყიდვები',
    items: [
      { name: 'შეკვეთები', href: '/admin/orders', icon: ShoppingCart },
      { name: 'პრომოკოდები', href: '/admin/promocodes', icon: Ticket },
    ]
  },
  {
    title: 'მომხმარებლები',
    items: [
      { name: 'მომხმარებლები', href: '/admin/users', icon: Users },
      { name: 'შეფასებები', href: '/admin/reviews', icon: Star },
      { name: 'შეტყობინებები', href: '/admin/messages', icon: MessageSquare },
    ]
  },
  {
    title: 'სისტემა',
    items: [
      { name: 'პარამეტრები', href: '/admin/settings', icon: Settings },
    ]
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">SoftAcademy</span>
            <p className="text-xs text-slate-400">ადმინ პანელი</p>
          </div>
        </Link>
      </div>

      {/* Back to Site */}
      <div className="px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">საიტზე დაბრუნება</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-primary-600/20 to-blue-600/20 text-white border border-primary-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                      isActive
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'bg-white/5 group-hover:bg-white/10'
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1 font-medium">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-primary-400" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">ადმინისტრატორი</p>
            <p className="text-xs text-slate-400 truncate">admin@softacademy.ge</p>
          </div>
          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
