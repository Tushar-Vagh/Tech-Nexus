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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Realtime visitor tracker */}
      <ViewTracker slug={post.slug} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          {/* Header */}
          <div className="mb-8">
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
            <img src={post.coverImage} alt={post.title} className="w-full rounded-xl mb-8 max-h-96 object-cover" />
          )}

          {/* Ad */}
          <AdSlot slot="article-top" format="horizontal" className="mb-8" />

          {/* Content */}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Bottom Ad */}
          <AdSlot slot="article-bottom" format="horizontal" className="mt-8" />

          {/* Share again */}
          <div className="border-t border-border mt-8 pt-6">
            <ShareButtons url={`${siteUrl}/blog/${post.slug}`} title={post.title} />
          </div>
        </article>
        <Sidebar />
      </div>
    </div>
  )
}
