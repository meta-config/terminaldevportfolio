import { useState } from 'react'

const ResumeApp = ({
  title = 'Resume',
  subtitle = 'Samar Singh - Software Developer & AI-ML Student',
  pdfUrl = '/Samar_Singh_Resume.pdf',
  downloadName = 'Samar_Singh_Resume.pdf'
}) => {
  const [isLoading, setIsLoading] = useState(true)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = downloadName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      {/* Header Section */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-1">{title}</h2>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2 font-semibold"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
              />
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading resume...</p>
            </div>
          </div>
        )}
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0`}
          className="w-full h-full border-0"
          title={title}
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  )
}

export default ResumeApp
