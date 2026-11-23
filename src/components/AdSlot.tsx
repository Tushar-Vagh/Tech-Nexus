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

  // Placeholder when no Adsterra Key is set
  if (!activeKey) {
    return (
      <div
        className={`bg-muted/60 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center p-4 text-xs text-secondary transition-colors ${className}`}
        style={{ minHeight: `${height}px` }}
      >
        <div className="flex items-center space-x-1.5 font-medium text-foreground/80 mb-1">
          <span>📢</span>
          <span>Adsterra Ad Space ({width}×{height})</span>
        </div>
        <p className="max-w-xs opacity-75">
          Add <code className="bg-background px-1.5 py-0.5 rounded border border-border">NEXT_PUBLIC_ADSTERRA_{width === 300 ? '300x250' : '728x90'}_KEY</code> in your environment variables to show live ads.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden flex justify-center items-center my-4 ${className}`}
      style={{ minHeight: `${height}px` }}
    />
  )
}
