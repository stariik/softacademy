'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { StarRating } from '@/components/reviews/StarRating'
import { PageSpinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { formatDateShort } from '@/lib/utils'
import { CheckCircle, X, ExternalLink } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string
  isApproved: boolean
  createdAt: string
  user: { name: string }
  course: { title: string; slug: string }
}

export default function AdminReviewsPage() {
  const { addToast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'all'>('pending')

  useEffect(() => {
    fetchReviews()
  }, [filter])

  const fetchReviews = async () => {
    try {
      const url = filter === 'pending' ? '/api/reviews?pending=true' : '/api/reviews'
      const res = await fetch(url)
      const data = await res.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: true }),
      })

      if (res.ok) {
        if (filter === 'pending') {
          setReviews((prev) => prev.filter((r) => r.id !== id))
        } else {
          setReviews((prev) =>
            prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
          )
        }
        addToast('success', 'შეფასება დადასტურდა')
      }
    } catch {
      addToast('error', 'შეცდომა')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('ნამდვილად გსურთ შეფასების წაშლა?')) return

    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id))
        addToast('success', 'შეფასება წაიშალა')
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
        <h1 className="text-3xl font-bold text-slate-800">შეფასებები</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === 'pending' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            მოლოდინში
          </Button>
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            ყველა
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-slate-500">
            {filter === 'pending' ? 'მოლოდინში მყოფი' : 'სულ'} {reviews.length} შეფასება
          </p>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              {filter === 'pending'
                ? 'მოლოდინში მყოფი შეფასებები არ არის'
                : 'შეფასებები არ მოიძებნა'}
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 bg-slate-50 rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar fallback={review.user.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-800">{review.user.name}</p>
                        <p className="text-sm text-slate-500">
                          {formatDateShort(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      {review.isApproved ? (
                        <Badge variant="success">დადასტურებული</Badge>
                      ) : (
                        <Badge variant="warning">მოლოდინში</Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <Link
                      href={`/courses/${review.course.slug}`}
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                      target="_blank"
                    >
                      {review.course.title}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <p className="text-slate-600">{review.comment}</p>

                  <div className="flex items-center gap-2 pt-2">
                    {!review.isApproved && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(review.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        დადასტურება
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(review.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      წაშლა
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
