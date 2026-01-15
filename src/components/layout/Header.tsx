'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import {
  Menu,
  X,
  GraduationCap,
  User,
  ShoppingBag,
  Heart,
  LogOut,
  Settings,
  ChevronDown,
  BookOpen,
  Phone,
  Newspaper,
} from 'lucide-react'

export function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'მთავარი', href: '/' },
    { name: 'კურსები', href: '/courses', icon: BookOpen },
    { name: 'ბლოგი', href: '/blog', icon: Newspaper },
    { name: 'კონტაქტი', href: '/contact', icon: Phone },
  ]

  const userNavigation = [
    { name: 'პროფილი', href: '/profile', icon: User },
    { name: 'შეკვეთები', href: '/purchases', icon: ShoppingBag },
    { name: 'სურვილები', href: '/wishlist', icon: Heart },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/50 border-b border-slate-100'
          : 'bg-white border-b border-slate-100'
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br from-primary-500 to-primary-600',
              'shadow-lg shadow-primary-500/30',
              'group-hover:shadow-xl group-hover:shadow-primary-500/40',
              'transition-all duration-300 group-hover:scale-105'
            )}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                SoftAcademy
              </span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wider uppercase -mt-0.5">
                Online Learning
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium',
                  'text-slate-600 hover:text-primary-600',
                  'hover:bg-primary-50',
                  'transition-all duration-200'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    'flex items-center gap-3 p-2 pr-4 rounded-xl',
                    'hover:bg-slate-50 transition-all duration-200',
                    'border border-transparent',
                    userMenuOpen && 'bg-slate-50 border-slate-100'
                  )}
                >
                  <Avatar fallback={user.name} size="sm" status="online" />
                  <div className="text-left">
                    <span className="block text-sm font-semibold text-slate-900">{user.name}</span>
                    <span className="block text-xs text-slate-500">
                      {user.role === 'ADMIN' ? 'ადმინისტრატორი' : 'მომხმარებელი'}
                    </span>
                  </div>
                  <ChevronDown className={cn(
                    'w-4 h-4 text-slate-400 transition-transform duration-200',
                    userMenuOpen && 'rotate-180'
                  )} />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className={cn(
                      'absolute right-0 top-full mt-2 w-64',
                      'bg-white rounded-2xl shadow-xl',
                      'border border-slate-100',
                      'py-2 z-20',
                      'animate-scale-in origin-top-right'
                    )}>
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-slate-100 mb-2">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email || user.phone}</p>
                      </div>

                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg',
                            'text-slate-700 hover:bg-slate-50',
                            'transition-colors duration-150'
                          )}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <item.icon className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      ))}

                      {user.role === 'ADMIN' && (
                        <>
                          <hr className="my-2 mx-4 border-slate-100" />
                          <Link
                            href="/admin"
                            className={cn(
                              'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg',
                              'text-primary-600 hover:bg-primary-50',
                              'transition-colors duration-150'
                            )}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span className="text-sm font-medium">ადმინ პანელი</span>
                          </Link>
                        </>
                      )}

                      <hr className="my-2 mx-4 border-slate-100" />
                      <button
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                        }}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg w-[calc(100%-16px)]',
                          'text-red-600 hover:bg-red-50',
                          'transition-colors duration-150'
                        )}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">გასვლა</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">შესვლა</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">რეგისტრაცია</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              'lg:hidden p-2 rounded-xl',
              'hover:bg-slate-100 transition-colors duration-200'
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 animate-slide-down">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl',
                    'text-slate-600 hover:text-primary-600',
                    'hover:bg-primary-50 font-medium',
                    'transition-colors duration-150'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  {item.name}
                </Link>
              ))}

              {user ? (
                <>
                  <hr className="my-3 border-slate-100" />

                  {/* User info */}
                  <div className="px-4 py-2 mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar fallback={user.name} size="md" status="online" />
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email || user.phone}</p>
                      </div>
                    </div>
                  </div>

                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl',
                        'text-slate-600 hover:text-primary-600',
                        'hover:bg-slate-50',
                        'transition-colors duration-150'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl',
                        'text-primary-600 hover:bg-primary-50',
                        'transition-colors duration-150'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      ადმინ პანელი
                    </Link>
                  )}

                  <hr className="my-3 border-slate-100" />

                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl w-full',
                      'text-red-600 hover:bg-red-50',
                      'transition-colors duration-150'
                    )}
                  >
                    <LogOut className="w-5 h-5" />
                    გასვლა
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-3 border-slate-100" />
                  <div className="px-4 flex flex-col gap-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" fullWidth>შესვლა</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button fullWidth>რეგისტრაცია</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
