import { useState, useEffect, useCallback } from 'react';
import { apiService, Product, ProductFilters, ApiResponse } from '@/services/api';
import { preloadImages, getResponsiveImageUrls, validateImage } from '@/utils/imageUtils';

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination?: ApiResponse<Product[]>['pagination'];
}

interface UseProductsReturn extends UseProductsState {
  refetch: () => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
}

// New hook for handling product images
export const useProductImages = (product: Product | null) => {
  const [imageStates, setImageStates] = useState<{
    [key: number]: {
      loading: boolean;
      error: boolean;
      loaded: boolean;
      urls: ReturnType<typeof getResponsiveImageUrls>;
    };
  }>({});
  const [preloadedImages, setPreloadedImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    if (!product) {
      setImageStates({});
      setPreloadedImages([]);
      return;
    }

    const images = product.images || [product.image].filter(Boolean);
    
    // Initialize image states
    const newImageStates: typeof imageStates = {};
    images.forEach((_, index) => {
      newImageStates[index] = {
        loading: true,
        error: false,
        loaded: false,
        urls: getResponsiveImageUrls(images[index])
      };
    });
    setImageStates(newImageStates);

    // Preload all images
    const preloadAllImages = async () => {
      try {
        const imageUrls = images.map(img => getResponsiveImageUrls(img).medium);
        const loadedImages = await preloadImages(imageUrls);
        setPreloadedImages(loadedImages);
        
        // Update states for successfully loaded images
        loadedImages.forEach((img, index) => {
          if (index < images.length) {
            setImageStates(prev => ({
              ...prev,
              [index]: {
                ...prev[index],
                loading: false,
                loaded: true,
                error: false
              }
            }));
          }
        });
      } catch (error) {
        console.error('Failed to preload images:', error);
      }
    };

    preloadAllImages();
  }, [product]);

  const validateProductImages = useCallback(async () => {
    if (!product) return [];
    
    const images = product.images || [product.image].filter(Boolean);
    const validationResults = await Promise.all(
      images.map(async (image, index) => {
        const result = await validateImage(image);
        return { index, ...result };
      })
    );
    
    return validationResults;
  }, [product]);

  return {
    imageStates,
    preloadedImages,
    validateProductImages
  };
};

export const useProducts = (initialFilters: ProductFilters = {}): UseProductsReturn => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  const fetchProducts = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiService.getProducts(filters);
      
      if (response.success && response.data) {
        setState({
          products: response.data,
          loading: false,
          error: null,
          pagination: response.pagination,
        });
      } else {
        setState({
          products: [],
          loading: false,
          error: response.message || 'Failed to fetch products',
        });
      }
    } catch (error) {
      setState({
        products: [],
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refetch = useCallback(() => fetchProducts(), [fetchProducts]);

  return {
    ...state,
    refetch,
    setFilters,
  };
};

export const useFeaturedProducts = (limit: number = 8) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiService.getFeaturedProducts(limit);
        
        if (response.success && response.data) {
          setState({
            products: response.data,
            loading: false,
            error: null,
          });
        } else {
          setState({
            products: [],
            loading: false,
            error: response.message || 'Failed to fetch featured products',
          });
        }
      } catch (error) {
        setState({
          products: [],
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    };

    fetchFeaturedProducts();
  }, [limit]);

  return state;
};

export const useNewArrivals = (limit: number = 8) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiService.getNewArrivals(limit);
        
        if (response.success && response.data) {
          setState({
            products: response.data,
            loading: false,
            error: null,
          });
        } else {
          setState({
            products: [],
            loading: false,
            error: response.message || 'Failed to fetch new arrivals',
          });
        }
      } catch (error) {
        setState({
          products: [],
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    };

    fetchNewArrivals();
  }, [limit]);

  return state;
};

export const useBestSellers = (limit: number = 8) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchBestSellers = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiService.getBestSellers(limit);
        
        if (response.success && response.data) {
          setState({
            products: response.data,
            loading: false,
            error: null,
          });
        } else {
          setState({
            products: [],
            loading: false,
            error: response.message || 'Failed to fetch best sellers',
          });
        }
      } catch (error) {
        setState({
          products: [],
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    };

    fetchBestSellers();
  }, [limit]);

  return state;
};

