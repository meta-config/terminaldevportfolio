import { useEffect, useState } from 'react'

const IMAGES = [
  { id: 1, fileName: 'picture1.jpg', src: '/images/picture1.jpg', alt: 'picture1.jpg' },
  { id: 2, fileName: 'picture2.jpg', src: '/images/picture2.jpg', alt: 'picture2.jpg' },
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
    <div className="w-full h-full flex flex-col bg-black text-red-500 font-mono">
      {selectedImage ? (
        <div className="w-full h-full flex flex-col bg-black">
          <div className="px-4 py-2 border-b border-neutral-800 flex items-center justify-between">
            <div className="text-sm">
              {selectedImage.fileName}
            </div>
            <button
              type="button"
              onClick={closeImage}
              className="px-2 py-0.5 border border-neutral-700 text-red-500 hover:bg-neutral-900"
              aria-label="Close image"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 min-h-0 flex items-center justify-center bg-black">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col bg-black">
          <div className="px-4 py-2 border-b border-neutral-800 text-sm">
            /home/samarsingh/pictures
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {IMAGES.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => openImage(index)}
                className="w-full px-4 py-2 text-left border-b border-neutral-900 hover:bg-neutral-950"
              >
                {image.fileName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PicturesApp
