// Centralized product data for search functionality
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

// Combined product data from all components
export const allProducts: Product[] = [
  // Makeup Products
  {
    id: 'mk1',
    name: 'Legendary Longwear Lip Liner',
    brand: 'Pat McGrath Labs',
    price: 31.64,
    originalPrice: 35.00,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop&crop=left',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop&crop=right'
    ],
    rating: 4.8,
    reviewCount: 156,
    isNew: true,
    isSale: false,
    discount: 0,
    description: 'A long-lasting lip liner that defines and shapes lips with rich color.',
    size: '1.2g',
    skinType: 'All skin types',
    benefits: ['Long-lasting', 'Rich color', 'Smooth application'],
    inStock: true,
    category: 'Lips',
    productType: 'makeup',
    skinTone: ['Fair', 'Light', 'Medium', 'Deep'],
    finish: ['Matte', 'Long-lasting'],
    isTrending: true,
    crueltyFree: true,
    vegan: true,
    luxury: true
  },
  {
    id: 'mk2',
    name: 'Unlocked Instant Extensions Mascara',
    brand: 'Hourglass',
    price: 36.16,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 89,
    category: 'Eyes',
    skinTone: ['All Skin Tones'],
    finish: ['Volumizing', 'Lengthening'],
    crueltyFree: true,
    cleanBeauty: true,
    productType: 'makeup'
  },
  {
    id: 'mk3',
    name: 'Unreal Lips Healthy Glow Nectar Oil',
    brand: 'Charlotte Tilbury',
    price: 23.73,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 234,
    category: 'Lips',
    skinTone: ['All Skin Tones'],
    finish: ['Glossy', 'Hydrating'],
    isSale: true,
    discount: 21,
    crueltyFree: true,
    luxury: true,
    productType: 'makeup'
  },
  {
    id: 'mk4',
    name: 'Curator Eyeshadow Palette',
    brand: 'Hourglass',
    price: 75.71,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 67,
    category: 'Eyes',
    productType: 'makeup'
  },

  // Skin Care Products
  {
    id: 'sk1',
    name: 'Hyaluronic Acid 2% + B5',
    brand: 'The Ordinary',
    price: 7.80,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 1247,
    category: 'Serums',
    skinType: 'All Skin Types',
    skinConcern: ['Hydration', 'Anti-aging'],
    ingredients: ['Hyaluronic Acid', 'Vitamin B5'],
    isNew: true,
    isTrending: true,
    crueltyFree: true,
    vegan: true,
    dermatologistRecommended: true,
    description: 'A lightweight serum that provides intense hydration and plumps the skin.',
    size: '30ml',
    benefits: ['Hydrating', 'Plumping', 'Anti-aging'],
    inStock: true,
    productType: 'skincare'
  },
  {
    id: 'sk2',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    price: 6.80,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 892,
    category: 'Serums',
    skinType: 'Oily Skin',
    skinConcern: ['Acne', 'Oil Control', 'Pores'],
    ingredients: ['Niacinamide', 'Zinc'],
    isTrending: true,
    crueltyFree: true,
    vegan: true,
    productType: 'skincare'
  },
  {
    id: 'sk3',
    name: 'CeraVe Moisturizing Cream',
    brand: 'CeraVe',
    price: 19.99,
    originalPrice: 24.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 2156,
    category: 'Moisturizers',
    skinType: 'Dry Skin',
    skinConcern: ['Dryness', 'Sensitive Skin'],
    ingredients: ['Ceramides', 'Hyaluronic Acid'],
    isSale: true,
    discount: 20,
    dermatologistRecommended: true,
    fragranceFree: true,
    productType: 'skincare'
  },

  // Hair Products
  {
    id: 'hr1',
    name: 'Olaplex No. 3 Hair Perfector',
    brand: 'Olaplex',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 2156,
    category: 'Treatments',
    hairType: ['All Hair Types'],
    hairConcern: ['Damage Repair', 'Bond Building'],
    hairTexture: ['Fine', 'Medium', 'Thick'],
    isNew: true,
    isTrending: true,
    salonProfessional: true,
    crueltyFree: true,
    sulfateFree: true,
    description: 'A professional hair repair treatment that strengthens and restores damaged hair bonds.',
    size: '100ml',
    skinType: 'All skin types',
    benefits: ['Repair', 'Strengthening', 'Restoration'],
    inStock: true,
    productType: 'hair'
  },
  {
    id: 'hr2',
    name: 'Briogeo Don\'t Despair, Repair! Deep Conditioning Mask',
    brand: 'Briogeo',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 892,
    category: 'Masks',
    hairType: ['Damaged Hair'],
    hairConcern: ['Damage Repair', 'Hydration'],
    hairTexture: ['Medium', 'Thick'],
    crueltyFree: true,
    cleanBeauty: true,
    productType: 'hair'
  },

  // New & Trending Products
  {
    id: 'nt1',
    name: 'Radiant Glow Foundation',
    brand: 'Beauty Luxe',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 120,
    isNew: true,
    isTrending: true,
    luxury: true,
    crueltyFree: true,
    productType: 'makeup'
  },
  {
    id: 'nt2',
    name: 'Velvet Matte Lipstick',
    brand: 'Glamour Co.',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 95,
    isNew: true,
    isTrending: false,
    crueltyFree: true,
    productType: 'makeup'
  }
]

// Search function
export const searchProducts = (query: string): Product[] => {
  if (!query.trim()) return []
  
  const searchTerm = query.toLowerCase().trim()
  
  return allProducts.filter(product => {
    // Search in name, brand, category, description, and benefits
    const searchableFields = [
      product.name,
      product.brand,
      product.category,
      product.description,
      ...(product.benefits || []),
      ...(product.ingredients || []),
      ...(product.skinConcern || []),
      ...(product.hairConcern || []),
      product.fragranceFamily,
      product.concentration,
      product.season
    ].filter((field): field is string => Boolean(field)).map(field => field.toLowerCase())
    
    return searchableFields.some(field => field.includes(searchTerm))
  })
}

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  return allProducts.find(product => product.id === id)
}

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return allProducts.filter(product => 
    product.category?.toLowerCase() === category.toLowerCase() ||
    product.productType?.toLowerCase() === category.toLowerCase()
  )
} 