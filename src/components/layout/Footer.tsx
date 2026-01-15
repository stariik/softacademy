'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  Heart,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')

  const navigation = {
    main: [
      { name: 'მთავარი', href: '/' },
      { name: 'კურსები', href: '/courses' },
      { name: 'ბლოგი', href: '/blog' },
      { name: 'კონტაქტი', href: '/contact' },
    ],
    categories: [
      { name: 'პროგრამირება', href: '/categories/programming' },
      { name: 'დიზაინი', href: '/categories/design' },
      { name: 'მარკეტინგი', href: '/categories/marketing' },
      { name: 'ბიზნესი', href: '/categories/business' },
    ],
    support: [
      { name: 'დახმარება', href: '/help' },
      { name: 'კონფიდენციალურობა', href: '/privacy' },
      { name: 'წესები და პირობები', href: '/terms' },
    ],
    social: [
      { name: 'Facebook', href: '#', icon: Facebook },
      { name: 'Instagram', href: '#', icon: Instagram },
      { name: 'LinkedIn', href: '#', icon: Linkedin },
      { name: 'YouTube', href: '#', icon: Youtube },
    ],
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription
    setEmail('')
  }

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Decorative top border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      {/* Newsletter section */}
      <div className="border-b border-slate-800">
        <div className="container-custom py-12 lg:py-16">
          <div className={cn(
            'relative overflow-hidden rounded-3xl',
            'bg-gradient-to-br from-primary-600 to-primary-700',
            'p-8 lg:p-12'
          )}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
            </div>

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  გამოიწერე სიახლეები
                </h3>
                <p className="text-primary-100 max-w-md">
                  მიიღე ინფორმაცია ახალი კურსებისა და ფასდაკლებების შესახებ პირდაპირ ელ-ფოსტაზე
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="შეიყვანეთ ელ-ფოსტა"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="sm:w-72 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="bg-white text-primary-600 hover:bg-primary-50 border-0"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    გამოწერა
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                'bg-gradient-to-br from-primary-500 to-primary-600',
                'shadow-lg shadow-primary-500/30',
                'group-hover:shadow-xl group-hover:shadow-primary-500/40',
                'transition-all duration-300 group-hover:scale-105'
              )}>
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">SoftAcademy</span>
                <span className="block text-xs text-slate-400 font-medium tracking-wider uppercase">
                  Online Learning
                </span>
              </div>
            </Link>

            <p className="text-slate-400 mb-6 leading-relaxed">
              ონლაინ სასწავლო პლატფორმა, სადაც შეგიძლიათ შეიძინოთ და გაიაროთ
              პროფესიონალური კურსები საუკეთესო ლექტორებთან.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a
                href="mailto:info@softacademy.ge"
                className={cn(
                  'flex items-center gap-3 text-slate-400',
                  'hover:text-primary-400 transition-colors duration-200',
                  'group'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center',
                  'bg-slate-800 group-hover:bg-primary-500/10',
                  'transition-colors duration-200'
                )}>
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@softacademy.ge</span>
              </a>
              <a
                href="tel:+995555123456"
                className={cn(
                  'flex items-center gap-3 text-slate-400',
                  'hover:text-primary-400 transition-colors duration-200',
                  'group'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center',
                  'bg-slate-800 group-hover:bg-primary-500/10',
                  'transition-colors duration-200'
                )}>
                  <Phone className="w-4 h-4" />
                </div>
                <span>+995 555 123 456</span>
              </a>
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-800">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>თბილისი, საქართველო</span>
              </div>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="font-semibold text-white mb-4">ნავიგაცია</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-slate-400 hover:text-primary-400',
                      'transition-colors duration-200',
                      'inline-flex items-center gap-1 group'
                    )}
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories column */}
          <div>
            <h3 className="font-semibold text-white mb-4">კატეგორიები</h3>
            <ul className="space-y-3">
              {navigation.categories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-slate-400 hover:text-primary-400',
                      'transition-colors duration-200',
                      'inline-flex items-center gap-1 group'
                    )}
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h3 className="font-semibold text-white mb-4">დახმარება</h3>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-slate-400 hover:text-primary-400',
                      'transition-colors duration-200',
                      'inline-flex items-center gap-1 group'
                    )}
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social column */}
          <div>
            <h3 className="font-semibold text-white mb-4">გამოგვყევი</h3>
            <div className="flex flex-wrap gap-2">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    'bg-slate-800 text-slate-400',
                    'hover:bg-primary-500 hover:text-white',
                    'transition-all duration-200',
                    'hover:scale-110'
                  )}
                  aria-label={item.name}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} SoftAcademy. ყველა უფლება დაცულია.
            </p>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              შექმნილია <Heart className="w-4 h-4 text-red-500 fill-red-500" /> საქართველოში
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
