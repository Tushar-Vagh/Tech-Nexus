import Link from 'next/link'

const categories = [
  { name: 'AI', slug: 'artificial-intelligence' },
  { name: 'Web Dev', slug: 'web-development' },
  { name: 'Mobile', slug: 'mobile-technology' },
  { name: 'Gadgets', slug: 'gadgets-reviews' },
  { name: 'Cybersecurity', slug: 'cybersecurity' },
]

export default function Navbar() {
  const smartlinkUrl = process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_URL

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Tech</span>
            <span className="text-2xl font-bold text-foreground">Nexus</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-secondary hover:text-primary transition-colors font-medium">Home</Link>
            <Link href="/blog" className="text-secondary hover:text-primary transition-colors font-medium">Blog</Link>
            {categories.map(cat => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="text-secondary hover:text-primary transition-colors font-medium">
                {cat.name}
              </Link>
            ))}
            <Link href="/about" className="text-secondary hover:text-primary transition-colors font-medium">About</Link>
            <Link href="/contact" className="text-secondary hover:text-primary transition-colors font-medium">Contact</Link>
          </nav>
          <div className="flex items-center space-x-3">
            {smartlinkUrl ? (
              <a
                href={smartlinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Trending 🔥
              </a>
            ) : (
              <Link href="/blog" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Explore
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