export const useSaleProducts = (limit: number = 8) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchSaleProducts = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiService.getSaleProducts(limit);
        
        if (response.success && response.data) {
          setState({
            products: response.data,
            loading: false,
            error: null,
          });
        } else {
          setState({
            products: [],
            loading: false,
            error: response.message || 'Failed to fetch sale products',
          });
        }
      } catch (error) {
        setState({
          products: [],
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    };

    fetchSaleProducts();
  }, [limit]);

  return state;
};
export const useProductById = (id: string) => {
  const [state, setState] = useState<{
    product: Product | null;
    loading: boolean;
    error: string | null;
  }>({
    product: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) {
      setState({ product: null, loading: false, error: 'Product ID is required' });
      return;
    }

    const fetchProduct = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        console.log(`Fetching product with ID: ${id}`);
        const response = await apiService.getProductById(id);
        
        if (response.success && response.data) {
          console.log('Product fetched successfully:', response.data);
          setState({
            product: response.data,
            loading: false,
            error: null,
          });
        } else {
          console.error('Failed to fetch product:', response.message);
          setState({
            product: null,
            loading: false,
            error: response.message || 'Failed to fetch product',
          });
        }
      } catch (error) {
        console.error('Error in useProductById:', error);
        setState({
          product: null,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    };

    fetchProduct();
  }, [id]);

  return state;
};

export const useRelatedProducts = (productId: string, limit: number = 4) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!productId) {
      setState({ products: [], loading: false, error: 'Product ID is required' });
      return;
    }

    const fetchRelatedProducts = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // First, get the current product to extract brand and category
        const currentProductResponse = await apiService.getProductById(productId);
        
        if (!currentProductResponse.success || !currentProductResponse.data) {
          throw new Error('Failed to fetch current product');
        }

        const currentProduct = currentProductResponse.data;
        const { brand, category } = currentProduct;

        if (!brand || !category) {
          // Fallback to original related products if brand/category not available
          const response = await apiService.getRelatedProducts(productId, limit);
          
          if (response.success && response.data) {
            setState({
              products: response.data,
              loading: false,
              error: null,
            });
          } else {
            setState({
              products: [],
              loading: false,
              error: response.message || 'Failed to fetch related products',
            });
          }
          return;
        }

        // Only get products with EXACTLY the same brand AND same category
        const response = await apiService.getRelatedProductsByBrandAndCategory(
          brand, 
          category, 
          productId, 
          limit
        );

        console.log(`Related products by brand (${brand}) and category (${category}):`, response);

        // If API call fails, try to find related products locally
        if (!response.success || !response.data || response.data.length === 0) {
          const localRelatedProducts = await findLocalRelatedProducts(currentProduct, limit);
          if (localRelatedProducts.length > 0) {
            setState({
              products: localRelatedProducts,
              loading: false,
              error: null,
            });
            return;
          }
        }

        if (response.success && response.data) {
          setState({
            products: response.data,
            loading: false,
            error: null,
          });
        } else {
          setState({
            products: [],
            loading: false,
            error: response.message || 'Failed to fetch related products',
          });
        }
      } catch (error) {
        // If all API calls fail, try local fallback
        try {
          const currentProductResponse = await apiService.getProductById(productId);
          if (currentProductResponse.success && currentProductResponse.data) {
            const localRelatedProducts = await findLocalRelatedProducts(currentProductResponse.data, limit);
            if (localRelatedProducts.length > 0) {
              setState({
                products: localRelatedProducts,
                loading: false,
                error: null,
              });
              return;
            }
          }
        } catch (fallbackError) {
          console.error('Local fallback also failed:', fallbackError);
        }

        setState({
          products: [],
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    };

    fetchRelatedProducts();
  }, [productId, limit]);

  return state;
};

