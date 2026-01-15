import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Eye,
  User,
  Tag,
} from 'lucide-react'
import { format } from 'date-fns'
import { ka } from 'date-fns/locale'

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, isPublished: true },
    })

    if (post) {
      // Increment view count
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      })
    }

    return post
  } catch {
    return null
  }
}

async function getRelatedPosts(category: string, currentSlug: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        category,
        slug: { not: currentSlug },
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    })
    return posts
  } catch {
    return []
  }
}

const categoryLabels: Record<string, string> = {
  general: 'ზოგადი',
  programming: 'პროგრამირება',
  design: 'დიზაინი',
  marketing: 'მარკეტინგი',
  business: 'ბიზნესი',
  tips: 'რჩევები',
  news: 'სიახლეები',
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.category, post.slug)
  const tags = (post.tags as string[]) || []

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 lg:py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-hero-pattern" />
        </div>

        <div className="container-custom relative">
          <Link
            href="/blog"
            className={cn(
              'inline-flex items-center gap-2 mb-8',
              'text-slate-400 hover:text-white transition-colors'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            ბლოგზე დაბრუნება
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="primary">
                {categoryLabels[post.category] || post.category}
              </Badge>
              <span className="text-slate-400 text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} წუთი წასაკითხად
              </span>
              <span className="text-slate-400 text-sm flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views} ნახვა
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>

            <p className="text-lg text-slate-300 mb-8">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {post.authorImage ? (
                  <Image
                    src={post.authorImage}
                    alt={post.authorName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-lg">
                    {post.authorName[0]}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">{post.authorName}</p>
                  {post.publishedAt && (
                    <p className="text-sm text-slate-400">
                      {format(new Date(post.publishedAt), 'd MMMM, yyyy', { locale: ka })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 shadow-xl">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <Card>
              <CardContent className="p-8 lg:p-12">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-primary-600 prose-strong:text-slate-900"
                  dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                />

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-5 h-5 text-slate-400" />
                      <span className="font-semibold text-slate-700">თეგები:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline" size="sm">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share */}
            <div className="flex items-center justify-between mt-8 p-6 bg-white rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">
                  დაწერილია <strong>{post.authorName}</strong>-ის მიერ
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" leftIcon={<Share2 className="w-4 h-4" />}>
                  გაზიარება
                </Button>
                <Button variant="ghost" size="sm" leftIcon={<Bookmark className="w-4 h-4" />}>
                  შენახვა
                </Button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Author Card */}
            <Card>
              <CardContent className="p-6 text-center">
                {post.authorImage ? (
                  <Image
                    src={post.authorImage}
                    alt={post.authorName}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-2xl mx-auto mb-4">
                    {post.authorName[0]}
                  </div>
                )}
                <h3 className="font-semibold text-slate-900">{post.authorName}</h3>
                <p className="text-sm text-slate-500 mt-1">ავტორი</p>
              </CardContent>
            </Card>

            {/* Table of Contents placeholder */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  სტატიის ინფორმაცია
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between text-slate-600">
                    <span>გამოქვეყნდა:</span>
                    <span className="font-medium">
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), 'd MMM, yyyy', { locale: ka })
                        : '-'}
                    </span>
                  </li>
                  <li className="flex justify-between text-slate-600">
                    <span>წასაკითხი დრო:</span>
                    <span className="font-medium">{post.readTime} წუთი</span>
                  </li>
                  <li className="flex justify-between text-slate-600">
                    <span>ნახვები:</span>
                    <span className="font-medium">{post.views}</span>
                  </li>
                  <li className="flex justify-between text-slate-600">
                    <span>კატეგორია:</span>
                    <span className="font-medium">{categoryLabels[post.category]}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">მსგავსი სტატიები</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} hover interactive className="overflow-hidden group">
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <div className="relative aspect-video">
                      {relatedPost.coverImage ? (
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function formatContent(content: string): string {
  // Simple markdown-like formatting
  return content
    .split('\n\n')
    .map(para => {
      if (para.startsWith('# ')) {
        return `<h2 class="text-2xl font-bold mt-8 mb-4">${para.slice(2)}</h2>`
      }
      if (para.startsWith('## ')) {
        return `<h3 class="text-xl font-bold mt-6 mb-3">${para.slice(3)}</h3>`
      }
      if (para.startsWith('### ')) {
        return `<h4 class="text-lg font-bold mt-4 mb-2">${para.slice(4)}</h4>`
      }
      if (para.startsWith('- ')) {
        const items = para.split('\n').map(line =>
          `<li>${line.slice(2)}</li>`
        ).join('')
        return `<ul class="list-disc list-inside space-y-1 my-4">${items}</ul>`
      }
      return `<p class="mb-4 leading-relaxed">${para}</p>`
    })
    .join('')
}
