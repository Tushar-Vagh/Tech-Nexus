'use client'
import { useEffect } from 'react'

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Increment view once per visitor session per article
    const storageKey = `viewed_${slug}`
    if (!sessionStorage.getItem(storageKey)) {
      fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
        .then(() => {
          sessionStorage.setItem(storageKey, 'true')
        })
        .catch(() => {})
    }
  }, [slug])

  return null
}
