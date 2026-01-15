'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select, Checkbox } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { PageSpinner } from '@/components/ui/Spinner'
import {
  ArrowLeft,
  Save,
  FileText,
  Image as ImageIcon,
  Tag,
  Clock,
} from 'lucide-react'

const categoryOptions = [
  { value: 'general', label: 'ზოგადი' },
  { value: 'programming', label: 'პროგრამირება' },
  { value: 'design', label: 'დიზაინი' },
  { value: 'marketing', label: 'მარკეტინგი' },
  { value: 'business', label: 'ბიზნესი' },
  { value: 'tips', label: 'რჩევები' },
  { value: 'news', label: 'სიახლეები' },
]

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    authorName: '',
    authorImage: '',
    category: 'general',
    tags: '',
    readTime: 5,
    isPublished: false,
    isFeatured: false,
  })

  useEffect(() => {
    fetchPost()
  }, [params.id])

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog/${params.id}`)
      if (!res.ok) throw new Error('Post not found')

      const data = await res.json()
      const post = data.post

      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage || '',
        authorName: post.authorName,
        authorImage: post.authorImage || '',
        category: post.category,
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
        readTime: post.readTime,
        isPublished: post.isPublished,
        isFeatured: post.isFeatured,
      })
    } catch {
      error('სტატია ვერ მოიძებნა')
      router.push('/admin/blog')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const res = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags,
          coverImage: formData.coverImage || null,
          authorImage: formData.authorImage || null,
        }),
      })

      if (res.ok) {
        success('სტატია წარმატებით განახლდა')
        router.push('/admin/blog')
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update post')
      }
    } catch (err) {
      error(err instanceof Error ? err.message : 'შეცდომა სტატიის განახლებისას')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <PageSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">სტატიის რედაქტირება</h1>
          <p className="text-slate-500">{formData.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  კონტენტი
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="სათაური"
                  placeholder="სტატიის სათაური"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />

                <Input
                  label="URL Slug"
                  placeholder="statyis-satauri"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  helperText="URL-ში გამოყენებული უნიკალური იდენტიფიკატორი"
                  required
                />

                <Textarea
                  label="მოკლე აღწერა"
                  placeholder="სტატიის მოკლე აღწერა"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                />

                <Textarea
                  label="კონტენტი"
                  placeholder="სტატიის სრული ტექსტი..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[300px]"
                  helperText="შეგიძლიათ გამოიყენოთ # სათაურებისთვის, ## ქვესათაურებისთვის, - სიებისთვის"
                  required
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  მედია
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="ყდის სურათი (URL)"
                  placeholder="https://example.com/image.jpg"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  helperText="სურათის URL მისამართი"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>პუბლიკაცია</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Checkbox
                  label="გამოქვეყნება"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                <Checkbox
                  label="გამორჩეული სტატია"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                />

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={isSubmitting}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    შენახვა
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  კატეგორია და თეგები
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="კატეგორია"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />

                <Input
                  label="თეგები"
                  placeholder="react, javascript, tips"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  helperText="გამოყავით მძიმით"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  დამატებითი
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="ავტორის სახელი"
                  placeholder="გიორგი გიორგაძე"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  required
                />

                <Input
                  label="ავტორის სურათი (URL)"
                  placeholder="https://example.com/author.jpg"
                  value={formData.authorImage}
                  onChange={(e) => setFormData({ ...formData, authorImage: e.target.value })}
                />

                <Input
                  label="წასაკითხი დრო (წუთი)"
                  type="number"
                  min={1}
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
