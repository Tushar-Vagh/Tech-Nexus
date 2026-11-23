'use client'

import { useEffect } from 'react'

export default function AdsterraGlobals() {
  const popunderKey = process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_KEY
  const socialBarKey = process.env.NEXT_PUBLIC_ADSTERRA_SOCIALBAR_KEY

  useEffect(() => {
    // 1. Inject Popunder if key is set
    if (popunderKey) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `//www.topcreativeformat.com/${popunderKey}/invoke.js`
      script.async = true
      document.head.appendChild(script)
    }

    // 2. Inject Social Bar if key is set
    if (socialBarKey) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `//www.topcreativeformat.com/${socialBarKey}/invoke.js`
      script.async = true
      document.head.appendChild(script)
    }
  }, [popunderKey, socialBarKey])

  return null
}
