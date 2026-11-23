import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const data = await req.json()

  const updateData: any = {}
  if (data.title !== undefined) {
    updateData.title = data.title
    updateData.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)
  }
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt
  if (data.content !== undefined) updateData.content = data.content
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage
  if (data.published !== undefined) updateData.published = data.published
  if (data.featured !== undefined) updateData.featured = data.featured
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle
  if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription
  if (data.categoryId !== undefined) updateData.categoryId = parseInt(data.categoryId)

  const post = await prisma.post.update({ where: { id: parseInt(id) }, data: updateData })
  return NextResponse.json(post)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.post.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ message: 'Deleted' })
}
