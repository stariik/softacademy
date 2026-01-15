'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/context/AuthContext'
import { Mail, Phone, ArrowRight, User, Lock, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type RegisterMethod = 'email' | 'phone'

export function RegisterForm() {
  const router = useRouter()
  const { refresh } = useAuth()
  const { addToast } = useToast()

  const [method, setMethod] = useState<RegisterMethod>('email')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordStrength = () => {
    if (password.length === 0) return 0
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const strengthLevel = passwordStrength()
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-emerald-500']
  const strengthTexts = ['ძალიან სუსტი', 'სუსტი', 'საშუალო', 'კარგი', 'ძლიერი']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      addToast('error', 'პაროლები არ ემთხვევა')
      return
    }

    if (password.length < 6) {
      addToast('error', 'პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: method === 'email' ? email : undefined,
          phone: method === 'phone' ? phone : undefined,
          password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        addToast('success', 'რეგისტრაცია წარმატებულია')
        await refresh()
        router.push('/')
      } else {
        addToast('error', data.error || 'რეგისტრაციის შეცდომა')
      }
    } catch {
      addToast('error', 'რეგისტრაციის შეცდომა')
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="სახელი და გვარი"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="გიორგი გიორგაძე"
          leftIcon={<User className="w-5 h-5" />}
          required
        />

        {method === 'email' ? (
          <Input
            label="ელ-ფოსტა"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            leftIcon={<Mail className="w-5 h-5" />}
            required
          />
        ) : (
          <Input
            label="ტელეფონის ნომერი"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+995 555 123 456"
            leftIcon={<Phone className="w-5 h-5" />}
            required
          />
        )}

        <div className="space-y-2">
          <Input
            label="პაროლი"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="შექმენით პაროლი"
            leftIcon={<Lock className="w-5 h-5" />}
            required
          />
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      i < strengthLevel ? strengthColors[strengthLevel - 1] : "bg-slate-200"
                    )}
                  />
                ))}
              </div>
              <p className={cn(
                "text-xs",
                strengthLevel <= 2 ? "text-orange-600" : "text-emerald-600"
              )}>
                პაროლის სიძლიერე: {strengthTexts[strengthLevel - 1] || 'შეიყვანეთ პაროლი'}
              </p>
            </div>
          )}
        </div>

        <Input
          label="პაროლის დადასტურება"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="გაიმეორეთ პაროლი"
          leftIcon={<Lock className="w-5 h-5" />}
          success={confirmPassword.length > 0 && password === confirmPassword}
          error={confirmPassword.length > 0 && password !== confirmPassword ? 'პაროლები არ ემთხვევა' : undefined}
          required
        />

        {/* Password Requirements */}
        <div className="p-4 bg-slate-50 rounded-xl space-y-2">
          <p className="text-sm font-medium text-slate-700">პაროლის მოთხოვნები:</p>
          <div className="grid gap-2">
            {[
              { check: password.length >= 6, text: 'მინიმუმ 6 სიმბოლო' },
              { check: /[A-Z]/.test(password), text: 'ერთი დიდი ასო' },
              { check: /[0-9]/.test(password), text: 'ერთი ციფრი' },
            ].map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle
                  className={cn(
                    "w-4 h-4",
                    req.check ? "text-emerald-500" : "text-slate-300"
                  )}
                />
                <span className={req.check ? "text-emerald-700" : "text-slate-500"}>
                  {req.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={loading}
          variant="gradient"
        >
          რეგისტრაცია
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-slate-400">ან</span>
        </div>
      </div>

      {/* Login Link */}
      <p className="text-center text-slate-600">
        უკვე გაქვთ ანგარიში?{' '}
        <Link
          href="/login"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          შესვლა
        </Link>
      </p>
    </div>
  )
}
