import BlogCard from '@/components/BlogCard'
import Sidebar from '@/components/Sidebar'
import AdSlot from '@/components/AdSlot'
import prisma from '@/lib/prisma'
import { formatDate, readingTime } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Blog' }

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ search?: string; page?: string }> }) {
  const params = await searchParams
  const search = params.search || ''
  const page = parseInt(params.page || '1')
  const perPage = 9

  let posts: any[] = []
  let total = 0
  try {
    const where: any = { published: true }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ]
    }
    total = await prisma.post.count({ where })
    posts = await prisma.post.findMany({
      where,
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    })
  } catch (e) {}

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-foreground mb-2">Blog</h1>
      <p className="text-secondary mb-8">Explore our latest articles on technology and development.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  category={post.category?.name || 'Tech'}
                  categorySlug={post.category?.slug || 'tech'}
                  date={formatDate(post.createdAt)}
                  readTime={readingTime(post.content)}
                  coverImage={post.coverImage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted rounded-xl">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-secondary">{search ? `No results for "${search}"` : 'No posts yet.'}</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <a key={p} href={`/blog?page=${p}${search ? `&search=${search}` : ''}`}
                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'bg-muted text-secondary hover:bg-card-hover'}`}>
                  {p}
                </a>
              ))}
            </div>
          )}

          <div className="mt-8">
            <AdSlot slot="blog-listing-bottom" format="horizontal" />
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  )
}
