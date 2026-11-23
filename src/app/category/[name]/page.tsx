import BlogCard from '@/components/BlogCard'
import Sidebar from '@/components/Sidebar'
import prisma from '@/lib/prisma'
import { formatDate, readingTime } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ name: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const formatted = name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
  return { title: formatted, description: `Browse articles about ${formatted}` }
}

export default async function CategoryPage({ params }: Props) {
  const { name } = await params
  const formatted = name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())

  let posts: any[] = []
  try {
    const category = await prisma.category.findUnique({ where: { slug: name } })
    if (category) {
      posts = await prisma.post.findMany({
        where: { categoryId: category.id, published: true },
        include: { category: true, author: true },
        orderBy: { createdAt: 'desc' },
      })
    }
  } catch (e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-foreground mb-2">{formatted}</h1>
      <p className="text-secondary mb-8">Articles about {formatted.toLowerCase()}.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => (
                <BlogCard key={post.id} title={post.title} slug={post.slug} excerpt={post.excerpt}
                  category={post.category?.name || 'Tech'} categorySlug={post.category?.slug || 'tech'}
                  date={formatDate(post.createdAt)} readTime={readingTime(post.content)} coverImage={post.coverImage} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted rounded-xl">
              <p className="text-4xl mb-4">📂</p>
              <p className="text-secondary">No posts in this category yet.</p>
            </div>
          )}
        </div>
        <Sidebar />
      </div>
    </div>
  )
}
