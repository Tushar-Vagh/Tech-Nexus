'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ManagePosts() {
  const { status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/posts').then(r => r.json()).then(d => setPosts(d.posts || [])).catch(() => {})
    }
  }, [status])

  const deletePost = async (id: number) => {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    setPosts(posts.filter(p => p.id !== id))
  }

  const togglePublish = async (id: number, published: boolean) => {
    await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published })
    })
    setPosts(posts.map(p => p.id === id ? { ...p, published: !published } : p))
  }

  if (status !== 'authenticated') return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Posts</h1>
          <p className="text-secondary text-sm mt-1">Review article engagement, views, and publication status</p>
        </div>
        <Link href="/admin/posts/new" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
          + New Post
        </Link>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {posts.length > 0 ? (
          <div className="divide-y divide-border">
            {posts.map(post => (
              <div key={post.id} className="p-5 flex items-center justify-between hover:bg-card-hover transition-colors">
                <div className="flex-1 pr-4">
                  <p className="font-medium text-foreground">{post.title}</p>
                  <p className="text-sm text-secondary mt-1">
                    {post.category?.name || 'Uncategorized'} · {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs bg-muted text-secondary px-3 py-1.5 rounded-full font-semibold">
                    👁️ {(post.views || 0).toLocaleString()} views
                  </span>
                  <button onClick={() => togglePublish(post.id, post.published)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${post.published ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-accent/10 text-accent hover:bg-accent/20'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </button>
                  <Link href={`/admin/posts/${post.id}`} className="text-primary text-sm hover:underline font-medium">Edit</Link>
                  <button onClick={() => deletePost(post.id)} className="text-red-500 text-sm hover:underline font-medium">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-secondary">
            <p className="text-4xl mb-3">📝</p>
            <p>No posts yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
