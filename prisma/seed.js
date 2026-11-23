const { PrismaClient } = require('@prisma/client')
const { PrismaBetterSqlite } = require('@prisma/adapter-better-sqlite3')
const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
const db = new Database(dbPath)
const adapter = new PrismaBetterSqlite(db)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  const admin = await prisma.user.upsert({
    where: { email: 'admin@technexus.com' },
    update: {},
    create: {
      email: 'admin@technexus.com',
      name: 'Alex Carter',
      password: 'admin123',
      role: 'admin',
    },
  })

  const categoriesData = [
    { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Mobile Technology', slug: 'mobile-technology' },
    { name: 'Gadgets & Reviews', slug: 'gadgets-reviews' },
    { name: 'Cybersecurity', slug: 'cybersecurity' },
    { name: 'Cloud Computing', slug: 'cloud-computing' },
  ]

  const categories = {}
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  const posts = [
    {
      title: 'The Future of AI Agents: Autonomous Intelligence in 2026 and Beyond',
      slug: 'the-future-of-ai-agents-2026',
      excerpt: 'Explore how generative AI is shifting from conversational interfaces to autonomous multi-agent systems executing complex workflows across industries.',
      categorySlug: 'artificial-intelligence',
      featured: true,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      content: `
        <h2>The Paradigm Shift: From Chatbots to Action-Oriented Agents</h2>
        <p>Artificial intelligence has matured rapidly beyond simple text generation. In 2026, the focus has pivoted toward autonomous agentic workflows where models don't just answer questions—they plan, decide, and interact directly with APIs, software environments, and databases.</p>
        
        <h2>Key Drivers of Agentic Adoption</h2>
        <ul>
          <li><strong>Multi-Agent Coordination:</strong> Complex tasks are broken down into specialized roles—researchers, coders, and QA reviewers collaborating synchronously.</li>
          <li><strong>Persistent State and Long-Term Memory:</strong> Models now retain deep contextual awareness through integrated vector memory and deterministic execution logs.</li>
          <li><strong>Reliable Tool Calling:</strong> Zero-shot function execution has reached production-level precision across enterprise platforms.</li>
        </ul>

        <blockquote>"The real value of AI isn't answers; it's the automated execution of multi-step problem solving."</blockquote>

        <h2>Looking Ahead</h2>
        <p>As developer frameworks evolve, expect agent-driven microservices to become standard architecture in modern cloud applications. The challenge now shifts towards governance, sandboxing, and security boundaries.</p>
      `,
    },
    {
      title: 'Next.js & Modern Web Dev: Building Ultra-Fast Responsive Apps',
      slug: 'nextjs-modern-web-dev-performance',
      excerpt: 'A comprehensive deep dive into React Server Components, streaming SSR, and edge deployments to achieve top-tier Core Web Vitals.',
      categorySlug: 'web-development',
      featured: false,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      content: `
        <h2>Why Server-Driven Architectures Dominate</h2>
        <p>Building high-performance applications on the web demands efficient caching and minimal client-side JavaScript overhead. Next.js App Router and React Server Components (RSC) bring data fetching directly to server boundaries.</p>

        <h2>Best Practices for Modern Web Performance</h2>
        <ol>
          <li>Stream critical HTML fragments with React Suspense boundaries.</li>
          <li>Leverage static generation where content updates infrequently.</li>
          <li>Implement automated image optimization with responsive srcset defaults.</li>
        </ol>

        <h2>Conclusion</h2>
        <p>Prioritizing performance not only boosts search engine rankings but directly correlates with improved monetization and user retention across media platforms.</p>
      `,
    },
    {
      title: 'Zero Trust Architecture in Modern Cloud Security',
      slug: 'zero-trust-cloud-security-guide',
      excerpt: 'Why traditional perimeter security is obsolete and how engineering teams implement identity-centric Zero Trust frameworks.',
      categorySlug: 'cybersecurity',
      featured: false,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      content: `
        <h2>Never Trust, Always Verify</h2>
        <p>With distributed engineering teams and multi-cloud infrastructure, perimeter firewalls are no longer adequate. Zero Trust enforces strict mutual authentication on every internal request regardless of network origin.</p>

        <h2>Core Pillars of Zero Trust</h2>
        <ul>
          <li><strong>Continuous Contextual Verification:</strong> Validating identity, device posture, and session risk in real-time.</li>
          <li><strong>Least Privilege Access:</strong> Granting ephemeral permissions restricted solely to necessary scopes.</li>
          <li><strong>Microsegmentation:</strong> Limiting blast radius by isolating workloads and service communications.</li>
        </ul>
      `,
    },
    {
      title: 'The Next Wave of Foldable Tech & Wearable Computing',
      slug: 'next-wave-foldables-wearable-tech',
      excerpt: 'A review of cutting-edge hardware design, foldable displays, and ambient computing devices entering the consumer market.',
      categorySlug: 'gadgets-reviews',
      featured: false,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
      content: `
        <h2>Hardware Meets Intelligent Miniaturization</h2>
        <p>Consumer electronics are entering a design renaissance. Foldable OLED screens have finally eliminated noticeable display creases, while silicon advances enable all-day battery life in compact wearables.</p>
        <p>Stay tuned for hands-on bench tests and our thorough performance rankings in the upcoming hardware roundup.</p>
      `,
    }
  ]

  for (const p of posts) {
    const category = categories[p.categorySlug]
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage,
        featured: p.featured,
        published: p.published,
        metaTitle: p.title,
        metaDescription: p.excerpt,
        authorId: admin.id,
        categoryId: category ? category.id : 1,
      },
    })
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
