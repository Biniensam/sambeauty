# Product Image Fetching Guide

This guide documents the enhanced image fetching functionality implemented in the beauty website application.

## Overview

The application now includes comprehensive image fetching, optimization, and display capabilities for product images. This includes support for multiple image formats, responsive image loading, error handling, and performance optimization.

## Features

### 1. Multiple Image Format Support
- **URL Images**: Direct links to image files
- **Base64 Images**: Embedded image data
- **Data URLs**: Complete image data with MIME type
- **Placeholder Images**: Fallback images when loading fails

### 2. Image Optimization
- **Responsive Sizing**: Automatic generation of different image sizes
- **Quality Optimization**: Configurable quality settings for different use cases
- **CDN Support**: Optimized URLs for Cloudinary and Unsplash
- **Compression**: Client-side image compression before upload

### 3. Performance Features
- **Image Preloading**: Batch preloading of product images
- **Lazy Loading**: Progressive image loading with loading states
- **Caching**: Browser-level caching of optimized images
- **Error Recovery**: Graceful fallbacks when images fail to load

### 4. Enhanced User Experience
- **Loading States**: Visual feedback during image loading
- **Error Handling**: Clear error messages and fallback images
- **Image Magnification**: Zoom functionality for product details
- **Thumbnail Navigation**: Easy navigation between product images

## Implementation Details

### Core Utilities (`utils/imageUtils.ts`)

#### Image Processing Functions
```typescript
// Convert Base64 to data URL
getBase64ImageUrl(base64Data: string, mimeType?: string): string

// Validate Base64 data
isValidBase64(str: string): boolean

// Get optimized product image
getProductImage(imageData: string | undefined): string

// Optimize image URL for different sizes
optimizeImageUrl(url: string, width?: number, height?: number, quality?: number): string

// Get responsive image URLs
getResponsiveImageUrls(imageData: string | undefined): {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  original: string;
}
```

#### Performance Functions
```typescript
// Preload single image
preloadImage(src: string): Promise<HTMLImageElement>

// Batch preload images
preloadImages(imageUrls: string[]): Promise<HTMLImageElement[]>

// Validate image data
validateImage(imageData: string): Promise<{ valid: boolean; error?: string }>

// Get image dimensions
getImageDimensions(imageData: string): Promise<{ width: number; height: number }>
```

#### Upload Functions
```typescript
// Convert file to Base64
fileToBase64(file: File): Promise<string>

// Compress image before upload
compressImage(file: File, maxWidth?: number, quality?: number): Promise<File>
```

### Custom Hooks (`hooks/useProducts.ts`)

#### Product Images Hook
```typescript
const { imageStates, preloadedImages, validateProductImages } = useProductImages(product)
```

**Returns:**
- `imageStates`: Loading, error, and loaded states for each image
- `preloadedImages`: Array of preloaded image elements
- `validateProductImages`: Function to validate all product images

### Component Integration (`components/ProductDetails.tsx`)

#### Enhanced Image Display
```typescript
// Image loading states
const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: number]: boolean }>({})
const [imageErrorStates, setImageErrorStates] = useState<{ [key: number]: boolean }>({})
const [mainImageLoading, setMainImageLoading] = useState(true)
const [mainImageError, setMainImageError] = useState(false)

// Image event handlers
const handleImageLoad = (index: number) => { /* ... */ }
const handleImageError = (index: number) => { /* ... */ }
const handleImageSelect = (index: number) => { /* ... */ }
```

#### Image Magnification
```typescript
<ImageMagnifier
  src={getProductImage(productWithImages.images[selectedImage])}
  alt={productWithImages.name}
  className="w-full h-full rounded-lg"
  zoomType="hover"
  zoomScale={3}
  lensSize={200}
  lensShape={lensShape}
  showIndicator={true}
/>
```

## Usage Examples

### Basic Image Display
```typescript
import { getProductImage } from '@/utils/imageUtils'

// Simple image display with fallback
<img 
  src={getProductImage(product.image)} 
  alt={product.name}
  className="w-full h-full object-cover"
/>
```

