'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { PageSpinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, formatDateShort } from '@/lib/utils'

interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
  amount: string
  discount: string
  finalAmount: string
  createdAt: string
  user: { name: string; email: string | null; phone: string | null }
  course: { title: string }
  promocode: { code: string } | null
}

const statusLabels = {
  PENDING: 'მოლოდინში',
  COMPLETED: 'დასრულებული',
  CANCELLED: 'გაუქმებული',
  REFUNDED: 'დაბრუნებული',
}

export default function AdminOrdersPage() {
  const { addToast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      const url = filter ? `/api/orders?status=${filter}` : '/api/orders'
      const res = await fetch(url)
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o
          )
        )
        addToast('success', 'სტატუსი განახლდა')
      }
    } catch {
      addToast('error', 'შეცდომა')
    }
  }

  if (loading) {
    return <PageSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">შეკვეთები</h1>
        <div className="w-48">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: '', label: 'ყველა' },
              { value: 'PENDING', label: 'მოლოდინში' },
              { value: 'COMPLETED', label: 'დასრულებული' },
              { value: 'CANCELLED', label: 'გაუქმებული' },
              { value: 'REFUNDED', label: 'დაბრუნებული' },
            ]}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-slate-500">სულ {orders.length} შეკვეთა</p>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-slate-500 text-center py-8">შეკვეთები არ მოიძებნა</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">შეკვეთა</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">მომხმარებელი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">კურსი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">თანხა</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">პრომო</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">თარიღი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">სტატუსი</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm font-medium text-slate-800">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-slate-800">{order.user.name}</p>
                        <p className="text-xs text-slate-500">
                          {order.user.email || order.user.phone}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 max-w-xs truncate">
                        {order.course.title}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-slate-800">
                          {formatPrice(parseFloat(order.finalAmount))}
                        </p>
                        {parseFloat(order.discount) > 0 && (
                          <p className="text-xs text-slate-500 line-through">
                            {formatPrice(parseFloat(order.amount))}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {order.promocode?.code || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {formatDateShort(order.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-sm px-2 py-1 rounded-full border-0 ${
                            order.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : order.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-700'
                              : order.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
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
