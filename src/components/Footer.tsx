'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = 2026

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-primary">Tech</span>
              <span className="text-2xl font-bold text-foreground">Nexus</span>
            </Link>
            <p className="text-secondary max-w-md">
              Your daily source for the latest in technology, AI, web development, gadgets, and cybersecurity. Stay ahead of the curve with TechNexus.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-secondary hover:text-primary transition-colors">All Posts</Link></li>
              <li><Link href="/about" className="text-secondary hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-secondary hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/artificial-intelligence" className="text-secondary hover:text-primary transition-colors">AI</Link></li>
              <li><Link href="/category/web-development" className="text-secondary hover:text-primary transition-colors">Web Dev</Link></li>
              <li><Link href="/category/cybersecurity" className="text-secondary hover:text-primary transition-colors">Cybersecurity</Link></li>
              <li><Link href="/category/gadgets-reviews" className="text-secondary hover:text-primary transition-colors">Gadgets</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-secondary text-sm">
          <p>&copy; {currentYear} TechNexus. All rights reserved. Built by Alex Carter.</p>
        </div>
      </div>
    </footer>
  )
}
