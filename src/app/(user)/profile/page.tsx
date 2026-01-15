'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react'
import { formatDateShort } from '@/lib/utils'

export default function ProfilePage() {
  const { user, refresh } = useAuth()
  const { addToast } = useToast()
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <div className="container-custom py-12 text-center">
        <p>გთხოვთ შეხვიდეთ ანგარიშზე</p>
      </div>
    )
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (res.ok) {
        addToast('success', 'პროფილი წარმატებით განახლდა')
        await refresh()
      } else {
        addToast('error', 'შეცდომა პროფილის განახლებისას')
      }
    } catch {
      addToast('error', 'შეცდომა')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">პროფილი</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar fallback={user.name} size="xl" className="mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-800">{user.name}</h2>
              <Badge variant={user.role === 'ADMIN' ? 'primary' : 'default'} className="mt-2">
                {user.role === 'ADMIN' ? 'ადმინისტრატორი' : 'მომხმარებელი'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-800">ანგარიშის ინფორმაცია</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <User className="w-5 h-5 text-primary-500" />
                <span>{user.name}</span>
              </div>
              {user.email && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-primary-500" />
                  <span>{user.email}</span>
                  {user.emailVerified ? (
                    <Badge variant="success">დადასტურებული</Badge>
                  ) : (
                    <Badge variant="warning">არ არის დადასტურებული</Badge>
                  )}
                </div>
              )}
              {user.phone && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-5 h-5 text-primary-500" />
                  <span>{user.phone}</span>
                  {user.phoneVerified ? (
                    <Badge variant="success">დადასტურებული</Badge>
                  ) : (
                    <Badge variant="warning">არ არის დადასტურებული</Badge>
                  )}
                </div>
              )}
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="w-5 h-5 text-primary-500" />
                <span>რეგისტრაციის თარიღი: {formatDateShort(user.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Shield className="w-5 h-5 text-primary-500" />
                <span>როლი: {user.role === 'ADMIN' ? 'ადმინისტრატორი' : 'მომხმარებელი'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-800">პროფილის რედაქტირება</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  label="სახელი და გვარი"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Button type="submit" isLoading={loading}>
                  შენახვა
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
