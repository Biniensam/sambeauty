import { Product as ApiProduct } from '@/services/api'

export interface ProductCardProps {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
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
  productType?: string
  skinTone?: string[]
  finish?: string[]
  skinConcern?: string[]
  ingredients?: string[]
  hairType?: string[]
  hairConcern?: string[]
  hairTexture?: string[]
  fragranceFamily?: string
  concentration?: string
  season?: string
  crueltyFree?: boolean
  vegan?: boolean
  luxury?: boolean
  cleanBeauty?: boolean
  dermatologistRecommended?: boolean
  salonProfessional?: boolean
  heatProtection?: boolean
  longLasting?: boolean
  isTrending?: boolean
  broadSpectrum?: boolean
}

export const mapApiProductToCardProps = (product: ApiProduct): ProductCardProps => {
  return {
    id: product._id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    rating: product.rating,
    reviewCount: product.reviewCount,
    isNew: product.isNew,
    isSale: product.isSale,
    discount: product.discount,
    description: product.description,
    size: product.size,
    skinType: Array.isArray(product.skinType) ? product.skinType[0] : product.skinType,
    benefits: product.benefits,
    inStock: product.inStock,
    category: product.category,
    productType: product.productType,
    skinTone: product.skinTone,
    finish: product.finish,
    skinConcern: product.skinConcern,
    ingredients: product.ingredients,
    hairType: product.hairType,
    hairConcern: product.hairConcern,
    hairTexture: product.hairTexture,
    fragranceFamily: product.fragranceFamily,
    concentration: product.concentration,
    season: Array.isArray(product.season) ? product.season[0] : product.season,
    crueltyFree: product.crueltyFree,
    vegan: product.vegan,
    luxury: product.luxury,
    cleanBeauty: product.cleanBeauty,
    dermatologistRecommended: product.dermatologistRecommended,
    salonProfessional: product.salonProfessional,
    longLasting: product.longLasting,
    isTrending: product.isTrending,
  }
}
