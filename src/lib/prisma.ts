import { createClient, SupabaseClient } from '@supabase/supabase-js'
import sqlite3 from 'sqlite3'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const useSupabase = Boolean(supabaseUrl && supabaseKey)

// -------------------------------------------------------------
// 1. Supabase Adapter (Cloud Production)
// -------------------------------------------------------------
class SupabaseAdapter {
  private client: SupabaseClient

  constructor(url: string, key: string) {
    this.client = createClient(url, key)
  }

  get post() {
    return {
      findMany: async (args: any = {}) => {
        let query = this.client
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
        let query = this.client
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
        let query = this.client
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
        const d = args.data
        const { data, error } = await this.client
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
        const d = args.data
        const updatePayload: any = { updatedAt: new Date().toISOString() }

        if (d.views?.increment) {
          // Increment views
          const { data: cur } = await this.client.from('Post').select('views').eq('id', args.where.id).single()
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

        const { data, error } = await this.client
          .from('Post')
          .update(updatePayload)
          .eq('id', args.where.id)
          .select('*, category:Category(*), author:User(id, name, email)')
          .single()

        if (error) throw error
        return data
      },

      delete: async (args: { where: { id: number } }) => {
        const { error } = await this.client.from('Post').delete().eq('id', args.where.id)
        if (error) throw error
        return true
      }
    }
  }

  get category() {
    return {
      findMany: async () => {
        const { data, error } = await this.client
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
        let query = this.client.from('Category').select('*')
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
        let query = this.client.from('User').select('*')
        if (args.where.email) query = query.eq('email', args.where.email)
        else if (args.where.id) query = query.eq('id', args.where.id)

        const { data } = await query.maybeSingle()
        return data
      }
    }
  }
}

// -------------------------------------------------------------
// 2. SQLite Adapter (Local Fallback)
// -------------------------------------------------------------
class SqliteDbAdapter {
  private db: sqlite3.Database

  constructor() {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
    this.db = new sqlite3.Database(dbPath)
  }

