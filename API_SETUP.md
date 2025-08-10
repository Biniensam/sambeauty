# API Integration Setup Guide

This guide explains how to connect the frontend beauty website to the backend API.

## Backend Setup

The backend is located at `E:\back-cosmo` and provides a RESTful API for product management.

### Backend Features
- Product CRUD operations
- Filtering and pagination
- Featured products, new arrivals, best sellers
- Category and brand management
- Search functionality

### API Endpoints

#### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/best-sellers` - Get best sellers
- `GET /api/products/on-sale` - Get products on sale
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories` - Get all categories
- `GET /api/products/brands` - Get all brands

## Frontend Integration

### Environment Configuration

Create a `.env.local` file in the frontend root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://back-cosmo.vercel.app/api

# Backend URL for production
NEXT_PUBLIC_BACKEND_URL=https://back-cosmo.vercel.app
```

### API Service

The frontend uses a centralized API service (`services/api.ts`) that provides:

- Type-safe API calls
- Error handling
- Request/response interfaces
- Product data mapping

### Custom Hooks

Custom hooks in `hooks/useProducts.ts` provide:

- `useProducts()` - Fetch products with filtering
- `useFeaturedProducts()` - Fetch featured products
- `useNewArrivals()` - Fetch new arrivals
- `useBestSellers()` - Fetch best sellers
- `useSaleProducts()` - Fetch sale products
- `useProductById()` - Fetch single product

### Component Updates

The following components have been updated to use real API data:

1. **FeaturedProducts** - Now fetches from multiple API endpoints
2. **MakeupProducts** - Fetches makeup products with filtering
3. **ProductCard** - Handles both API and mock data formats

### Data Mapping

The API returns products with `_id` field, while the frontend expects `id`. A mapping function handles this conversion:

```typescript
const mapProductToCardProps = (product: any) => ({
  id: product._id || product.id,
  name: product.name,
  brand: product.brand,
  // ... other fields
})
```

## Running the Application

1. **Start the Backend**:
   ```bash
   cd E:\back-cosmo
   npm install
   npm start
   ```

2. **Start the Frontend**:
   ```bash
   cd beauty-website
   npm install
   npm run dev
   ```

3. **Verify Connection**:
   - Backend is deployed at `https://back-cosmo.vercel.app`
   - Frontend should be running on `http://localhost:3000`
   - Check browser console for API connection status

## Fallback Strategy

The frontend implements a fallback strategy:
- If API data is available, use it
- If API is unavailable, fall back to mock data
- Loading states are shown during API calls
- Error handling for failed requests

## Database Requirements

The backend expects a MongoDB database with a `products` collection containing product documents with the following structure:

```javascript
{
  _id: ObjectId,
  name: String,
  brand: String,
  price: Number,
  originalPrice: Number,
  image: String,
  images: [String],
  rating: Number,
  reviewCount: Number,
  isNew: Boolean,
  isSale: Boolean,
  discount: Number,
  description: String,
  size: String,
  skinType: [String],
  benefits: [String],
  inStock: Boolean,
  category: String,
  productType: String,
  // ... additional fields as defined in the Product model
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS configuration includes the frontend URL
2. **API Connection Failed**: Check if the backend is running and accessible
3. **Type Errors**: Verify that the Product interface matches the API response
4. **Missing Data**: Check if the database has product data

### Debug Steps

1. Check browser network tab for API requests
2. Verify backend server is running on correct port
3. Test API endpoints directly (e.g., `https://back-cosmo.vercel.app/api/products`)
4. Check environment variables are correctly set
5. Review console logs for error messages
