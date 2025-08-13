// Product interface for database products
export interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  rating: number
  reviewCount: number
  isNew?: boolean
  isSale?: boolean
  discount?: number
  description?: string
  size?: string
  skinType?: string
  benefits?: string[]
  inStock?: boolean
  category?: string
  productType?: 'makeup' | 'skincare' | 'perfume' | 'hair'
  skinTone?: string[]
  finish?: string[]
  isTrending?: boolean
  crueltyFree?: boolean
  vegan?: boolean
  luxury?: boolean
  cleanBeauty?: boolean
  dermatologistRecommended?: boolean
  fragranceFree?: boolean
  salonProfessional?: boolean
  sulfateFree?: boolean
  hairType?: string[]
  hairConcern?: string[]
  hairTexture?: string[]
  skinConcern?: string[]
  ingredients?: string[]
  fragranceFamily?: string
  concentration?: string
  season?: string
  longLasting?: boolean
}

// Empty array - all data will come from database
export const allProducts: Product[] = []

// Search function - returns empty array since all data comes from database
export const searchProducts = (query: string): Product[] => {
  // All search functionality is handled by the database API
  return []
}

// Get product by ID - returns undefined since all data comes from database
export const getProductById = (id: string): Product | undefined => {
  // All product fetching is handled by the database API
  return undefined
}

// Get products by category - returns empty array since all data comes from database
export const getProductsByCategory = (category: string): Product[] => {
  // All category filtering is handled by the database API
  return []
} 