'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { StarRating } from './StarRating'
import { useToast } from '@/components/ui/Toast'

interface ReviewFormProps {
  courseId: string
  onSubmit?: () => void
}

export function ReviewForm({ courseId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      addToast('error', 'გთხოვთ აირჩიოთ შეფასება')
      return
    }

    if (comment.trim().length < 10) {
      addToast('error', 'კომენტარი უნდა იყოს მინიმუმ 10 სიმბოლო')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, rating, comment }),
      })

      if (res.ok) {
        addToast('success', 'შეფასება გაიგზავნა დასადასტურებლად')
        setRating(0)
        setComment('')
        onSubmit?.()
      } else {
        const data = await res.json()
        addToast('error', data.error || 'შეცდომა შეფასების გაგზავნისას')
      }
    } catch {
      addToast('error', 'შეცდომა შეფასების გაგზავნისას')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          თქვენი შეფასება
        </label>
        <StarRating
          rating={rating}
          interactive
          onChange={setRating}
          size="lg"
        />
      </div>

      <Textarea
        label="კომენტარი"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="დაწერეთ თქვენი შეფასება..."
        rows={4}
      />

      <Button type="submit" isLoading={loading}>
        გაგზავნა
      </Button>
    </form>
  )
}
