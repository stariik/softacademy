import { Decimal } from '@prisma/client/runtime/library'

export interface User {
  id: string
  email: string | null
  phone: string | null
  name: string
  role: 'USER' | 'ADMIN'
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  createdAt: Date
  _count?: {
    courses: number
  }
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  shortDesc: string
  price: Decimal
  image: string | null
  instructor: string
  instructorBio: string | null
  instructorImage: string | null
  duration: string
  startDate: Date
  meetLink: string | null
  syllabus: string[]
  maxStudents: number | null
  isPublished: boolean
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  categoryId: string
  category?: Category
  reviews?: Review[]
  _count?: {
    orders: number
    reviews: number
  }
  averageRating?: number
}

export interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
  amount: Decimal
  discount: Decimal
  finalAmount: Decimal
  createdAt: Date
  userId: string
  user?: User
  courseId: string
  course?: Course
  promocodeId: string | null
  promocode?: Promocode
}

export interface Promocode {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  value: Decimal
  maxUses: number | null
  usedCount: number
  minPurchase: Decimal | null
  expiresAt: Date | null
  isActive: boolean
  createdAt: Date
}

export interface Review {
  id: string
  rating: number
  comment: string
  isApproved: boolean
  createdAt: Date
  userId: string
  user?: User
  courseId: string
  course?: Course
}

export interface Wishlist {
  id: string
  createdAt: Date
  userId: string
  courseId: string
  course?: Course
}

export interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalOrders: number
  totalRevenue: number
  recentOrders: Order[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
