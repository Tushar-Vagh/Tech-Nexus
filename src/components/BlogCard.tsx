import Link from 'next/link'

interface BlogCardProps {
  title: string
  slug: string
  excerpt: string
  category: string
  categorySlug: string
  date: string
  readTime: string
  coverImage?: string
  featured?: boolean
}

export default function BlogCard({ title, slug, excerpt, category, categorySlug, date, readTime, coverImage, featured }: BlogCardProps) {
  return (
    <article className={`bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${featured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''}`}>
      <div className={`${featured ? 'h-full' : 'h-48'} bg-muted relative overflow-hidden`}>
        {coverImage ? (
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <span className="text-4xl">📝</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
          {category}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center text-xs text-secondary mb-3 space-x-3">
          <span>{date}</span>
          <span>·</span>
          <span>{readTime}</span>
        </div>
        <Link href={`/blog/${slug}`}>
          <h2 className={`font-bold text-foreground hover:text-primary transition-colors mb-2 ${featured ? 'text-2xl' : 'text-lg'}`}>
            {title}
          </h2>
        </Link>
        <p className="text-secondary text-sm line-clamp-3">{excerpt}</p>
        <Link href={`/blog/${slug}`} className="inline-flex items-center text-primary text-sm font-medium mt-4 hover:underline">
          Read More →
        </Link>
      </div>
    </article>
  )
}
