import Link from 'next/link'
import AdSlot from '@/components/AdSlot'

const categories = [
  { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
  { name: 'Web Development', slug: 'web-development' },
  { name: 'Mobile Technology', slug: 'mobile-technology' },
  { name: 'Gadgets & Reviews', slug: 'gadgets-reviews' },
  { name: 'Cybersecurity', slug: 'cybersecurity' },
  { name: 'Cloud Computing', slug: 'cloud-computing' },
  { name: 'Programming', slug: 'programming' },
  { name: 'Tech News', slug: 'tech-news' },
]

export default function Sidebar() {
  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-3">Search</h3>
        <form action="/blog" method="GET">
          <input
            type="text"
            name="search"
            placeholder="Search articles..."
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>
      </div>

      {/* Categories */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-3">Categories</h3>
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat.slug}>
              <Link href={`/category/${cat.slug}`} className="flex items-center justify-between text-secondary hover:text-primary transition-colors py-1">
                <span>{cat.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sidebar Ad (300x250 Adsterra) */}
      <div className="bg-card border border-border rounded-xl p-4">
        <span className="text-[10px] uppercase font-semibold text-secondary tracking-wider block mb-2 text-center">Advertisement</span>
        <AdSlot format="300x250" />
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl p-6">
        <h3 className="font-bold text-lg mb-2">📬 Newsletter</h3>
        <p className="text-sm opacity-90 mb-4">Get the latest tech articles delivered to your inbox.</p>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-4 py-2 rounded-lg text-foreground bg-white/90 placeholder-secondary mb-3 focus:outline-none"
        />
        <button className="w-full bg-accent hover:bg-amber-400 text-black font-semibold py-2 rounded-lg transition-colors">
          Subscribe
        </button>
      </div>
    </aside>
  )
}
