import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const published = searchParams.get('published')

  const where: any = {}
  if (published === 'true') where.published = true
  if (published === 'false') where.published = false

  const posts = await prisma.post.findMany({
    where,
    include: { category: true, author: true },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })
  const total = await prisma.post.count({ where })
  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: slug + '-' + Date.now().toString(36),
      excerpt: data.excerpt || '',
      content: data.content || '',
      coverImage: data.coverImage || '',
      published: data.published || false,
      featured: data.featured || false,
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt || '',
      categoryId: data.categoryId ? parseInt(data.categoryId) : 1,
      authorId: 1,
    },
  })
  return NextResponse.json(post, { status: 201 })
}