### Responsive Images
```typescript
import { getResponsiveImageUrls } from '@/utils/imageUtils'

const urls = getResponsiveImageUrls(product.image)

// Use different sizes for different contexts
<img src={urls.thumbnail} alt="Thumbnail" />
<img src={urls.medium} alt="Medium" />
<img src={urls.large} alt="Large" />
```

### Image Preloading
```typescript
import { useProductImages } from '@/hooks/useProducts'

const { imageStates, preloadedImages } = useProductImages(product)

// Check if images are loaded
const isImageLoaded = imageStates[0]?.loaded
```

### Image Validation
```typescript
import { validateImage } from '@/utils/imageUtils'

const validateProductImage = async (imageData: string) => {
  const result = await validateImage(imageData)
  if (!result.valid) {
    console.error('Image validation failed:', result.error)
  }
  return result
}
```

## Testing

### Test Page
Visit `/test-database` to test the image fetching functionality:

1. **Product List**: View all products with their images
2. **Image Details**: See different image sizes and formats
3. **Validation**: Test image validation for each product
4. **Performance**: Monitor image loading performance

### Test Features
- ✅ Image loading states
- ✅ Error handling
- ✅ Responsive image generation
- ✅ Base64 image support
- ✅ Image validation
- ✅ Performance optimization

## Configuration

### Image Optimization Settings
```typescript
// Default optimization parameters
const DEFAULT_IMAGE_CONFIG = {
  thumbnail: { width: 100, height: 100, quality: 70 },
  small: { width: 300, height: 300, quality: 75 },
  medium: { width: 600, height: 600, quality: 80 },
  large: { width: 800, height: 800, quality: 85 }
}
```

### CDN Configuration
```typescript
// Unsplash optimization
if (url.includes('unsplash.com')) {
  return `${url}?w=${width}&h=${height}&fit=crop&q=${quality}`
}

// Cloudinary optimization
if (url.includes('cloudinary.com')) {
  return `${baseUrl}/upload/c_fill,w_${width},h_${height},q_${quality}/${imagePath}`
}
```

## Best Practices

### 1. Image Loading
- Always provide fallback images
- Use loading states for better UX
- Implement progressive image loading
- Preload critical images

### 2. Performance
- Optimize image sizes for different devices
- Use appropriate quality settings
- Implement lazy loading for non-critical images
- Cache optimized images

### 3. Error Handling
- Validate images before display
- Provide meaningful error messages
- Use placeholder images for failed loads
- Log image loading errors for debugging

### 4. Accessibility
- Always include alt text for images
- Provide text alternatives for decorative images
- Ensure sufficient color contrast
- Support keyboard navigation

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check network connectivity
   - Verify image URLs are accessible
   - Ensure CORS is properly configured
   - Check browser console for errors

2. **Base64 images not displaying**
   - Validate Base64 format
   - Check MIME type detection
   - Ensure proper data URL formatting

3. **Performance issues**
   - Optimize image sizes
   - Implement lazy loading
   - Use CDN for image delivery
   - Enable browser caching

4. **Memory issues**
   - Limit concurrent image preloading
   - Implement image cleanup
   - Use appropriate image compression
   - Monitor memory usage

### Debug Tools
- Browser Developer Tools
- Network tab for image requests
- Console for error messages
- Performance tab for loading times

## Future Enhancements

### Planned Features
- [ ] WebP format support
- [ ] Advanced image compression
- [ ] Image lazy loading component
- [ ] Image upload with preview
- [ ] Batch image processing
- [ ] Image analytics and monitoring

### Performance Improvements
- [ ] Service Worker for image caching
- [ ] Progressive JPEG support
- [ ] Image format auto-detection
- [ ] Adaptive quality based on connection
- [ ] Background image preloading

## Support

For issues or questions regarding image fetching functionality:

1. Check the test page at `/test-database`
2. Review browser console for errors
3. Verify image URLs and formats
4. Test with different image types
5. Check network connectivity

## Dependencies

- React 18+
- TypeScript 4.5+
- Lucide React (for icons)
- Next.js 13+ (for image optimization)

## License

This image fetching functionality is part of the beauty website application and follows the same licensing terms.
