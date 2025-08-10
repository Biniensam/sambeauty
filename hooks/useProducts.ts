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
      } catch (error) {
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