// Helper function to find related products locally
const findLocalRelatedProducts = async (currentProduct: any, limit: number): Promise<any[]> => {
  try {
    // Try to get all products and filter locally
    const allProductsResponse = await apiService.getProducts({ limit: 100 });
    
    if (!allProductsResponse.success || !allProductsResponse.data) {
      return [];
    }

    const allProducts = allProductsResponse.data;
    const { brand, category, _id } = currentProduct;
    
    // Filter products by same brand and category, excluding current product
    let relatedProducts = allProducts.filter(product => 
      product._id !== _id && 
      product.brand === brand && 
      product.category === category
    );

    // If not enough, add products by same brand
    if (relatedProducts.length < limit) {
      const brandProducts = allProducts.filter(product => 
        product._id !== _id && 
        product.brand === brand && 
        !relatedProducts.some(rp => rp._id === product._id)
      );
      relatedProducts = [...relatedProducts, ...brandProducts];
    }

    // If still not enough, add products by same category
    if (relatedProducts.length < limit) {
      const categoryProducts = allProducts.filter(product => 
        product._id !== _id && 
        product.category === category && 
        !relatedProducts.some(rp => rp._id === product._id)
      );
      relatedProducts = [...relatedProducts, ...categoryProducts];
    }

    // Return limited results
    return relatedProducts.slice(0, limit);
  } catch (error) {
    console.error('Error finding local related products:', error);
    return [];
  }
};

export const useProductsByCategory = (category: string, limit: number = 20) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!category) {
      setState({ products: [], loading: false, error: 'Category is required' });
      return;
    }

    const fetchProductsByCategory = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiService.getProducts({ category, limit });
        
        if (response.success && response.data) {
          setState({
            products: response.data,
            loading: false,
            error: null,
          });
        } else {
          setState({
            products: [],
            loading: false,
            error: response.message || 'Failed to fetch products by category',
          });
        }
      } catch (error) {
        setState({
          products: [],
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    };

    fetchProductsByCategory();
  }, [category, limit]);

  return state;
};

export const useProductsByBrand = (brand: string, limit: number = 20) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!brand) {
      setState({ products: [], loading: false, error: 'Brand is required' });
      return;
    }

    const fetchProductsByBrand = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiService.getProducts({ brand, limit });
        
        if (response.success && response.data) {
          setState({
            products: response.data,
            loading: false,
            error: null,
          });
        } else {
          setState({
            products: [],
            loading: false,
            error: response.message || 'Failed to fetch products by brand',
          });
        }
      } catch (error) {
        setState({
          products: [],
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    };

    fetchProductsByBrand();
  }, [brand, limit]);

  return state;
};

// Search products hook for database search
export const useSearchProducts = (query: string, filters: Omit<ProductFilters, 'search'> = {}) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: false,
    error: null,
  });

  // Memoize the filters to prevent unnecessary re-renders
  const memoizedFilters = useCallback(() => filters, [JSON.stringify(filters)]);

  useEffect(() => {
    if (!query.trim()) {
      setState({ products: [], loading: false, error: null });
      return;
    }

    let isMounted = true;

    const searchProducts = async () => {
      if (!isMounted) return;
      
      console.log('Searching for:', query);
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiService.searchProducts(query, memoizedFilters());
        
        if (!isMounted) return;
        
        if (response.success && response.data) {
          console.log('Search results from API:', response.data.length, 'products');
          setState({
            products: response.data,
            loading: false,
            error: null,
            pagination: response.pagination,
          });
        } else {
          // Fallback to local search if API fails
          console.warn('API search failed, falling back to local search');
          const localResults = searchProductsLocal(query);
          if (isMounted) {
            console.log('Local search results:', localResults.length, 'products');
            setState({
              products: localResults,
              loading: false,
              error: null,
            });
          }
        }
      } catch (error) {
        if (!isMounted) return;
        
        // Fallback to local search if API throws error
        console.warn('API search error, falling back to local search:', error);
        const localResults = searchProductsLocal(query);
        console.log('Local search results after error:', localResults.length, 'products');
        setState({
          products: localResults,
          loading: false,
          error: null,
        });
      }
    };

    // Add debounce to avoid too many API calls
    const timeoutId = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [query, memoizedFilters]);

  return state;
};

// Local search function as fallback
const searchProductsLocal = (query: string) => {
  const { searchProducts } = require('@/services/productsData');
  return searchProducts(query);
};

