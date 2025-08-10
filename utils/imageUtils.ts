// Utility functions for handling Base64 images and image optimization

export const getBase64ImageUrl = (base64Data: string, mimeType: string = 'image/jpeg'): string => {
  if (!base64Data) return '';
  
  // If it's already a data URL, return as is
  if (base64Data.startsWith('data:')) {
    return base64Data;
  }
  
  // Try to detect MIME type from Base64 data
  const detectedMimeType = detectMimeTypeFromBase64(base64Data) || mimeType;
  
  // Convert Base64 string to data URL
  return `data:${detectedMimeType};base64,${base64Data}`;
};

export const detectMimeTypeFromBase64 = (base64Data: string): string | null => {
  if (!base64Data || base64Data.length < 4) {
    return null;
  }
  
  try {
    // Get the first few bytes to detect MIME type
    const bytes = atob(base64Data.substring(0, 8));
    const uint8Array = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      uint8Array[i] = bytes.charCodeAt(i);
    }
    
    // Check for common image signatures
    const signature = Array.from(uint8Array.slice(0, 4))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('').toUpperCase();
    
    // PNG signature: 89 50 4E 47
    if (signature.startsWith('89504E47')) {
      return 'image/png';
    }
    
    // JPEG signature: FF D8 FF
    if (signature.startsWith('FFD8FF')) {
      return 'image/jpeg';
    }
    
    // GIF signature: 47 49 46 38
    if (signature.startsWith('47494638')) {
      return 'image/gif';
    }
    
    // WebP signature: 52 49 46 46 ... 57 45 42 50
    if (signature.startsWith('52494646')) {
      return 'image/webp';
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

export const isValidBase64 = (str: string): boolean => {
  if (!str || typeof str !== 'string') {
    return false;
  }
  
  // Remove any whitespace
  const cleanStr = str.trim();
  
  // Check if it looks like Base64 (alphanumeric + / + =)
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(cleanStr)) {
    return false;
  }
  
  // Check if length is valid (must be multiple of 4)
  if (cleanStr.length % 4 !== 0) {
    return false;
  }
  
  try {
    // Try to decode and re-encode to validate
    return btoa(atob(cleanStr)) === cleanStr;
  } catch (err) {
    return false;
  }
};

export const getProductImage = (imageData: string | undefined): string => {
  if (!imageData) {
    // Return a default placeholder image
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop';
  }
  
  // If it's already a URL, return as is
  if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
    return imageData;
  }
  
  // If it's Base64 data, convert to data URL
  if (isValidBase64(imageData)) {
    console.log('Converting Base64 image to data URL');
    return getBase64ImageUrl(imageData);
  }
  
  // If it's a data URL, return as is
  if (imageData.startsWith('data:')) {
    console.log('Image is already a data URL');
    return imageData;
  }
  
  // Log the image data type for debugging
  console.log('Image data type:', typeof imageData, 'Length:', imageData.length, 'Starts with:', imageData.substring(0, 50));
  
  // Default fallback
  return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop';
};

// Enhanced image optimization functions
export const optimizeImageUrl = (url: string, width: number = 400, height: number = 400, quality: number = 80): string => {
  if (!url) return getProductImage('');
  
  // If it's a data URL or Base64, return as is (can't optimize)
  if (url.startsWith('data:') || isValidBase64(url)) {
    return url;
  }
  
  // If it's an Unsplash URL, add optimization parameters
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&h=${height}&fit=crop&q=${quality}`;
  }
  
  // If it's a Cloudinary URL, add transformation parameters
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0];
    const imagePath = url.split('/upload/')[1];
    return `${baseUrl}/upload/c_fill,w_${width},h_${height},q_${quality}/${imagePath}`;
  }
  
  // For other URLs, return as is
  return url;
};

// Preload image function for better performance
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// Batch preload images
export const preloadImages = async (imageUrls: string[]): Promise<HTMLImageElement[]> => {
  const promises = imageUrls.map(url => preloadImage(url));
  return Promise.allSettled(promises).then(results => 
    results
      .filter((result): result is PromiseFulfilledResult<HTMLImageElement> => result.status === 'fulfilled')
      .map(result => result.value)
  );
};

// Get optimized image URLs for different sizes
export const getResponsiveImageUrls = (imageData: string | undefined) => {
  const baseUrl = getProductImage(imageData);
  
  return {
    thumbnail: optimizeImageUrl(baseUrl, 100, 100, 70),
    small: optimizeImageUrl(baseUrl, 300, 300, 75),
    medium: optimizeImageUrl(baseUrl, 600, 600, 80),
    large: optimizeImageUrl(baseUrl, 800, 800, 85),
    original: baseUrl
  };
};

// Utility function to test Base64 image conversion
export const testBase64Image = (base64Data: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!base64Data) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    
    try {
      const dataUrl = getBase64ImageUrl(base64Data);
      img.src = dataUrl;
    } catch (error) {
      resolve(false);
    }
  });
};

// Image validation function
export const validateImage = async (imageData: string): Promise<{ valid: boolean; error?: string }> => {
  if (!imageData) {
    return { valid: false, error: 'No image data provided' };
  }
  
  try {
    // If it's a URL, try to fetch it
    if (imageData.startsWith('http')) {
      const response = await fetch(imageData, { method: 'HEAD' });
      if (!response.ok) {
        return { valid: false, error: `Image URL returned status ${response.status}` };
      }
      const contentType = response.headers.get('content-type');
      if (!contentType?.startsWith('image/')) {
        return { valid: false, error: 'URL does not point to an image' };
      }
      return { valid: true };
    }
    
    // If it's Base64, validate it
    if (isValidBase64(imageData)) {
      const isValid = await testBase64Image(imageData);
      return { valid: isValid, error: isValid ? undefined : 'Invalid Base64 image data' };
    }
    
    // If it's a data URL, validate it
    if (imageData.startsWith('data:')) {
      const isValid = await testBase64Image(imageData.split(',')[1] || '');
      return { valid: isValid, error: isValid ? undefined : 'Invalid data URL' };
    }
    
    return { valid: false, error: 'Unsupported image format' };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Get image dimensions
export const getImageDimensions = (imageData: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for dimension detection'));
    };
    img.src = getProductImage(imageData);
  });
};

// Convert image to Base64 (for uploads)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the Base64 data
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Compress image before upload
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
};
