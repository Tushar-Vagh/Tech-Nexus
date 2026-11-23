import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { formatDate, readingTime } from '@/lib/utils'
import AdSlot from '@/components/AdSlot'
import Sidebar from '@/components/Sidebar'
import ShareButtons from '@/components/ShareButtons'
import ViewTracker from '@/components/ViewTracker'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await prisma.post.findUnique({ where: { slug } })
    if (!post) return { title: 'Not Found' }
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      openGraph: { title: post.title, description: post.excerpt, type: 'article' },
    }
  } catch {
    return { title: 'Post' }
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  let post: any = null
  try {
    post = await prisma.post.findUnique({
      where: { slug },
    })
  } catch (e) {}

  if (!post) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Split HTML content at second closing tag to insert an authentic in-article mid ad
  const content = post.content || ''
  let firstHalf = content
  let secondHalf = ''
  const splitIndex = content.indexOf('</p>', Math.floor(content.length / 2))
  if (splitIndex !== -1) {
    firstHalf = content.substring(0, splitIndex + 4)
    secondHalf = content.substring(splitIndex + 4)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Realtime visitor tracker */}
      <ViewTracker slug={post.slug} />

      {/* 1. Header Banner Ad (Above Article) */}
      <div className="mb-6">
        <AdSlot format="728x90" slot="article-header" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          {/* Header Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4 flex-wrap gap-y-2">
              <span className="bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                {post.category?.name || 'Tech'}
              </span>
              <span className="text-secondary text-sm">{formatDate(post.createdAt)}</span>
              <span className="text-secondary text-sm">·</span>
              <span className="text-secondary text-sm">{readingTime(post.content)}</span>
              <span className="text-secondary text-sm">·</span>
              <span className="text-secondary text-sm">{post.views || 0} views</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">{post.title}</h1>
            <p className="text-lg text-secondary mb-6">{post.excerpt}</p>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  {post.author?.name?.[0] || 'A'}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{post.author?.name || 'Alex Carter'}</p>
                  <p className="text-xs text-secondary">Author</p>
                </div>
              </div>
              <ShareButtons url={`${siteUrl}/blog/${post.slug}`} title={post.title} />
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className="w-full rounded-xl mb-6 max-h-96 object-cover" />
          )}

          {/* 2. Top-Of-Content Ad */}
          <div className="my-6">
            <AdSlot format="728x90" slot="article-before-content" />
          </div>

          {/* Content First Half */}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: firstHalf }} />

          {/* 3. Mid-Article In-Content Ad */}
          <div className="my-8 py-3 border-y border-border/40">
            <span className="text-[10px] uppercase font-semibold text-secondary tracking-wider block mb-2 text-center">Sponsored</span>
            <AdSlot format="300x250" slot="article-middle" />
          </div>

          {/* Content Second Half */}
          {secondHalf && (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: secondHalf }} />
          )}

          {/* 4. Bottom-Of-Article Ad */}
          <div className="my-8">
            <AdSlot format="728x90" slot="article-end" />
          </div>

          {/* Share Section */}
          <div className="border-t border-border mt-8 pt-6 flex items-center justify-between">
            <span className="font-semibold text-foreground text-sm">Did you find this article helpful?</span>
            <ShareButtons url={`${siteUrl}/blog/${post.slug}`} title={post.title} />
          </div>

          {/* 5. Post Comments/After-Article Ad */}
          <div className="mt-8">
            <AdSlot format="728x90" slot="article-after-share" />
          </div>
        </article>

        {/* Sidebar includes 2 additional Ad slots (Top 300x250 + Bottom 300x250) */}
        <Sidebar />
      </div>
    </div>
  )
}
