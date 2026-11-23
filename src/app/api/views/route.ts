import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { slug } = await req.json()
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const post = await prisma.post.findUnique({ where: { slug } })
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const updated = await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: true } }
    })

    return NextResponse.json({ success: true, views: updated?.views || 0 })
  } catch (error: any) {
    console.error('View tracking error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
