import { useState } from 'react'

const BrowserViewer = ({ url, title, onClose }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleOpenInBrowser = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError(true)
  }

  return (
    <div className="w-full h-full flex flex-col bg-black text-red-500 font-mono">
      {/* Header */}
      <div className="bg-black px-3 py-2 border-b border-neutral-800 flex items-center justify-between gap-2">
        <div className="text-xs text-red-500 truncate">
          {title} - {url}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenInBrowser}
            className="px-2 py-0.5 border border-neutral-700 text-red-500 hover:bg-neutral-900 text-xs"
            title="Open in external browser"
          >
            Open in Browser
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-0.5 border border-neutral-700 text-red-500 hover:bg-neutral-900"
            title="Close viewer"
            aria-label="Close viewer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500 mx-auto mb-3"></div>
              <p className="text-red-500 text-sm">Loading page...</p>
            </div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center p-8">
              <p className="text-red-400 mb-6">
                This site cannot be embedded. Open in browser.
              </p>
              <button
                onClick={handleOpenInBrowser}
                className="px-3 py-1 border border-neutral-700 text-red-500 hover:bg-neutral-900"
              >
                Open in Browser
              </button>
            </div>
          </div>
        ) : (
          <iframe
            src={url}
            className="w-full h-full border-0"
            title={title}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  )
}

export default BrowserViewer
