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
  };
  paymentMethod: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data?: CheckoutResponseData;
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

  // Get customer by ID
  async getCustomerById(customerId: string): Promise<ApiResponse<Customer>> {
    return this.request<Customer>(`/customers/${customerId}`);
  }

  // Get customer orders by customer ID
  async getCustomerOrders(customerId: string): Promise<ApiResponse<CustomerOrder[]>> {
    return this.request<CustomerOrder[]>(`/customers/${customerId}/orders`);
  }

  // Update customer information
  async updateCustomer(customerId: string, customerData: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return this.request<Customer>(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  // Find customer by email or phone number
  async findCustomerByContact(email?: string, phoneNumber?: string): Promise<ApiResponse<Customer>> {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (phoneNumber) params.append('phoneNumber', phoneNumber);
    
    return this.request<Customer>(`/customers/find?${params.toString()}`);
  }

  // Get customer orders by email or phone number
  async getCustomerOrdersByContact(email?: string, phoneNumber?: string): Promise<ApiResponse<CustomerOrder[]>> {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (phoneNumber) params.append('phoneNumber', phoneNumber);
    
    return this.request<CustomerOrder[]>(`/customers/orders/find?${params.toString()}`);
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
  getCategories,
  getBrands,
  searchProducts,
  submitCheckout,
  getCustomerById,
  getCustomerOrders,
  updateCustomer,
  findCustomerByContact,
  getCustomerOrdersByContact,
} = apiService;