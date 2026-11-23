'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slot?: string
  format?:
    | '728x90'
    | '300x250'
    | '468x60'
    | '160x600'
    | '160x300'
    | '320x50'
    | 'native'
    | 'auto'
    | 'horizontal'
    | 'rectangle'
    | 'vertical'
  adsterraKey?: string
  className?: string
}

export default function AdSlot({
  slot = 'banner',
  format = 'auto',
  adsterraKey,
  className = '',
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  let width = 728
  let height = 90

  if (format === '300x250' || format === 'rectangle') {
    width = 300
    height = 250
  } else if (format === '468x60') {
    width = 468
    height = 60
  } else if (format === '160x600' || format === 'vertical') {
    width = 160
    height = 600
  } else if (format === '160x300') {
    width = 160
    height = 300
  } else if (format === '320x50') {
    width = 320
    height = 50
  }

  // Pick corresponding environment key if not passed directly
  let envKey = process.env.NEXT_PUBLIC_ADSTERRA_728x90_KEY
  if (format === '300x250' || format === 'rectangle') {
    envKey = process.env.NEXT_PUBLIC_ADSTERRA_300x250_KEY
  } else if (format === '468x60') {
    envKey = process.env.NEXT_PUBLIC_ADSTERRA_468x60_KEY
  } else if (format === '160x600' || format === 'vertical') {
    envKey = process.env.NEXT_PUBLIC_ADSTERRA_160x600_KEY
  } else if (format === '160x300') {
    envKey = process.env.NEXT_PUBLIC_ADSTERRA_160x300_KEY
  } else if (format === '320x50') {
    envKey = process.env.NEXT_PUBLIC_ADSTERRA_320x50_KEY
  } else if (format === 'native') {
    envKey = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY
  }

  const activeKey = adsterraKey || envKey

  useEffect(() => {
    if (!activeKey || !containerRef.current) return

    const container = containerRef.current
    container.innerHTML = '' // clear previous ad

    if (format === 'native') {
      // Native Banner script - extract hash if full URL or extract id directly
      let scriptSrc = activeKey
      let containerHash = activeKey

      if (activeKey.startsWith('http://') || activeKey.startsWith('https://')) {
        scriptSrc = activeKey
        // Extract hash from end of URL (e.g. https://bicea.org/21/e888ecce86a9f815f6b4a6a51e8b8c3b)
        const parts = activeKey.split('/')
        containerHash = parts[parts.length - 1]
      } else {
        scriptSrc = `//www.topcreativeformat.com/${activeKey}/invoke.js`
      }

      const nativeDiv = document.createElement('div')
      nativeDiv.id = `container-${containerHash}`
      container.appendChild(nativeDiv)

      const nativeScript = document.createElement('script')
      nativeScript.async = true
      nativeScript.dataset.cfasync = 'false'
      nativeScript.src = scriptSrc
      container.appendChild(nativeScript)
      return
    }

    // Standard Iframe Banners
    const confScript = document.createElement('script')
    confScript.type = 'text/javascript'
    confScript.innerHTML = `
      atOptions = {
        'key' : '${activeKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `

    const invokeScript = document.createElement('script')
    invokeScript.type = 'text/javascript'
    invokeScript.src = `//www.topcreativeformat.com/${activeKey}/invoke.js`
    invokeScript.async = true

    container.appendChild(confScript)
    container.appendChild(invokeScript)
  }, [activeKey, height, width, format])

  if (!activeKey) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden flex justify-center items-center my-4 ${className}`}
      style={{ minHeight: format === 'native' ? '120px' : `${height}px` }}
    />
  )
}