// Search suggestions hook for real-time suggestions
export const useSearchSuggestions = (query: string, limit: number = 5) => {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    let isMounted = true;

    const fetchSuggestions = async () => {
      if (!isMounted) return;
      
      console.log('Fetching suggestions for:', query);
      setLoading(true);
      
      try {
        const response = await apiService.searchProducts(query, { limit });
        
        if (!isMounted) return;
        
        if (response.success && response.data) {
          console.log('Suggestions from API:', response.data.length, 'products');
          setSuggestions(response.data);
        } else {
          // Fallback to local search
          const localResults = searchProductsLocal(query).slice(0, limit);
          if (isMounted) {
            console.log('Local suggestions:', localResults.length, 'products');
            setSuggestions(localResults);
          }
        }
      } catch (error) {
        if (!isMounted) return;
        
        // Fallback to local search
        const localResults = searchProductsLocal(query).slice(0, limit);
        console.log('Local suggestions after error:', localResults.length, 'products');
        setSuggestions(localResults);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Debounce suggestions to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [query, limit]);

  return { suggestions, loading };
};

// Filtered products hook for database filtering
export const useFilteredProducts = (filters: ProductFilters = {}) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
  });

  // Memoize the filters to prevent unnecessary re-renders
  const memoizedFilters = useCallback(() => filters, [JSON.stringify(filters)]);

  useEffect(() => {
    let isMounted = true;

    const fetchFilteredProducts = async () => {
      if (!isMounted) return;
      
      console.log('Fetching filtered products with filters:', filters);
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiService.getProducts(memoizedFilters());
        
        if (!isMounted) return;
        
        if (response.success && response.data) {
          console.log('Filtered products from API:', response.data.length, 'products');
          setState({
            products: response.data,
            loading: false,
            error: null,
            pagination: response.pagination,
          });
        } else {
          // Fallback to local filtering if API fails
          console.warn('API filtering failed, falling back to local filtering');
          const localResults = filterProductsLocal(filters);
          if (isMounted) {
            console.log('Local filtered results:', localResults.length, 'products');
            setState({
              products: localResults,
              loading: false,
              error: null,
            });
          }
        }
      } catch (error) {
        if (!isMounted) return;
        
        // Fallback to local filtering if API throws error
        console.warn('API filtering error, falling back to local filtering:', error);
        const localResults = filterProductsLocal(filters);
        console.log('Local filtered results after error:', localResults.length, 'products');
        setState({
          products: localResults,
          loading: false,
          error: null,
        });
      }
    };

    fetchFilteredProducts();

    return () => {
      isMounted = false;
    };
  }, [memoizedFilters]);

  return state;
};

// Local filtering function as fallback
const filterProductsLocal = (filters: ProductFilters) => {
  const { allProducts } = require('@/services/productsData');
  
  let filteredProducts = [...allProducts];

  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(product => {
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
      ].filter((field): field is string => Boolean(field)).map(field => field.toLowerCase());
      
      return searchableFields.some(field => field.includes(searchTerm));
    });
  }

  // Apply category filter
  if (filters.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category?.toLowerCase() === filters.category?.toLowerCase() ||
      product.productType?.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  // Apply brand filter
  if (filters.brand) {
    filteredProducts = filteredProducts.filter(product => 
      product.brand.toLowerCase() === filters.brand?.toLowerCase()
    );
  }

  // Apply price range filter
  if (filters.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice!);
  }

  // Apply in stock filter
  if (filters.inStock !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.inStock === filters.inStock);
  }

  // Apply skin type filter
  if (filters.skinType) {
    filteredProducts = filteredProducts.filter(product => {
      const productSkinTypes = Array.isArray(product.skinType) ? product.skinType : [product.skinType];
      return productSkinTypes.some((type: string) => type.toLowerCase() === filters.skinType?.toLowerCase());
    });
  }

  // Apply hair type filter
  if (filters.hairType) {
    filteredProducts = filteredProducts.filter(product => {
      const productHairTypes = Array.isArray(product.hairType) ? product.hairType : [product.hairType];
      return productHairTypes.some((type: string) => type.toLowerCase() === filters.hairType?.toLowerCase());
    });
  }

  // Apply boolean filters
  if (filters.crueltyFree !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.crueltyFree === filters.crueltyFree);
  }
  if (filters.vegan !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.vegan === filters.vegan);
  }
  if (filters.luxury !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.luxury === filters.luxury);
  }
  if (filters.cleanBeauty !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.cleanBeauty === filters.cleanBeauty);
  }

  return filteredProducts;
};

