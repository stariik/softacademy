'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, formatDate } from '@/lib/utils'
import { PageSpinner } from '@/components/ui/Spinner'
import {
  Calendar,
  Clock,
  Tag,
  CheckCircle,
  ArrowLeft,
  ShoppingCart,
} from 'lucide-react'

interface Course {
  id: string
  slug: string
  title: string
  shortDesc: string
  price: number
  instructor: string
  duration: string
  startDate: string
  category: { name: string }
}

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { addToast } = useToast()

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [promocode, setPromocode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [validatingPromo, setValidatingPromo] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchCourse()
  }, [user, router, slug])

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${slug}`)
      const data = await res.json()
      if (data.course) {
        setCourse({
          ...data.course,
          price: parseFloat(data.course.price),
        })
      }
    } catch (error) {
      console.error('Failed to fetch course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleValidatePromocode = async () => {
    if (!promocode || !course) return

    setValidatingPromo(true)
    try {
      const res = await fetch('/api/promocodes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promocode, coursePrice: course.price }),
      })

      const data = await res.json()

      if (res.ok && data.valid) {
        setDiscount(data.promocode.discount)
        addToast('success', `პრომოკოდი გააქტიურდა: -${formatPrice(data.promocode.discount)}`)
      } else {
        addToast('error', data.error || 'არასწორი პრომოკოდი')
        setDiscount(0)
      }
    } catch {
      addToast('error', 'შეცდომა პრომოკოდის შემოწმებისას')
    } finally {
      setValidatingPromo(false)
    }
  }

  const handleCheckout = async () => {
    if (!course) return

    setProcessing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          promocode: promocode || undefined,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        addToast('success', 'შეკვეთა წარმატებით განთავსდა!')
        router.push('/purchases')
      } else {
        addToast('error', data.error || 'შეკვეთის განთავსება ვერ მოხერხდა')
      }
    } catch {
      addToast('error', 'შეცდომა შეკვეთის განთავსებისას')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <PageSpinner />
  }

  if (!course) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-slate-500">კურსი ვერ მოიძებნა</p>
        <Link href="/courses" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          კურსების ნახვა
        </Link>
      </div>
    )
  }

  const finalPrice = Math.max(0, course.price - discount)

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container-custom max-w-4xl">
        <Link
          href={`/courses/${course.slug}`}
          className="flex items-center gap-2 text-slate-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          კურსზე დაბრუნება
        </Link>

        <h1 className="text-3xl font-bold text-slate-800 mb-8">შეკვეთის გაფორმება</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Course Info */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-800">კურსის ინფორმაცია</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant="primary" className="mb-2">{course.category.name}</Badge>
                <h3 className="text-xl font-semibold text-slate-800">{course.title}</h3>
                <p className="text-slate-500 mt-1">{course.shortDesc}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="w-5 h-5 text-primary-500" />
                  <span>{formatDate(course.startDate)}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-primary-500" />
                  <span>ლექტორი: {course.instructor}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-800">გადახდა</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Promocode */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  პრომოკოდი
                </label>
                <div className="flex gap-2">
                  <Input
                    value={promocode}
                    onChange={(e) => setPromocode(e.target.value.toUpperCase())}
                    placeholder="PROMO123"
                  />
                  <Button
                    variant="secondary"
                    onClick={handleValidatePromocode}
                    isLoading={validatingPromo}
                    disabled={!promocode}
                  >
                    შემოწმება
                  </Button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>კურსის ფასი</span>
                  <span>{formatPrice(course.price)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>ფასდაკლება</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-slate-800 pt-3 border-t border-slate-100">
                  <span>სულ</span>
                  <span className="text-primary-600">{formatPrice(finalPrice)}</span>
                </div>
              </div>

              {/* Note about payment */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  გადახდის სისტემა მალე დაემატება. ამჟამად შეკვეთა განთავსდება
                  სტატუსით &quot;დასრულებული&quot; სატესტო მიზნებისთვის.
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                isLoading={processing}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                შეკვეთის დადასტურება
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
