'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/context/AuthContext'
import { Mail, Phone, ArrowRight, Lock, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

type LoginMethod = 'email' | 'phone'

export function LoginForm() {
  const router = useRouter()
  const { refresh } = useAuth()
  const { addToast } = useToast()

  const [method, setMethod] = useState<LoginMethod>('email')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })

      const data = await res.json()

      if (res.ok) {
        addToast('success', 'წარმატებით შეხვედით')
        await refresh()
        router.push('/')
      } else {
        addToast('error', data.error || 'შესვლის შეცდომა')
      }
    } catch {
      addToast('error', 'შესვლის შეცდომა')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOTP = async () => {
    if (!phone) {
      addToast('error', 'გთხოვთ შეიყვანოთ ტელეფონის ნომერი')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, type: 'LOGIN' }),
      })

      const data = await res.json()

      if (res.ok) {
        setOtpSent(true)
        addToast('success', 'კოდი გაიგზავნა')
      } else {
        addToast('error', data.error || 'კოდის გაგზავნის შეცდომა')
      }
    } catch {
      addToast('error', 'კოდის გაგზავნის შეცდომა')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      })

      const data = await res.json()

      if (res.ok) {
        addToast('success', 'წარმატებით შეხვედით')
        await refresh()
        router.push('/')
      } else {
        addToast('error', data.error || 'არასწორი კოდი')
      }
    } catch {
      addToast('error', 'დადასტურების შეცდომა')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Method Toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => setMethod('email')}
          className={cn(
            "flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all",
            method === 'email'
              ? "bg-white text-primary-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Mail className="w-4 h-4" />
          <span>ელ-ფოსტა</span>
        </button>
        <button
          type="button"
          onClick={() => setMethod('phone')}
          className={cn(
            "flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all",
            method === 'phone'
              ? "bg-white text-primary-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Phone className="w-4 h-4" />
          <span>ტელეფონი</span>
        </button>
      </div>

      {method === 'email' ? (
        <form onSubmit={handleEmailLogin} className="space-y-5">
          <Input
            label="ელ-ფოსტა"
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="your@email.com"
            leftIcon={<Mail className="w-5 h-5" />}
            required
          />
          <Input
            label="პაროლი"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="შეიყვანეთ პაროლი"
            leftIcon={<Lock className="w-5 h-5" />}
            required
          />

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              დაგავიწყდათ პაროლი?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={loading}
            variant="gradient"
          >
            შესვლა
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          {!otpSent ? (
            <>
              <Input
                label="ტელეფონის ნომერი"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+995 555 123 456"
                leftIcon={<Phone className="w-5 h-5" />}
              />
              <Button
                type="button"
                onClick={handleSendOTP}
                fullWidth
                size="lg"
                isLoading={loading}
                variant="gradient"
              >
                კოდის გაგზავნა
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-primary-600" />
                </div>
                <p className="text-sm text-slate-600">
                  ვერიფიკაციის კოდი გაიგზავნა ნომერზე
                </p>
                <p className="font-semibold text-slate-800">{phone}</p>
              </div>

              <Input
                label="ვერიფიკაციის კოდი"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="შეიყვანეთ 6-ნიშნა კოდი"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={loading}
                variant="gradient"
              >
                დადასტურება
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-primary-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                ხელახლა გაგზავნა
              </button>
            </form>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-slate-400">ან</span>
        </div>
      </div>

      {/* Register Link */}
      <p className="text-center text-slate-600">
        არ გაქვთ ანგარიში?{' '}
        <Link
          href="/register"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          რეგისტრაცია
        </Link>
      </p>
    </div>
  )
}
