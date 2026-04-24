# Images Setup

Place your personal images in this `public/images/` folder.

## Supported Formats
- JPG/JPEG
- PNG
- GIF
- WebP

## How to Add Images

1. **Add your images** to this folder:
   ```
   public/images/picture1.jpg
   public/images/picture2.jpg
   public/images/picture3.jpg
   etc.
   ```

2. **Update the images array** in `src/apps/PicturesApp.jsx`:
   ```javascript
   const images = [
     {
       id: 1,
       src: '/images/your-image.jpg',
       alt: 'Description of image',
       placeholder: '📸'
     },
     // Add more images...
   ]
   ```

## Features
- Grid layout (2-3 columns)
- Click to view full preview
- Smooth transitions
- Hover effects
- Responsive design

## Command
Type `pictures` in the terminal to open the gallery.
