'use client'

import { useEffect } from 'react'

export default function AdsterraGlobals() {
  const popunder = process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_KEY
  const socialBar = process.env.NEXT_PUBLIC_ADSTERRA_SOCIALBAR_KEY

  useEffect(() => {
    // 1. Inject Popunder (Supports either full URL or 32-char key/hash)
    if (popunder) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.dataset.cfasync = 'false'
      script.async = true
      
      if (popunder.startsWith('http://') || popunder.startsWith('https://')) {
        script.src = popunder
      } else {
        script.src = `//www.topcreativeformat.com/${popunder}/invoke.js`
      }
      document.head.appendChild(script)
    }

    // 2. Inject Social Bar (Supports either full URL or 32-char key/hash)
    if (socialBar) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.dataset.cfasync = 'false'
      script.async = true

      if (socialBar.startsWith('http://') || socialBar.startsWith('https://')) {
        script.src = socialBar
      } else {
        script.src = `//www.topcreativeformat.com/${socialBar}/invoke.js`
      }
      document.head.appendChild(script)
    }
  }, [popunder, socialBar])

  return null
}
