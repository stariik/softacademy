'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatPrice, formatDateShort } from '@/lib/utils'
import { ShoppingBag, ExternalLink } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
  amount: string
  discount: string
  finalAmount: string
  createdAt: string
  course: {
    title: string
    slug: string
    instructor: string
    startDate: string
  }
}

const statusColors = {
  PENDING: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
  REFUNDED: 'default',
} as const

const statusLabels = {
  PENDING: 'მოლოდინში',
  COMPLETED: 'დასრულებული',
  CANCELLED: 'გაუქმებული',
  REFUNDED: 'დაბრუნებული',
}

export default function PurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/my')
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PageSpinner />
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">ჩემი შეკვეთები</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              ჯერ არ გაქვთ შეკვეთები
            </h3>
            <p className="text-slate-500 mb-4">
              დაათვალიერეთ ჩვენი კურსები და შეიძინეთ
            </p>
            <Link href="/courses" className="text-primary-600 hover:text-primary-700 font-medium">
              კურსების ნახვა
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} hover>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-slate-500">#{order.orderNumber}</span>
                      <Badge variant={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <Link
                      href={`/courses/${order.course.slug}`}
                      className="text-lg font-semibold text-slate-800 hover:text-primary-600 flex items-center gap-2"
                    >
                      {order.course.title}
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <p className="text-slate-500 mt-1">
                      ლექტორი: {order.course.instructor}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">
                      {formatPrice(parseFloat(order.finalAmount))}
                    </p>
                    {parseFloat(order.discount) > 0 && (
                      <p className="text-sm text-slate-500 line-through">
                        {formatPrice(parseFloat(order.amount))}
                      </p>
                    )}
                    <p className="text-sm text-slate-500 mt-1">
                      {formatDateShort(order.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
