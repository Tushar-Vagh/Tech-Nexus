-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS "Category" (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Posts Table
CREATE TABLE IF NOT EXISTS "Post" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  "coverImage" TEXT DEFAULT '',
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  "metaTitle" TEXT DEFAULT '',
  "metaDescription" TEXT DEFAULT '',
  views INTEGER DEFAULT 0,
  "authorId" INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
  "categoryId" INTEGER REFERENCES "Category"(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Insert Default Admin User
INSERT INTO "User" (id, email, name, password, role)
VALUES (1, 'admin@technexus.com', 'Alex Carter', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 5. Insert Categories
INSERT INTO "Category" (id, name, slug)
VALUES 
  (1, 'Artificial Intelligence', 'artificial-intelligence'),
  (2, 'Web Development', 'web-development'),
  (3, 'Mobile Technology', 'mobile-technology'),
  (4, 'Gadgets & Reviews', 'gadgets-reviews'),
  (5, 'Cybersecurity', 'cybersecurity'),
  (6, 'Cloud Computing', 'cloud-computing')
ON CONFLICT (slug) DO NOTHING;

-- 6. Insert Starter Posts
INSERT INTO "Post" (id, title, slug, excerpt, content, "coverImage", published, featured, "metaTitle", "metaDescription", views, "authorId", "categoryId")
VALUES 
(
  1,
  'The Future of AI Agents: Autonomous Intelligence in 2026 and Beyond',
  'the-future-of-ai-agents-2026',
  'Explore how generative AI is shifting from conversational interfaces to autonomous multi-agent systems executing complex workflows across industries.',
  '<h2>The Paradigm Shift: From Chatbots to Action-Oriented Agents</h2><p>Artificial intelligence has matured rapidly beyond simple text generation. In 2026, the focus has pivoted toward autonomous agentic workflows where models don''t just answer questions—they plan, decide, and interact directly with APIs, software environments, and databases.</p><h2>Key Drivers of Agentic Adoption</h2><ul><li><strong>Multi-Agent Coordination:</strong> Complex tasks are broken down into specialized roles—researchers, coders, and QA reviewers collaborating synchronously.</li><li><strong>Persistent State and Long-Term Memory:</strong> Models now retain deep contextual awareness through integrated vector memory and deterministic execution logs.</li><li><strong>Reliable Tool Calling:</strong> Zero-shot function execution has reached production-level precision across enterprise platforms.</li></ul><blockquote>"The real value of AI isn''t answers; it''s the automated execution of multi-step problem solving."</blockquote><h2>Looking Ahead</h2><p>As developer frameworks evolve, expect agent-driven microservices to become standard architecture in modern cloud applications. The challenge now shifts towards governance, sandboxing, and security boundaries.</p>',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  TRUE,
  TRUE,
  'The Future of AI Agents: Autonomous Intelligence in 2026 and Beyond',
  'Explore how generative AI is shifting from conversational interfaces to autonomous multi-agent systems executing complex workflows across industries.',
  120,
  1,
  1
),
(
  2,
  'Next.js & Modern Web Dev: Building Ultra-Fast Responsive Apps',
  'nextjs-modern-web-dev-performance',
  'A comprehensive deep dive into React Server Components, streaming SSR, and edge deployments to achieve top-tier Core Web Vitals.',
  '<h2>Why Server-Driven Architectures Dominate</h2><p>Building high-performance applications on the web demands efficient caching and minimal client-side JavaScript overhead. Next.js App Router and React Server Components (RSC) bring data fetching directly to server boundaries.</p><h2>Best Practices for Modern Web Performance</h2><ol><li>Stream critical HTML fragments with React Suspense boundaries.</li><li>Leverage static generation where content updates infrequently.</li><li>Implement automated image optimization with responsive srcset defaults.</li></ol><h2>Conclusion</h2><p>Prioritizing performance not only boosts search engine rankings but directly correlates with improved monetization and user retention across media platforms.</p>',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  TRUE,
  FALSE,
  'Next.js & Modern Web Dev: Building Ultra-Fast Responsive Apps',
  'A comprehensive deep dive into React Server Components, streaming SSR, and edge deployments to achieve top-tier Core Web Vitals.',
  85,
  1,
  2
),
(
  3,
  'Zero Trust Architecture in Modern Cloud Security',
  'zero-trust-cloud-security-guide',
  'Why traditional perimeter security is obsolete and how engineering teams implement identity-centric Zero Trust frameworks.',
  '<h2>Never Trust, Always Verify</h2><p>With distributed engineering teams and multi-cloud infrastructure, perimeter firewalls are no longer adequate. Zero Trust enforces strict mutual authentication on every internal request regardless of network origin.</p><h2>Core Pillars of Zero Trust</h2><ul><li><strong>Continuous Contextual Verification:</strong> Validating identity, device posture, and session risk in real-time.</li><li><strong>Least Privilege Access:</strong> Granting ephemeral permissions restricted solely to necessary scopes.</li><li><strong>Microsegmentation:</strong> Limiting blast radius by isolating workloads and service communications.</li></ul>',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  TRUE,
  FALSE,
  'Zero Trust Architecture in Modern Cloud Security',
  'Why traditional perimeter security is obsolete and how engineering teams implement identity-centric Zero Trust frameworks.',
  64,
  1,
  5
),
(
  4,
  'The Next Wave of Foldable Tech & Wearable Computing',
  'next-wave-foldables-wearable-tech',
  'A review of cutting-edge hardware design, foldable displays, and ambient computing devices entering the consumer market.',
  '<h2>Hardware Meets Intelligent Miniaturization</h2><p>Consumer electronics are entering a design renaissance. Foldable OLED screens have finally eliminated noticeable display creases, while silicon advances enable all-day battery life in compact wearables.</p><p>Stay tuned for hands-on bench tests and our thorough performance rankings in the upcoming hardware roundup.</p>',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
  TRUE,
  FALSE,
  'The Next Wave of Foldable Tech & Wearable Computing',
  'A review of cutting-edge hardware design, foldable displays, and ambient computing devices entering the consumer market.',
  42,
  1,
  4
)
ON CONFLICT (slug) DO NOTHING;

-- Reset identity sequence if needed
SELECT setval(pg_get_serial_sequence('"Post"', 'id'), COALESCE(max(id), 1)) FROM "Post";
SELECT setval(pg_get_serial_sequence('"Category"', 'id'), COALESCE(max(id), 1)) FROM "Category";
SELECT setval(pg_get_serial_sequence('"User"', 'id'), COALESCE(max(id), 1)) FROM "User";