  private run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (this: sqlite3.RunResult, err) {
        if (err) reject(err)
        else resolve({ lastID: this.lastID, changes: this.changes })
      })
    })
  }

  private get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err)
        else resolve(row as T)
      })
    })
  }

  private all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err)
        else resolve(rows as T[])
      })
    })
  }

  get post() {
    return {
      findMany: async (args: any = {}) => {
        let sql = `
          SELECT p.*, 
            json_object('id', c.id, 'name', c.name, 'slug', c.slug) as category,
            json_object('id', u.id, 'name', u.name, 'email', u.email) as author
          FROM Post p
          LEFT JOIN Category c ON p.categoryId = c.id
          LEFT JOIN User u ON p.authorId = u.id
        `
        const conditions: string[] = []
        const params: any[] = []

        if (args.where?.published !== undefined) {
          conditions.push('p.published = ?')
          params.push(args.where.published ? 1 : 0)
        }
        if (args.where?.categoryId) {
          conditions.push('p.categoryId = ?')
          params.push(args.where.categoryId)
        }
        if (args.where?.OR && Array.isArray(args.where.OR)) {
          const orTerms: string[] = []
          for (const orCond of args.where.OR) {
            if (orCond.title?.contains) {
              orTerms.push('p.title LIKE ?')
              params.push(`%${orCond.title.contains}%`)
            }
            if (orCond.excerpt?.contains) {
              orTerms.push('p.excerpt LIKE ?')
              params.push(`%${orCond.excerpt.contains}%`)
            }
          }
          if (orTerms.length > 0) {
            conditions.push(`(${orTerms.join(' OR ')})`)
          }
        }

        if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ')
        sql += ' ORDER BY p.createdAt DESC'

        if (args.take) {
          sql += ` LIMIT ${args.take}`
          if (args.skip) sql += ` OFFSET ${args.skip}`
        }

        const rows = await this.all(sql, params)
        return rows.map(r => ({
          ...r,
          published: Boolean(r.published),
          featured: Boolean(r.featured),
          category: r.category ? JSON.parse(r.category) : null,
          author: r.author ? JSON.parse(r.author) : null,
        }))
      },

      findUnique: async (args: { where: { slug?: string; id?: number } }) => {
        let sql = `
          SELECT p.*, 
            json_object('id', c.id, 'name', c.name, 'slug', c.slug) as category,
            json_object('id', u.id, 'name', u.name, 'email', u.email) as author
          FROM Post p
          LEFT JOIN Category c ON p.categoryId = c.id
          LEFT JOIN User u ON p.authorId = u.id
          WHERE 
        `
        const params: any[] = []
        if (args.where.slug) {
          sql += 'p.slug = ?'
          params.push(args.where.slug)
        } else if (args.where.id) {
          sql += 'p.id = ?'
          params.push(args.where.id)
        }

        const r = await this.get(sql, params)
        if (!r) return null
        return {
          ...r,
          published: Boolean(r.published),
          featured: Boolean(r.featured),
          category: r.category ? JSON.parse(r.category) : null,
          author: r.author ? JSON.parse(r.author) : null,
        }
      },

      count: async (args: any = {}) => {
        let sql = 'SELECT COUNT(*) as total FROM Post p'
        const conditions: string[] = []
        const params: any[] = []

        if (args.where?.published !== undefined) {
          conditions.push('p.published = ?')
          params.push(args.where.published ? 1 : 0)
        }
        if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ')

        const res = await this.get<{ total: number }>(sql, params)
        return res ? res.total : 0
      },

      create: async (args: { data: any }) => {
        const d = args.data
        const now = new Date().toISOString()
        const res = await this.run(`
          INSERT INTO Post (title, slug, excerpt, content, coverImage, published, featured, metaTitle, metaDescription, views, authorId, categoryId, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          d.title, d.slug, d.excerpt, d.content, d.coverImage || '',
          d.published ? 1 : 0, d.featured ? 1 : 0,
          d.metaTitle || d.title, d.metaDescription || d.excerpt,
          0, d.authorId || 1, d.categoryId || 1, now, now
        ])
        return this.post.findUnique({ where: { id: res.lastID } })
      },

      update: async (args: { where: { id: number }; data: any }) => {
        const fields: string[] = []
        const params: any[] = []
        const d = args.data

        if (d.views?.increment) fields.push('views = views + 1')
        if (d.title !== undefined) { fields.push('title = ?'); params.push(d.title); }
        if (d.slug !== undefined) { fields.push('slug = ?'); params.push(d.slug); }
        if (d.excerpt !== undefined) { fields.push('excerpt = ?'); params.push(d.excerpt); }
        if (d.content !== undefined) { fields.push('content = ?'); params.push(d.content); }
        if (d.coverImage !== undefined) { fields.push('coverImage = ?'); params.push(d.coverImage); }
        if (d.published !== undefined) { fields.push('published = ?'); params.push(d.published ? 1 : 0); }
        if (d.featured !== undefined) { fields.push('featured = ?'); params.push(d.featured ? 1 : 0); }
        if (d.metaTitle !== undefined) { fields.push('metaTitle = ?'); params.push(d.metaTitle); }
        if (d.metaDescription !== undefined) { fields.push('metaDescription = ?'); params.push(d.metaDescription); }
        if (d.categoryId !== undefined) { fields.push('categoryId = ?'); params.push(d.categoryId); }

        fields.push('updatedAt = ?')
        params.push(new Date().toISOString())
        params.push(args.where.id)

        await this.run(`UPDATE Post SET ${fields.join(', ')} WHERE id = ?`, params)
        return this.post.findUnique({ where: { id: args.where.id } })
      },

      delete: async (args: { where: { id: number } }) => {
        return this.run('DELETE FROM Post WHERE id = ?', [args.where.id])
      }
    }
  }

  get category() {
    return {
      findMany: async () => {
        const rows = await this.all(`
          SELECT c.*, COUNT(p.id) as postCount 
          FROM Category c 
          LEFT JOIN Post p ON c.id = p.categoryId AND p.published = 1 
          GROUP BY c.id 
          ORDER BY c.name ASC
        `)
        return rows.map(r => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          _count: { posts: r.postCount }
        }))
      },

      findUnique: async (args: { where: { slug?: string; id?: number } }) => {
        if (args.where.slug) {
          return this.get('SELECT * FROM Category WHERE slug = ?', [args.where.slug])
        }
        return this.get('SELECT * FROM Category WHERE id = ?', [args.where.id])
      }
    }
  }

  get user() {
    return {
      findUnique: async (args: { where: { email?: string; id?: number } }) => {
        if (args.where.email) {
          return this.get('SELECT * FROM User WHERE email = ?', [args.where.email])
        }
        return this.get('SELECT * FROM User WHERE id = ?', [args.where.id])
      }
    }
  }
}

// -------------------------------------------------------------
// Singleton: Uses Supabase when configured, falls back to SQLite
// -------------------------------------------------------------
const globalForDb = globalThis as unknown as { prisma: any }

export const prisma =
  globalForDb.prisma ||
  (useSupabase ? new SupabaseAdapter(supabaseUrl, supabaseKey) : new SqliteDbAdapter())

if (process.env.NODE_ENV !== 'production') globalForDb.prisma = prisma
export default prisma
