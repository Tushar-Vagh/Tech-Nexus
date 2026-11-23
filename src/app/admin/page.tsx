'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, totalViews: 0 })
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/posts')
        .then(r => r.json())
        .then(data => {
          const all = data.posts || []
          setPosts(all)
          const viewsSum = all.reduce((acc: number, p: any) => acc + (p.views || 0), 0)
          setStats({
            total: all.length,
            published: all.filter((p: any) => p.published).length,
            drafts: all.filter((p: any) => !p.published).length,
            totalViews: viewsSum,
          })
        })
        .catch(() => {})
    }
  }, [status])

  if (status === 'loading') return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-secondary">Loading...</p></div>
  if (status === 'unauthenticated') return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-secondary">Welcome back, {session?.user?.name || 'Admin'}</p>
        </div>
        <Link href="/admin/posts/new" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
          + New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-secondary text-sm">Total Posts</p>
          <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-secondary text-sm">Published</p>
          <p className="text-3xl font-bold text-green-500 mt-1">{stats.published}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-secondary text-sm">Drafts</p>
          <p className="text-3xl font-bold text-accent mt-1">{stats.drafts}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-secondary text-sm">Total Views</p>
          <p className="text-3xl font-bold text-blue-500 mt-1">👁️ {stats.totalViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Posts</h2>
          <Link href="/admin/posts" className="text-primary text-sm hover:underline">View All</Link>
        </div>
        {posts.length > 0 ? (
          <div className="divide-y divide-border">
            {posts.slice(0, 10).map(post => (
              <div key={post.id} className="p-5 flex items-center justify-between hover:bg-card-hover transition-colors">
                <div className="pr-4">
                  <p className="font-medium text-foreground">{post.title}</p>
                  <p className="text-sm text-secondary mt-1">
                    {post.category?.name || 'Uncategorized'} · {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs bg-muted text-secondary px-2.5 py-1 rounded-full font-medium">
                    👁️ {(post.views || 0).toLocaleString()} views
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${post.published ? 'bg-green-500/10 text-green-500' : 'bg-accent/10 text-accent'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <Link href={`/admin/posts/${post.id}`} className="text-primary text-sm hover:underline font-medium">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-secondary">
            <p className="text-4xl mb-3">📝</p>
            <p>No posts yet. Create your first post!</p>
          </div>
        )}
      </div>
    </div>
  )
}
