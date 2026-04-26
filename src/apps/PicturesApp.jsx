import { useEffect, useState } from 'react'

const IMAGES = [
  { id: 1, fileName: 'picture1.jpg', src: '/images/picture1.jpg', alt: 'picture1.jpg' },
  { id: 2, fileName: 'picture2.jpg', src: '/images/picture2.jpg', alt: 'picture2.jpg' },git
  { id: 3, fileName: 'picture3.jpg', src: '/images/picture3.jpg', alt: 'picture3.jpg' },
  { id: 4, fileName: 'picture4.jpg', src: '/images/picture4.jpg', alt: 'picture4.jpg' },
  { id: 5, fileName: 'picture5.jpg', src: '/images/picture5.jpg', alt: 'picture5.jpg' },
  { id: 6, fileName: 'picture6.jpg', src: '/images/picture6.jpg', alt: 'picture6.jpg' }
]

const PicturesApp = () => {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const selectedImage = selectedIndex >= 0 ? IMAGES[selectedIndex] : null

  const openImage = (index) => setSelectedIndex(index)
  const closeImage = () => setSelectedIndex(-1)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && selectedIndex >= 0) {
        closeImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIndex])

  return (
    <div className="w-full h-full flex flex-col bg-black text-red-500 font-mono uppercase">
      {selectedImage ? (
        <div className="w-full h-full flex flex-col bg-black">
          <div className="px-4 py-2 border-b-2 border-red-900 flex items-center justify-between">
            <div className="text-sm">
              VIEWING: {selectedImage.fileName}
            </div>
            <button
              type="button"
              onClick={closeImage}
              className="px-3 py-1 border border-red-500 text-red-500 hover:bg-red-900 font-bold"
              aria-label="Close image"
            >
              [X] CLOSE
            </button>
          </div>

          <div className="flex-1 min-h-0 flex items-center justify-center bg-black p-4">
            <div className="border-[4px] border-gray-800 p-1 w-full h-full max-h-full flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col bg-black">
          <div className="px-4 py-2 border-b-2 border-red-900 text-sm font-bold">
            DIR: /HOME/SAMARSINGH/PICTURES
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {IMAGES.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => openImage(index)}
                  className="flex flex-col items-center p-2 border-2 border-gray-800 hover:border-red-500 bg-black transition-colors"
                >
                  <div className="w-full aspect-square bg-gray-900 border border-gray-700 mb-2 overflow-hidden flex items-center justify-center">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover opacity-70 hover:opacity-100"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <span className="text-xs truncate w-full text-center">{image.fileName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PicturesApp
