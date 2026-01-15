'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { PageSpinner } from '@/components/ui/Spinner'
import { formatPrice, formatDateShort } from '@/lib/utils'
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react'

interface Course {
  id: string
  slug: string
  title: string
  price: string
  instructor: string
  startDate: string
  isPublished: boolean
  isFeatured: boolean
  category: { name: string }
  _count: { orders: number }
}

export default function AdminCoursesPage() {
  const { addToast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses')
      const data = await res.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (slug: string, isPublished: boolean) => {
    try {
      const res = await fetch(`/api/courses/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished }),
      })

      if (res.ok) {
        setCourses((prev) =>
          prev.map((c) => (c.slug === slug ? { ...c, isPublished: !isPublished } : c))
        )
        addToast('success', isPublished ? 'კურსი გამოქვეყნებიდან მოიხსნა' : 'კურსი გამოქვეყნდა')
      }
    } catch {
      addToast('error', 'შეცდომა')
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('ნამდვილად გსურთ კურსის წაშლა?')) return

    try {
      const res = await fetch(`/api/courses/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        setCourses((prev) => prev.filter((c) => c.slug !== slug))
        addToast('success', 'კურსი წაიშალა')
      }
    } catch {
      addToast('error', 'შეცდომა კურსის წაშლისას')
    }
  }

  if (loading) {
    return <PageSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">კურსები</h1>
        <Link href="/admin/courses/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            ახალი კურსი
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm text-slate-500">სულ {courses.length} კურსი</p>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-slate-500 text-center py-8">კურსები არ მოიძებნა</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">კურსი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">კატეგორია</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">ფასი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">თარიღი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">შეკვეთები</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">სტატუსი</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">მოქმედებები</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-slate-800 flex items-center gap-2">
                            {course.title}
                            {course.isFeatured && (
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            )}
                          </p>
                          <p className="text-sm text-slate-500">{course.instructor}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default">{course.category.name}</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {formatPrice(parseFloat(course.price))}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {formatDateShort(course.startDate)}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {course._count.orders}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={course.isPublished ? 'success' : 'warning'}>
                          {course.isPublished ? 'გამოქვეყნებული' : 'დრაფტი'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(course.slug, course.isPublished)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title={course.isPublished ? 'გამოქვეყნებიდან მოხსნა' : 'გამოქვეყნება'}
                          >
                            {course.isPublished ? (
                              <EyeOff className="w-4 h-4 text-slate-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-slate-500" />
                            )}
                          </button>
                          <Link
                            href={`/admin/courses/${course.id}/edit`}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-slate-500" />
                          </Link>
                          <button
                            onClick={() => handleDelete(course.slug)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
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
