import Link from 'next/link'
import BlogCard from '@/components/BlogCard'
import AdSlot from '@/components/AdSlot'
import prisma from '@/lib/prisma'
import { formatDate, readingTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Home() {
  let posts: any[] = []
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      include: { category: true, author: true },
      orderBy: { createdAt: 'desc' },
      take: 7,
    })
  } catch (e) {
    // DB error fallback
  }

  const featured = posts.find(p => p.featured) || posts[0]
  const latest = posts.filter(p => p !== featured).slice(0, 6)

  return (
    <div>
      {/* 1. Header Top Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <AdSlot format="728x90" slot="home-top" />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-14 md:py-20 my-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6">
            Welcome to <span className="text-primary">Tech</span>Nexus
          </h1>
          <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-8">
            Your daily source for cutting-edge tech insights, tutorials, and reviews. Stay ahead of the curve.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/blog" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Read Articles
            </Link>
            <Link href="/about" className="bg-card border border-border hover:bg-muted text-foreground px-6 py-3 rounded-lg font-semibold transition-colors">
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Below Hero Mid-Page Ad */}
      <div className="max-w-7xl mx-auto px-4 my-6">
        <AdSlot format="728x90" slot="home-after-hero" />
      </div>

      {/* Featured Post */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-6">⭐ Featured</h2>
          <BlogCard
            title={featured.title}
            slug={featured.slug}
            excerpt={featured.excerpt}
            category={featured.category?.name || 'Tech'}
            categorySlug={featured.category?.slug || 'tech'}
            date={formatDate(featured.createdAt)}
            readTime={readingTime(featured.content)}
            coverImage={featured.coverImage}
            featured
          />
        </section>
      )}

      {/* 3. In-Feed Dual Banner Ad Section */}
      <div className="max-w-7xl mx-auto px-4 my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdSlot format="300x250" slot="home-feed-left" />
          <AdSlot format="300x250" slot="home-feed-right" />
        </div>
      </div>

      {/* Latest Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">📰 Latest Articles</h2>
          <Link href="/blog" className="text-primary hover:underline font-medium">View All →</Link>
        </div>
        {latest.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map(post => (
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
            <p className="text-4xl mb-4">📝</p>
            <p className="text-lg text-secondary">No posts yet. Go to <Link href="/admin" className="text-primary underline">/admin</Link> to create your first post!</p>
          </div>
        )}
      </section>

      {/* 4. Pre-Footer Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 my-8">
        <AdSlot format="728x90" slot="home-pre-footer" />
      </div>

      {/* 5. Bottom Sticky/Footer Ad */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <AdSlot format="728x90" slot="home-bottom" />
      </div>
    </div>
  )
}