// New hook for fetching and organizing brands by category from database
export const useBrands = () => {
  const [state, setState] = useState<{
    brandsByCategory: Array<{
      category: string;
      brands: Array<{
        name: string;
        rating: number;
        followers: string;
        isNew?: boolean;
        isSale?: boolean;
        isTrending?: boolean;
        isPopular?: boolean;
        productCount: number;
        image?: string;
      }>;
    }>;
    loading: boolean;
    error: string | null;
  }>({
    brandsByCategory: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchBrands = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Fetch products from database using the same pattern as FeaturedProducts
        console.log('Fetching products from database to extract brand data...');
        
        // Use multiple product hooks like FeaturedProducts does
        const [featuredResponse, newArrivalsResponse, bestSellersResponse, saleResponse] = await Promise.all([
          apiService.getFeaturedProducts(100),
          apiService.getNewArrivals(100),
          apiService.getBestSellers(100),
          apiService.getSaleProducts(100)
        ]);
        
        // Log individual responses for debugging
        console.log('API Responses:', {
          featured: { success: featuredResponse.success, count: featuredResponse.data?.length || 0 },
          newArrivals: { success: newArrivalsResponse.success, count: newArrivalsResponse.data?.length || 0 },
          bestSellers: { success: bestSellersResponse.success, count: bestSellersResponse.data?.length || 0 },
          sale: { success: saleResponse.success, count: saleResponse.data?.length || 0 }
        });
        
        // Combine all products like FeaturedProducts does
        const allProducts = [
          ...(featuredResponse.success ? featuredResponse.data || [] : []),
          ...(newArrivalsResponse.success ? newArrivalsResponse.data || [] : []),
          ...(bestSellersResponse.success ? bestSellersResponse.data || [] : []),
          ...(saleResponse.success ? saleResponse.data || [] : [])
        ];
        
        // Remove duplicates based on _id (same as FeaturedProducts)
        const uniqueProducts = allProducts.filter((product, index, self) => 
          index === self.findIndex(p => p._id === product._id)
        );
        
        console.log('Combined products from database:', uniqueProducts.length);
        
        if (uniqueProducts.length > 0) {
          // Extract brands directly from products data
          console.log('Processing products data to extract brands...');
          const brandsData = organizeBrandsFromProducts(uniqueProducts);
          
          console.log('Extracted brands data:', brandsData);
          
          setState({
            brandsByCategory: brandsData,
            loading: false,
            error: null,
          });
        } else {
          // Fallback: try to get products from general endpoint
          console.warn('No products from specific endpoints, trying general products API...');
          try {
            const generalResponse = await apiService.getProducts({ limit: 200 });
            if (generalResponse.success && generalResponse.data && generalResponse.data.length > 0) {
              console.log('Fallback products found:', generalResponse.data.length);
              const brandsData = organizeBrandsFromProducts(generalResponse.data);
              setState({
                brandsByCategory: brandsData,
                loading: false,
                error: null,
              });
            } else {
              // No products available from any source
              console.warn('No products found in database from any endpoint');
              setState({
                brandsByCategory: [],
                loading: false,
                error: 'No products available in database',
              });
            }
          } catch (fallbackError) {
            console.error('Fallback API also failed:', fallbackError);
            setState({
              brandsByCategory: [],
              loading: false,
              error: 'No products available in database',
            });
          }
        }
      } catch (error) {
        // No fallback to local data - only use database
        console.error('Products API error:', error);
        setState({
          brandsByCategory: [],
          loading: false,
          error: 'Failed to connect to database',
        });
      }
    };

    fetchBrands();
  }, []);

  return state;
};






