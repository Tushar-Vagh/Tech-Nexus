'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slot?: string
  format?: '728x90' | '300x250' | '468x60' | '160x600' | 'auto' | 'horizontal' | 'rectangle' | 'vertical'
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

  // Map format strings to width/height
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
  }

  // Get key from props or environment variables
  const envKey =
    width === 300
      ? process.env.NEXT_PUBLIC_ADSTERRA_300x250_KEY
      : process.env.NEXT_PUBLIC_ADSTERRA_728x90_KEY
  const activeKey = adsterraKey || envKey

  useEffect(() => {
    if (!activeKey || !containerRef.current) return

    const container = containerRef.current
    container.innerHTML = '' // clear any previous ad

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
  }, [activeKey, height, width])

  // If no Ad key is configured, return null (render nothing, taking 0 space)
  if (!activeKey) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden flex justify-center items-center my-4 ${className}`}
      style={{ minHeight: `${height}px` }}
    />
  )
}
