'use client'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function EditPostForm() {
  const { status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [categories, setCategories] = useState<any[]>([])
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', categoryId: '1',
    coverImage: '', published: false, featured: false,
    metaTitle: '', metaDescription: ''
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && params?.id) {
      Promise.all([
        fetch(`/api/posts/${params.id}`).then(r => r.json()),
        fetch('/api/categories').then(r => r.json())
      ]).then(([post, cats]) => {
        if (post && !post.error) {
          setForm({
            title: post.title || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            categoryId: String(post.categoryId || 1),
            coverImage: post.coverImage || '',
            published: post.published || false,
            featured: post.featured || false,
            metaTitle: post.metaTitle || '',
            metaDescription: post.metaDescription || '',
          })
        }
        if (Array.isArray(cats)) setCategories(cats)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [status, params?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/posts/${params?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) router.push('/admin/posts')
    setSaving(false)
  }

  if (status !== 'authenticated') return null
  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-secondary">Loading...</p></div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-foreground mb-8">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
            <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
            <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Excerpt</label>
          <textarea rows={2} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Content (HTML) *</label>
          <textarea rows={15} required value={form.content} onChange={e => setForm({...form, content: e.target.value})}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Cover Image URL</label>
          <input type="url" value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">🔍 SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Meta Title</label>
              <input type="text" value={form.metaTitle} onChange={e => setForm({...form, metaTitle: e.target.value})}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Meta Description</label>
              <textarea rows={2} value={form.metaDescription} onChange={e => setForm({...form, metaDescription: e.target.value})}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
            <span className="text-sm text-foreground">Published</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
            <span className="text-sm text-foreground">Featured</span>
          </label>
        </div>
        <div className="flex space-x-4">
          <button type="submit" disabled={saving}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Update Post'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="bg-muted hover:bg-card-hover text-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default function EditPost() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-secondary">Loading editor...</div>}>
      <EditPostForm />
    </Suspense>
  )
}
