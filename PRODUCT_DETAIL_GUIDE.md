# Product Detail Page Functionality Guide

This guide explains how the product detail functionality works when clicking on products from different categories (featured, brands, skin care, hair, makeup, etc.) and how data is fetched from the database.

## Overview

When a user clicks on a product card from any category page, the system:

1. **Navigates to the product detail page** (`/product/[id]`)
2. **Fetches product data from the database** using the product ID
3. **Fetches related products** from the database
4. **Falls back gracefully** if the API is not available

## How It Works

### 1. Product Card Click Handling

The `ProductCard` component handles product clicks by:

```typescript
const getProductUrl = () => {
  // For products fetched from API, just use the ID to fetch from database
  if (id && id.length > 10) { // Assuming API IDs are longer than static IDs
    return `/product/${id}`
  }
  
  // For static products, pass data through URL parameters
  const productData = { /* all product data */ }
  const params = new URLSearchParams()
  // ... encode product data as URL parameters
  return `/product/${id}?${params.toString()}`
}
```

### 2. Product Detail Page Data Fetching

The `ProductDetails` component uses multiple data sources:

```typescript
// Fetch product from database using the hook
const { product: dbProduct, loading: dbLoading, error: dbError } = useProductById(productId)

// Fetch related products from database
const { products: relatedProducts, loading: relatedLoading } = useRelatedProducts(productId, 4)

// Parse product data from URL parameters if available
const urlProduct = getProductFromParams()

// Use database product if available, otherwise fall back to URL parameters or static data
const product = dbProduct || urlProduct || getProductData(productId)
```

### 3. Data Priority Order

1. **Database data** (highest priority) - Real-time data from API
2. **URL parameters** - Data passed through URL when clicking static products
3. **Static data** - Fallback data for demo purposes

## API Integration

### Required API Endpoints

The system expects these API endpoints to be available:

```typescript
// Get product by ID
GET /api/products/:id

// Get related products
GET /api/products/:id/related?limit=4

// Get products by category
GET /api/products?category=makeup&limit=50

// Get featured products
GET /api/products/featured?limit=8

// Get new arrivals
GET /api/products/new-arrivals?limit=8

// Get best sellers
GET /api/products/best-sellers?limit=8
```

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

## Category Pages Integration

All category pages (Makeup, Skin Care, Hair, Perfume, etc.) use the same pattern:

### 1. Fetch Products from API

```typescript
// In MakeupProducts.tsx, SkinCareProducts.tsx, etc.
const { products: apiProducts, loading, error } = useProducts({ 
  category: 'Makeup', // or 'Skincare', 'Hair', etc.
  limit: 50 
})
```

### 2. Map Products to ProductCard Props

```typescript
const mapProductToCardProps = (product: any) => ({
  id: product._id || product.id,
  name: product.name,
  brand: product.brand,
  price: product.price,
  // ... all other product properties
})
```

### 3. Render Product Cards

```typescript
{displayedProducts.map((product) => (
  <div key={mapProductToCardProps(product).id}>
    <ProductCard {...mapProductToCardProps(product)} />
  </div>
))}
```

## Error Handling and Fallbacks

### 1. API Unavailable

If the API server is not running:

- Product cards still work with static data
- Product detail page shows loading state briefly
- Falls back to URL parameters or static data
- Shows appropriate error messages

### 2. Product Not Found

If a product ID doesn't exist in the database:

- Shows error message
- Provides link to return to home page
- Logs error for debugging

### 3. Network Issues

If there are network connectivity issues:

- Shows loading state
- Retries automatically
- Falls back to cached data if available

## Testing the Functionality

### 1. Test Page

Visit `/api-test` to see a comprehensive test page that demonstrates:

- Different product categories (Featured, New Arrivals, Best Sellers, All)
- Product cards with proper navigation
- Loading states and error handling
- Instructions for testing

### 2. Manual Testing

1. **With API running:**
   - Click any product card
   - Should navigate to `/product/[id]`
   - Should fetch real data from database
   - Should show related products from database

2. **Without API running:**
   - Click any product card
   - Should navigate to `/product/[id]`
   - Should show static data or URL parameter data
   - Should show appropriate error messages

## File Structure

```
components/
├── ProductCard.tsx          # Handles product clicks and navigation
├── ProductDetails.tsx       # Main product detail page component
├── MakeupProducts.tsx       # Makeup category page
├── SkinCareProducts.tsx     # Skin care category page
├── HairProducts.tsx         # Hair category page
├── PerfumeProducts.tsx      # Perfume category page
├── FeaturedProducts.tsx     # Featured products page
├── Brands.tsx              # Brands page
└── ApiTest.tsx             # Test page for functionality

hooks/
└── useProducts.ts          # Custom hooks for API calls

services/
└── api.ts                 # API service functions

app/
└── product/
    └── [id]/
        └── page.tsx       # Product detail page route
```

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://back-cosmo.vercel.app/api
```

### API Base URL

The API base URL can be configured in `services/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://back-cosmo.vercel.app/api';
```

## Best Practices

1. **Always provide fallbacks** - The system should work even without the API
2. **Show loading states** - Users should know when data is being fetched
3. **Handle errors gracefully** - Provide clear error messages and recovery options
4. **Use TypeScript** - All components are properly typed for better development experience
5. **Optimize performance** - Use React hooks efficiently and avoid unnecessary re-renders

## Troubleshooting

### Common Issues

1. **Products not loading:**
   - Check if API server is running
   - Verify API endpoints are correct
   - Check browser console for errors

2. **Product detail page not working:**
   - Verify product ID format
   - Check if product exists in database
   - Ensure API endpoint is accessible

3. **Related products not showing:**
   - Check if related products API endpoint exists
   - Verify product relationships in database
   - Check API response format

### Debug Mode

Enable debug logging by adding to your environment:

```env
NEXT_PUBLIC_DEBUG=true
```

This will show detailed console logs for API calls and data flow.
