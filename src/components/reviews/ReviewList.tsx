import { Avatar } from '@/components/ui/Avatar'
import { StarRating } from './StarRating'
import { formatDateShort } from '@/lib/utils'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: Date | string
  user: {
    name: string
  }
}

interface ReviewListProps {
  reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        ჯერ არ არის შეფასებები
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-4">
          <Avatar fallback={review.user.name} size="md" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-slate-800">{review.user.name}</p>
                <p className="text-sm text-slate-500">
                  {formatDateShort(review.createdAt)}
                </p>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <p className="text-slate-600">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