// Helper function to format follower count
const formatFollowers = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// Helper function to organize brands by category from products (exact database data)
const organizeBrandsFromProducts = (products: Product[]) => {
  const categoryMap = new Map<string, Map<string, {
    name: string;
    rating: number;
    followers: string;
    isNew: boolean;
    isSale: boolean;
    isTrending: boolean;
    isPopular: boolean;
    productCount: number;
    totalRating: number;
    totalReviews: number;
    image?: string;
    totalPrice: number;
    minPrice: number;
    maxPrice: number;
    hasDiscount: boolean;
    luxuryBrand: boolean;
    cleanBeauty: boolean;
    crueltyFree: boolean;
    vegan: boolean;
  }>>();

  // Process each product to extract exact brand information from database
  products.forEach(product => {
    // Handle database API format (_id)
    const productId = product._id;
    if (!productId) return; // Skip products without ID
    
    // Use exact category from database, fallback to productType if category is not set
    const category = product.category || product.productType || 'Other';
    const brandName = product.brand;
    
    if (!brandName) return; // Skip products without brand
    
    if (!categoryMap.has(category)) {
      categoryMap.set(category, new Map());
    }
    
    const brandMap = categoryMap.get(category)!;
    
    if (!brandMap.has(brandName)) {
      brandMap.set(brandName, {
        name: brandName,
        rating: 0,
        followers: '0',
        isNew: false,
        isSale: false,
        isTrending: false,
        isPopular: false,
        productCount: 0,
        totalRating: 0,
        totalReviews: 0,
        image: product.image,
        totalPrice: 0,
        minPrice: product.price || 0,
        maxPrice: product.price || 0,
        hasDiscount: false,
        luxuryBrand: false,
        cleanBeauty: false,
        crueltyFree: false,
        vegan: false,
      });
    }
    
    const brand = brandMap.get(brandName)!;
    brand.productCount++;
    brand.totalRating += product.rating || 0;
    brand.totalReviews += product.reviewCount || 0;
    brand.totalPrice += product.price || 0;
    
    // Update price range
    if (product.price) {
      brand.minPrice = Math.min(brand.minPrice, product.price);
      brand.maxPrice = Math.max(brand.maxPrice, product.price);
    }
    
    // Update flags based on exact product properties from database
    if (product.isNew) brand.isNew = true;
    if (product.isSale || product.discount) brand.isSale = true;
    if (product.isTrending) brand.isTrending = true;
    if (product.discount) brand.hasDiscount = true;
    if (product.luxury) brand.luxuryBrand = true;
    if (product.cleanBeauty) brand.cleanBeauty = true;
    if (product.crueltyFree) brand.crueltyFree = true;
    if (product.vegan) brand.vegan = true;
    
    // Determine if brand is popular based on exact data
    if (brand.productCount >= 3 || (product.rating && product.rating >= 4.5)) {
      brand.isPopular = true;
    }
    
    // Update image if not set (use first available product image)
    if (!brand.image && product.image) {
      brand.image = product.image;
    }
  });

  // Convert to array format and calculate average ratings
  const brandsByCategory = Array.from(categoryMap.entries()).map(([category, brandMap]) => ({
    category,
    brands: Array.from(brandMap.values()).map(brand => ({
      name: brand.name,
      rating: brand.totalReviews > 0 ? Math.round((brand.totalRating / brand.totalReviews) * 10) / 10 : 0,
      followers: formatFollowers(brand.totalReviews),
      isNew: brand.isNew,
      isSale: brand.isSale,
      isTrending: brand.isTrending,
      isPopular: brand.isPopular,
      productCount: brand.productCount,
      image: brand.image,
      // Additional brand data from database
      averagePrice: brand.productCount > 0 ? Math.round(brand.totalPrice / brand.productCount) : 0,
      priceRange: brand.minPrice !== brand.maxPrice ? `${brand.minPrice} - ${brand.maxPrice}` : brand.minPrice.toString(),
      hasDiscount: brand.hasDiscount,
      luxuryBrand: brand.luxuryBrand,
      cleanBeauty: brand.cleanBeauty,
      crueltyFree: brand.crueltyFree,
      vegan: brand.vegan,
    })).sort((a, b) => b.rating - a.rating) // Sort by rating
  }));

  return brandsByCategory;
};
