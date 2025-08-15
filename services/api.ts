// API service for communicating with the backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://back-cosmo.vercel.app'
  : 'http://localhost:5000/api';

export interface ApiResponse<T> {
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
  filters?: any;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
  description?: string;
  size?: string;
  skinType?: string[];
  benefits?: string[];
  inStock?: boolean;
  category?: string;
  productType?: string;
  skinTone?: string[];
  finish?: string[];
  isTrending?: boolean;
  crueltyFree?: boolean;
  vegan?: boolean;
  luxury?: boolean;
  cleanBeauty?: boolean;
  dermatologistRecommended?: boolean;
  fragranceFree?: boolean;
  salonProfessional?: boolean;
  sulfateFree?: boolean;
  hairType?: string[];
  hairConcern?: string[];
  hairTexture?: string[];
  skinConcern?: string[];
  ingredients?: string[];
  fragranceFamily?: string;
  concentration?: string;
  season?: string[];
  longLasting?: boolean;
  stock?: number;
  sku?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  skinType?: string;
  hairType?: string;
  crueltyFree?: boolean;
  vegan?: boolean;
  luxury?: boolean;
  cleanBeauty?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CheckoutData {
  customerInfo: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  };
  items: Array<{
    product: string; // product ID
    productName: string;
    brand: string;
    price: number;
    quantity: number;
    image: string;
    sku?: string;
  }>;
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    street: string;
    city: string;
    region: string;
    country?: string;
    postalCode?: string;
  };
  shippingCost: number;
  discount?: number;
  notes?: string;
  paymentMethod?: 'cash_on_delivery' | 'bank_transfer' | 'mobile_money' | 'card';
  customerId?: string; // Clerk user ID for authentication
}

export interface CheckoutResponseData {
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerName: string;
  customerId?: string; // Add customer ID for tracking
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data?: CheckoutResponseData;
}

export interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  addresses: Array<{
    type: string;
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerOrder {
  _id: string;
  orderNumber: string;
  date: string;
  items: number;
  total: number;
  status: string;
  products: Array<{
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  customerId: string;
  shippingAddress: {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode?: string;
    fullName?: string;
    phoneNumber?: string;
  };
  paymentMethod: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        console.error(`API request failed with status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API request successful:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      // Return a structured error response instead of throwing
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
        data: undefined
      };
    }
  }

  // Get all products with filtering and pagination
  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    return this.request<Product[]>(`/products?${params.toString()}`);
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/featured?limit=${limit}`);
  }

  // Get new arrivals
  async getNewArrivals(limit: number = 8): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/new-arrivals?limit=${limit}`);
  }

  // Get best sellers
  async getBestSellers(limit: number = 8): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/best-sellers?limit=${limit}`);
  }

  // Get products on sale
  async getSaleProducts(limit: number = 8): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/on-sale?limit=${limit}`);
  }

  // Get product by ID
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    console.log(`Fetching product by ID: ${id}`);
    const response = await this.request<Product>(`/products/${id}`);
    console.log(`Product fetch result:`, response);
    return response;
  }

  // Get related products
  async getRelatedProducts(productId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/${productId}/related?limit=${limit}`);
  }

  // Get related products by same brand and category
  async getRelatedProductsByBrandAndCategory(brand: string, category: string, excludeProductId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    params.append('brand', brand);
    params.append('category', category);
    params.append('exclude', excludeProductId);
    params.append('limit', limit.toString());
    return this.request<Product[]>(`/products/related/brand-category?${params.toString()}`);
  }

  // Get related products by same brand only
  async getRelatedProductsByBrand(brand: string, excludeProductId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    params.append('brand', brand);
    params.append('exclude', excludeProductId);
    params.append('limit', limit.toString());
    return this.request<Product[]>(`/products/related/brand?${params.toString()}`);
  }

  // Get related products by same category only
  async getRelatedProductsByCategory(category: string, excludeProductId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    params.append('category', category);
    params.append('exclude', excludeProductId);
    params.append('limit', limit.toString());
    return this.request<Product[]>(`/products/related/category?${params.toString()}`);
  }

  // Get product categories
  async getCategories(): Promise<ApiResponse<Array<{ category: string; count: number }>>> {
    return this.request<Array<{ category: string; count: number }>>(`/products/categories`);
  }

  // Get product brands
  async getBrands(): Promise<ApiResponse<Array<{ brand: string; count: number }>>> {
    return this.request<Array<{ brand: string; count: number }>>(`/products/brands`);
  }

  // Search products
  async searchProducts(query: string, filters: Omit<ProductFilters, 'search'> = {}): Promise<ApiResponse<Product[]>> {
    return this.getProducts({ ...filters, search: query });
  }

  // Submit checkout order
  async submitCheckout(checkoutData: CheckoutData): Promise<CheckoutResponse> {
    try {
      console.log('Submitting checkout data:', checkoutData);
      
      // Ensure payment method is set (default to cash on delivery)
      const orderData = {
        ...checkoutData,
        paymentMethod: checkoutData.paymentMethod || 'cash_on_delivery'
      };
      
      const response = await this.request<CheckoutResponseData>('/public/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      
      console.log('Checkout response:', response);
      
      // Return the response data directly since we're expecting CheckoutResponse
      if (response.success && response.data) {
        return {
          success: true,
          message: response.message,
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.message || 'Checkout failed',
          data: undefined
        };
      }
    } catch (error) {
      console.error('Checkout submission error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit checkout',
        data: undefined
      };
    }
  }

  // Get orders by customer contact information
  async getOrdersByContactInfo(
    fullName: string,
    phoneNumber: string,
    email?: string
  ): Promise<ApiResponse<CustomerOrder[]>> {
    try {
      // First try to get all orders and filter by customer info
      const response = await this.request<any>('/orders');
      
      if (response.success && response.data) {
        // Filter orders by customer information - be more strict about matching
        const filteredOrders = response.data.filter((order: any) => {
          // Get customer info from the order
          const orderCustomerName = order.shippingAddress?.fullName || '';
          const orderPhone = order.shippingAddress?.phoneNumber || '';
          const orderEmail = order.customerEmail || order.customerInfo?.email || '';
          
          // More strict matching - only show orders that actually belong to this user
          let nameMatch = false;
          let phoneMatch = false;
          let emailMatch = false;
          
          // Name matching - check if names are similar (allowing for slight variations)
          if (fullName && orderCustomerName) {
            const normalizedFullName = fullName.toLowerCase().trim();
            const normalizedOrderName = orderCustomerName.toLowerCase().trim();
            
            // Exact match or if one name contains the other
            nameMatch = normalizedFullName === normalizedOrderName ||
                       normalizedFullName.includes(normalizedOrderName) ||
                       normalizedOrderName.includes(normalizedFullName);
          }
          
          // Phone matching - check if phone numbers match (allowing for format differences)
          if (phoneNumber && orderPhone) {
            const normalizedPhone = phoneNumber.replace(/\D/g, '');
            const normalizedOrderPhone = orderPhone.replace(/\D/g, '');
            
            // Match if they're the same or if one ends with the other (for different formats)
            phoneMatch = normalizedPhone === normalizedOrderPhone ||
                        normalizedPhone.endsWith(normalizedOrderPhone) ||
                        normalizedOrderPhone.endsWith(normalizedPhone);
          }
          
          // Email matching - must be exact match if email exists
          if (email && orderEmail) {
            emailMatch = email.toLowerCase().trim() === orderEmail.toLowerCase().trim();
          } else if (!email && !orderEmail) {
            // If neither has email, consider it a match
            emailMatch = true;
          } else {
            // If one has email and the other doesn't, it's not a match
            emailMatch = false;
          }
          
          // Order must match at least 2 out of 3 criteria to be considered the user's order
          const matchCount = [nameMatch, phoneMatch, emailMatch].filter(Boolean).length;
          return matchCount >= 2;
        });
        
        console.log(`🔍 Found ${filteredOrders.length} orders matching user criteria out of ${response.data.length} total orders`);
        
        // Transform the filtered orders to match our CustomerOrder interface
        const transformedOrders: CustomerOrder[] = filteredOrders.map((order: any) => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          date: order.createdAt,
          items: order.items?.length || 0,
          total: order.totalAmount,
          status: order.status,
          products: order.items?.map((item: any) => ({
            name: item.productSnapshot?.name || item.productName || 'Unknown Product',
            image: item.productSnapshot?.image || item.image || 'https://via.placeholder.com/150',
            quantity: item.quantity,
            price: item.price
          })) || [],
          customerId: order.customerId || '',
          shippingAddress: {
            street: order.shippingAddress?.street || '',
            city: order.shippingAddress?.city || '',
            region: order.shippingAddress?.region || '',
            country: order.shippingAddress?.country || '',
            postalCode: order.shippingAddress?.postalCode || '',
            fullName: order.shippingAddress?.fullName || '',
            phoneNumber: order.shippingAddress?.phoneNumber || ''
          },
          paymentMethod: order.paymentMethod || 'unknown'
        }));
        
        return {
          success: true,
          message: `Found ${transformedOrders.length} orders for you`,
          data: transformedOrders
        };
      }
      
      return {
        success: false,
        message: 'No orders found',
        data: []
      };
    } catch (error) {
      console.error('Error fetching orders by contact info:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch orders',
        data: []
      };
    }
  }

  // Get orders by email address only
  async getOrdersByEmail(email: string): Promise<ApiResponse<CustomerOrder[]>> {
    try {
      if (!email) {
        return {
          success: false,
          message: 'Email address is required',
          data: []
        };
      }

      // Get all orders and filter by email
      const response = await this.request<any>('/orders');
      
      if (response.success && response.data) {
        // Filter orders by email address
        const filteredOrders = response.data.filter((order: any) => {
          const orderEmail = order.customerEmail || order.customerInfo?.email || '';
          return orderEmail.toLowerCase().trim() === email.toLowerCase().trim();
        });
        
        console.log(`🔍 Found ${filteredOrders.length} orders matching email ${email} out of ${response.data.length} total orders`);
        
        // Transform the filtered orders to match our CustomerOrder interface
        const transformedOrders: CustomerOrder[] = filteredOrders.map((order: any) => ({
          _id: order._id,
          orderNumber: order.orderNumber,
          date: order.createdAt,
          items: order.items?.length || 0,
          total: order.totalAmount,
          status: order.status,
          products: order.items?.map((item: any) => ({
            name: item.productSnapshot?.name || item.productName || 'Unknown Product',
            image: item.productSnapshot?.image || item.image || 'https://via.placeholder.com/150',
            quantity: item.quantity,
            price: item.price
          })) || [],
          customerId: order.customerId || '',
          shippingAddress: {
            street: order.shippingAddress?.street || '',
            city: order.shippingAddress?.city || '',
            region: order.shippingAddress?.region || '',
            country: order.shippingAddress?.country || '',
            postalCode: order.shippingAddress?.postalCode || '',
            fullName: order.shippingAddress?.fullName || '',
            phoneNumber: order.shippingAddress?.phoneNumber || ''
          },
          paymentMethod: order.paymentMethod || 'unknown'
        }));
        
        return {
          success: true,
          message: `Found ${transformedOrders.length} orders for email ${email}`,
          data: transformedOrders
        };
      }
      
      return {
        success: false,
        message: 'No orders found',
        data: []
      };
    } catch (error) {
      console.error('Error fetching orders by email:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch orders',
        data: []
      };
    }
  }
}

// Create a singleton instance
export const apiService = new ApiService();

// Export individual methods for convenience
export const {
  getProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getSaleProducts,
  getProductById,
  getRelatedProducts,
  getRelatedProductsByBrandAndCategory,
  getRelatedProductsByBrand,
  getRelatedProductsByCategory,
  getCategories,
  getBrands,
  searchProducts,
  submitCheckout,
  getOrdersByContactInfo,
  getOrdersByEmail,
} = apiService;