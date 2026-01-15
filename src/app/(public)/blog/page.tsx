import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Calendar,
  Clock,
  ArrowRight,
  Newspaper,
  TrendingUp,
  Bookmark,
} from 'lucide-react'
import { format } from 'date-fns'
import { ka } from 'date-fns/locale'

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    })
    return posts
  } catch {
    return []
  }
}

async function getFeaturedPost() {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { isPublished: true, isFeatured: true },
      orderBy: { publishedAt: 'desc' },
    })
    return post
  } catch {
    return null
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

export default async function BlogPage() {
  const [posts, featuredPost] = await Promise.all([
    getBlogPosts(),
    getFeaturedPost(),
  ])

  const regularPosts = posts.filter(p => p.id !== featuredPost?.id)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-28 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-hero-pattern" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full',
              'bg-white/10 backdrop-blur-sm border border-white/20',
              'text-white/90 text-sm font-medium mb-6'
            )}>
              <Newspaper className="w-4 h-4" />
              <span>ჩვენი ბლოგი</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              სასარგებლო სტატიები
              <span className="block text-primary-400">და რჩევები</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              გაეცანით უახლეს სტატიებს პროგრამირების, დიზაინის და ტექნოლოგიების შესახებ.
              ისწავლეთ ახალი უნარები ჩვენი ექსპერტებისგან.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-16">
        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-900">გამორჩეული სტატია</h2>
            </div>

            <Card hover className="overflow-hidden group">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative aspect-video lg:aspect-auto">
                  {featuredPost.coverImage ? (
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <Newspaper className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                </div>

                <CardContent className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="primary">
                      {categoryLabels[featuredPost.category] || featuredPost.category}
                    </Badge>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime} წუთი
                    </span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h3>

                  <p className="text-slate-600 mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {featuredPost.authorImage ? (
                        <Image
                          src={featuredPost.authorImage}
                          alt={featuredPost.authorName}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                          {featuredPost.authorName[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{featuredPost.authorName}</p>
                        {featuredPost.publishedAt && (
                          <p className="text-xs text-slate-500">
                            {format(new Date(featuredPost.publishedAt), 'd MMMM, yyyy', { locale: ka })}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link href={`/blog/${featuredPost.slug}`}>
                      <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        წაკითხვა
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </section>
        )}

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">ყველა სტატია</h2>
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-slate-400" />
              <span className="text-slate-500 text-sm">{posts.length} სტატია</span>
            </div>
          </div>

          {regularPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card padding="lg" className="text-center">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                სტატიები ჯერ არ არის
              </h3>
              <p className="text-slate-500">
                მალე გამოვაქვეყნებთ საინტერესო სტატიებს
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}

function BlogPostCard({ post }: { post: {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string | null
  authorName: string
  authorImage: string | null
  category: string
  readTime: number
  publishedAt: Date | null
} }) {
  return (
    <Card hover interactive className="overflow-hidden group h-full flex flex-col">
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        <div className="relative aspect-video">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <Newspaper className="w-10 h-10 text-slate-400" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="primary" size="sm">
              {categoryLabels[post.category] || post.category}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(post.publishedAt), 'd MMM, yyyy', { locale: ka })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} წუთი
            </span>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-slate-500 line-clamp-2 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
            {post.authorImage ? (
              <Image
                src={post.authorImage}
                alt={post.authorName}
                width={28}
                height={28}
                className="rounded-full"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-semibold">
                {post.authorName[0]}
              </div>
            )}
            <span className="text-sm text-slate-600">{post.authorName}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
