import type { Metadata } from 'next'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-foreground mb-6">About TechNexus</h1>
      <div className="bg-card border border-border rounded-xl p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
            AC
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Alex Carter</h2>
            <p className="text-secondary">Founder & Lead Writer</p>
          </div>
        </div>
        <div className="prose max-w-none">
          <p>Welcome to <strong>TechNexus</strong> — your daily destination for the latest tech insights, in-depth tutorials, and honest reviews.</p>
          <p>I created TechNexus because I believe everyone deserves access to clear, well-researched technology content. Whether you&apos;re a developer, a tech enthusiast, or just curious about the latest gadgets, you&apos;ll find something valuable here.</p>
          <h3>What We Cover</h3>
          <ul>
            <li><strong>Artificial Intelligence</strong> — The latest in AI, machine learning, and their real-world applications</li>
            <li><strong>Web Development</strong> — Tutorials, frameworks, and best practices</li>
            <li><strong>Mobile Technology</strong> — Smartphones, apps, and mobile innovation</li>
            <li><strong>Gadgets & Reviews</strong> — Honest, detailed product reviews</li>
            <li><strong>Cybersecurity</strong> — Online safety, privacy, and security tips</li>
            <li><strong>Cloud Computing</strong> — Cloud platforms, DevOps, and infrastructure</li>
          </ul>
          <h3>Our Mission</h3>
          <p>To make technology accessible and understandable for everyone, one article at a time.</p>
        </div>
      </div>
      <AdSlot slot="about-bottom" format="horizontal" />
    </div>
  )
}
