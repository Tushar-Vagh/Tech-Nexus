interface AdSlotProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

export default function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_ID

  if (!adClient) {
    return (
      <div className={`bg-muted border border-dashed border-border rounded-lg flex items-center justify-center text-secondary text-sm ${className}`}
           style={{ minHeight: format === 'horizontal' ? '90px' : format === 'rectangle' ? '250px' : '200px' }}>
        <span>Ad Space — Set NEXT_PUBLIC_ADSENSE_ID in .env.local</span>
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
