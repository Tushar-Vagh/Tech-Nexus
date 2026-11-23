'use client'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-secondary font-medium">Share:</span>
      <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
         className="bg-muted hover:bg-blue-500 hover:text-white text-secondary w-9 h-9 rounded-full flex items-center justify-center transition-colors text-sm font-bold">
        𝕏
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer"
         className="bg-muted hover:bg-blue-600 hover:text-white text-secondary w-9 h-9 rounded-full flex items-center justify-center transition-colors text-sm">
        f
      </a>
      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer"
         className="bg-muted hover:bg-blue-700 hover:text-white text-secondary w-9 h-9 rounded-full flex items-center justify-center transition-colors text-sm font-bold">
        in
      </a>
      <button onClick={() => navigator.clipboard.writeText(url)}
              className="bg-muted hover:bg-primary hover:text-white text-secondary w-9 h-9 rounded-full flex items-center justify-center transition-colors text-sm">
        📋
      </button>
    </div>
  )
}
