import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// -------------------------------------------------------------
// Supabase Cloud Adapter (100% Serverless & Pure JS)
// -------------------------------------------------------------
class SupabaseAdapter {
  private client: SupabaseClient | null = null

  constructor(url: string, key: string) {
    if (url && key) {
      this.client = createClient(url, key)
    }
  }

  private getClient() {
    if (!this.client) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      if (url && key) {
        this.client = createClient(url, key)
      }
    }
    return this.client
  }

  get post() {
    return {
      findMany: async (args: any = {}) => {
        const client = this.getClient()
        if (!client) return []

        let query = client
          .from('Post')
          .select('*, category:Category(*), author:User(id, name, email)')

        if (args.where?.published !== undefined) {
          query = query.eq('published', args.where.published)
        }
        if (args.where?.categoryId) {
          query = query.eq('categoryId', args.where.categoryId)
        }
        if (args.where?.OR && Array.isArray(args.where.OR)) {
          const searchVal = args.where.OR[0]?.title?.contains || args.where.OR[0]?.excerpt?.contains || ''
          if (searchVal) {
            query = query.or(`title.ilike.%${searchVal}%,excerpt.ilike.%${searchVal}%`)
          }
        }

        query = query.order('createdAt', { ascending: false })

        if (args.take) {
          const from = args.skip || 0
          const to = from + args.take - 1
          query = query.range(from, to)
        }

        const { data, error } = await query
        if (error) {
          console.error('Supabase post.findMany error:', error)
          return []
        }
        return data || []
      },

      findUnique: async (args: { where: { slug?: string; id?: number } }) => {
        const client = this.getClient()
        if (!client) return null

        let query = client
          .from('Post')
          .select('*, category:Category(*), author:User(id, name, email)')

        if (args.where.slug) {
          query = query.eq('slug', args.where.slug)
        } else if (args.where.id) {
          query = query.eq('id', args.where.id)
        }

        const { data, error } = await query.maybeSingle()
        if (error) {
          console.error('Supabase post.findUnique error:', error)
          return null
        }
        return data
      },

      count: async (args: any = {}) => {
        const client = this.getClient()
        if (!client) return 0

        let query = client
          .from('Post')
          .select('*', { count: 'exact', head: true })

        if (args.where?.published !== undefined) {
          query = query.eq('published', args.where.published)
        }

        const { count, error } = await query
        if (error) return 0
        return count || 0
      },

      create: async (args: { data: any }) => {
        const client = this.getClient()
        if (!client) throw new Error('Supabase not configured')

        const d = args.data
        const { data, error } = await client
          .from('Post')
          .insert({
            title: d.title,
            slug: d.slug,
            excerpt: d.excerpt || '',
            content: d.content || '',
            coverImage: d.coverImage || '',
            published: Boolean(d.published),
            featured: Boolean(d.featured),
            metaTitle: d.metaTitle || d.title,
            metaDescription: d.metaDescription || d.excerpt || '',
            views: 0,
            authorId: d.authorId || 1,
            categoryId: d.categoryId || 1,
          })
          .select('*, category:Category(*), author:User(id, name, email)')
          .single()

        if (error) throw error
        return data
      },

      update: async (args: { where: { id: number }; data: any }) => {
        const client = this.getClient()
        if (!client) throw new Error('Supabase not configured')

        const d = args.data
        const updatePayload: any = { updatedAt: new Date().toISOString() }

        if (d.views?.increment) {
          const { data: cur } = await client.from('Post').select('views').eq('id', args.where.id).single()
          updatePayload.views = (cur?.views || 0) + 1
        }
        if (d.title !== undefined) updatePayload.title = d.title
        if (d.slug !== undefined) updatePayload.slug = d.slug
        if (d.excerpt !== undefined) updatePayload.excerpt = d.excerpt
        if (d.content !== undefined) updatePayload.content = d.content
        if (d.coverImage !== undefined) updatePayload.coverImage = d.coverImage
        if (d.published !== undefined) updatePayload.published = d.published
        if (d.featured !== undefined) updatePayload.featured = d.featured
        if (d.metaTitle !== undefined) updatePayload.metaTitle = d.metaTitle
        if (d.metaDescription !== undefined) updatePayload.metaDescription = d.metaDescription
        if (d.categoryId !== undefined) updatePayload.categoryId = d.categoryId

        const { data, error } = await client
          .from('Post')
          .update(updatePayload)
          .eq('id', args.where.id)
          .select('*, category:Category(*), author:User(id, name, email)')
          .single()

        if (error) throw error
        return data
      },

      delete: async (args: { where: { id: number } }) => {
        const client = this.getClient()
        if (!client) throw new Error('Supabase not configured')
        const { error } = await client.from('Post').delete().eq('id', args.where.id)
        if (error) throw error
        return true
      }
    }
  }

  get category() {
    return {
      findMany: async () => {
        const client = this.getClient()
        if (!client) return []

        const { data, error } = await client
          .from('Category')
          .select('*, posts:Post(id)')
          .order('name', { ascending: true })

        if (error) return []
        return (data || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          _count: { posts: c.posts?.length || 0 }
        }))
      },

      findUnique: async (args: { where: { slug?: string; id?: number } }) => {
        const client = this.getClient()
        if (!client) return null

        let query = client.from('Category').select('*')
        if (args.where.slug) query = query.eq('slug', args.where.slug)
        else if (args.where.id) query = query.eq('id', args.where.id)

        const { data } = await query.maybeSingle()
        return data
      }
    }
  }

  get user() {
    return {
      findUnique: async (args: { where: { email?: string; id?: number } }) => {
        const client = this.getClient()
        if (!client) return null

        let query = client.from('User').select('*')
        if (args.where.email) query = query.eq('email', args.where.email)
        else if (args.where.id) query = query.eq('id', args.where.id)

        const { data } = await query.maybeSingle()
        return data
      }
    }
  }
}

const globalForDb = globalThis as unknown as { prisma: any }

export const prisma =
  globalForDb.prisma || new SupabaseAdapter(supabaseUrl, supabaseKey)

if (process.env.NODE_ENV !== 'production') globalForDb.prisma = prisma
export default prisma
