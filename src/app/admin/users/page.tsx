'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatDateShort } from '@/lib/utils'
import { Mail, Phone } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: 'USER' | 'ADMIN'
  createdAt: string
  _count: { orders: number }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PageSpinner />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">მომხმარებლები</h1>

      <Card>
        <CardHeader>
          <p className="text-sm text-slate-500">სულ {users.length} მომხმარებელი</p>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-slate-500 text-center py-8">მომხმარებლები არ მოიძებნა</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">მომხმარებელი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">კონტაქტი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">როლი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">შეკვეთები</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">რეგისტრაცია</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar fallback={user.name} size="sm" />
                          <span className="font-medium text-slate-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {user.email && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-4 h-4" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.role === 'ADMIN' ? 'primary' : 'default'}>
                          {user.role === 'ADMIN' ? 'ადმინი' : 'მომხმარებელი'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {user._count.orders}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {formatDateShort(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
