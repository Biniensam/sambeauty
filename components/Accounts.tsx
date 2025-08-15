"use client"
import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  ShoppingBag, 
  MapPin, 
  Menu,
  X
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { useUser } from '@clerk/nextjs'
import { apiService, CustomerOrder } from '../services/api'

export default function Accountpage() {
  const { t } = useLanguage()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('orderSummary')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) {
        setOrdersLoading(false)
        return
      }

      try {
        setOrdersLoading(true)
        setOrdersError(null)
        
        const email = user.emailAddresses[0].emailAddress
        const fullName = user.fullName || 'Unknown'
        const phoneNumber = user.primaryPhoneNumber?.phoneNumber || ''
        
        const response = await apiService.getOrdersByContactInfo(fullName, phoneNumber, email)
        
        if (response.success && response.data) {
          setOrders(response.data)
        } else {
          setOrders([])
        }
      } catch (error) {
        setOrdersError('Failed to fetch orders. Please try again later.')
        setOrders([])
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  const navItems = [
    { id: 'orderSummary', label: 'Order Summary', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'accountSettings', label: 'Account Settings', icon: Settings },
  ]

  const renderOrderSummary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-pink-700 dark:text-pink-400 text-xl tracking-wide">
          Recent Orders
        </h3>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              setOrdersLoading(true)
              try {
                const email = user?.emailAddresses?.[0]?.emailAddress
                const fullName = user?.fullName || 'Unknown'
                const phoneNumber = user?.primaryPhoneNumber?.phoneNumber || ''
                
                const response = await apiService.getOrdersByContactInfo(fullName, phoneNumber, email)
                
                if (response.success && response.data) {
                  setOrders(response.data)
                } else {
                  setOrders([])
                }
              } catch (error) {
                setOrdersError('Failed to refresh orders. Please try again later.')
                setOrders([])
              } finally {
                setOrdersLoading(false)
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Orders
          </button>
        </div>
      </div>
      
      
     
      
      {ordersLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
        </div>
      ) : ordersError ? (
        <div className="text-center py-8">
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 mb-2">Error loading orders</p>
            <p className="text-sm text-red-600 dark:text-red-400">{ordersError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Order #{order.orderNumber}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">
Birr {order.total.toFixed(2)}
                  </p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                {order.products.map((product, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Qty: {product.quantity} × Birr {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Payment:</strong> {order.paymentMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Shipping:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.region}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ShoppingBag size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No orders found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Start shopping to see your orders here</p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Orders are fetched using your account information. 
              If you&apos;ve placed orders but don&apos;t see them here, please contact support.
            </p>
          </div>
        </div>
      )}
    </div>
  )

  const renderAddresses = () => {
    // Extract and compare addresses from orders - consolidate similar ones
    const addressMap = new Map<string, any>()
    
    // Helper function to normalize and compare addresses
    const normalizeAddress = (address: any) => {
      if (!address || !address.street || !address.city) return null
      
      // Normalize street address - remove common variations and extra spaces
      let street = address.street.toLowerCase().trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\./g, '') // Remove periods
        .replace(/,/g, '') // Remove commas
        .replace(/street|st\.?/gi, 'st') // Normalize street abbreviations
        .replace(/avenue|ave\.?/gi, 'ave')
        .replace(/road|rd\.?/gi, 'rd')
        .replace(/boulevard|blvd\.?/gi, 'blvd')
        .replace(/drive|dr\.?/gi, 'dr')
        .replace(/lane|ln\.?/gi, 'ln')
        .replace(/place|pl\.?/gi, 'pl')
        .replace(/court|ct\.?/gi, 'ct')
        .replace(/circle|cir\.?/gi, 'cir')
        .replace(/way/gi, 'way')
        .replace(/terrace|ter/gi, 'ter')
      
      // Normalize city and region
      const city = address.city.toLowerCase().trim()
        .replace(/\s+/g, ' ')
        .replace(/\./g, '')
        .replace(/,/g, '')
      
      const region = (address.region || '').toLowerCase().trim()
        .replace(/\s+/g, ' ')
        .replace(/\./g, '')
        .replace(/,/g, '')
      
      return { street, city, region }
    }
    
    // Helper function to check if two addresses are similar
    const areAddressesSimilar = (addr1: any, addr2: any) => {
      if (!addr1 || !addr2) return false
      
      const norm1 = normalizeAddress(addr1)
      const norm2 = normalizeAddress(addr2)
      
      if (!norm1 || !norm2) return false
      
      // Check if street names are very similar (allowing for minor variations)
      const streetSimilarity = calculateSimilarity(norm1.street, norm2.street)
      const cityMatch = norm1.city === norm2.city
      const regionMatch = norm1.region === norm2.region
      
      // Addresses are similar if:
      // 1. Street names are very similar (90%+ similarity) AND cities match
      // 2. OR if street, city, and region all match exactly
      return (streetSimilarity >= 0.9 && cityMatch) || 
             (norm1.street === norm2.street && cityMatch && regionMatch)
    }
    
    // Helper function to calculate string similarity (simple implementation)
    const calculateSimilarity = (str1: string, str2: string) => {
      if (str1 === str2) return 1.0
      if (str1.length === 0 || str2.length === 0) return 0.0
      
      const longer = str1.length > str2.length ? str1 : str2
      const shorter = str1.length > str2.length ? str2 : str1
      
      if (longer.length === 0) return 1.0
      
      // Calculate Levenshtein distance and convert to similarity
      const distance = levenshteinDistance(longer, shorter)
      return (longer.length - distance) / longer.length
    }
    
    // Helper function to calculate Levenshtein distance
    const levenshteinDistance = (str1: string, str2: string) => {
      const matrix = []
      
      for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i]
      }
      
      for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j
      }
      
      for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1]
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            )
          }
        }
      }
      
      return matrix[str2.length][str1.length]
    }
    
    // First pass: group addresses by exact matches
    orders.forEach(order => {
      if (order.shippingAddress && order.shippingAddress.street && order.shippingAddress.city) {
        const normalized = normalizeAddress(order.shippingAddress)
        if (!normalized) return
        
        // Create a key for exact matching
        const exactKey = `${normalized.street}|${normalized.city}|${normalized.region}`
        
        if (!addressMap.has(exactKey)) {
          addressMap.set(exactKey, {
            id: order._id,
            type: 'Shipping Address',
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            region: order.shippingAddress.region || '',
            country: order.shippingAddress.country || 'Ethiopia',
            postalCode: order.shippingAddress.postalCode || '',
            fullName: order.shippingAddress.fullName || '',
            phoneNumber: order.shippingAddress.phoneNumber || '',
            isDefault: false,
            orderCount: 1,
            orderIds: [order._id], // Track all order IDs that use this address
            originalAddresses: [order.shippingAddress] // Keep original addresses for reference
          })
        } else {
          // If exact match exists, increment the order count
          const existingAddress = addressMap.get(exactKey)
          existingAddress.orderCount += 1
          existingAddress.orderIds.push(order._id)
          existingAddress.originalAddresses.push(order.shippingAddress)
          
          // Update with the most complete information available
          if (!existingAddress.fullName && order.shippingAddress.fullName) {
            existingAddress.fullName = order.shippingAddress.fullName
          }
          if (!existingAddress.phoneNumber && order.shippingAddress.phoneNumber) {
            existingAddress.phoneNumber = order.shippingAddress.phoneNumber
          }
          if (!existingAddress.postalCode && order.shippingAddress.postalCode) {
            existingAddress.postalCode = order.shippingAddress.postalCode
          }
        }
      }
    })
    
    // Second pass: check for similar addresses and merge them
    const addressesToMerge: Array<{key: string, similarKey: string, similarity: number}> = []
    const addressKeys = Array.from(addressMap.keys())
    
    for (let i = 0; i < addressKeys.length; i++) {
      for (let j = i + 1; j < addressKeys.length; j++) {
        const key1 = addressKeys[i]
        const key2 = addressKeys[j]
        const addr1 = addressMap.get(key1)
        const addr2 = addressMap.get(key2)
        
        if (areAddressesSimilar(addr1, addr2)) {
          const similarity = calculateSimilarity(
            normalizeAddress(addr1)?.street || '',
            normalizeAddress(addr2)?.street || ''
          )
          addressesToMerge.push({ key: key1, similarKey: key2, similarity })
        }
      }
    }
    
    // Sort by similarity (highest first) and merge similar addresses
    addressesToMerge
      .sort((a, b) => b.similarity - a.similarity)
      .forEach(({ key, similarKey }) => {
        if (addressMap.has(key) && addressMap.has(similarKey)) {
          const primaryAddr = addressMap.get(key)
          const secondaryAddr = addressMap.get(similarKey)
          
          // Merge the addresses
          primaryAddr.orderCount += secondaryAddr.orderCount
          primaryAddr.orderIds.push(...secondaryAddr.orderIds)
          primaryAddr.originalAddresses.push(...secondaryAddr.originalAddresses)
          
          // Use the most complete information
          if (!primaryAddr.fullName && secondaryAddr.fullName) {
            primaryAddr.fullName = secondaryAddr.fullName
          }
          if (!primaryAddr.phoneNumber && secondaryAddr.phoneNumber) {
            primaryAddr.phoneNumber = secondaryAddr.phoneNumber
          }
          if (!primaryAddr.postalCode && secondaryAddr.postalCode) {
            primaryAddr.postalCode = secondaryAddr.postalCode
          }
          
          // Remove the secondary address
          addressMap.delete(similarKey)
        }
      })
    
    // Convert Map values to array
    const orderAddresses = Array.from(addressMap.values())
    


    return (
      <div className="space-y-6">
        <h3 className="font-semibold text-pink-700 dark:text-pink-400 text-xl tracking-wide">
          Saved Addresses
        </h3>
        

        
        {orderAddresses.length > 0 ? (
          <div className="space-y-4">
            {orderAddresses.map((address, index) => (
              <div key={address.id || index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full">
                        {address.type}
                      </span>
                      {address.orderCount > 1 && (
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                          Used in {address.orderCount} order{address.orderCount !== 1 ? 's' : ''}
                        </span>
                      )}
                      {address.originalAddresses && address.originalAddresses.length > 1 && (
                        <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                          Merged {address.originalAddresses.length} similar address{address.originalAddresses.length !== 1 ? 'es' : ''}
                        </span>
                      )}
                      {address.isDefault && (
                        <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    
                    {address.fullName && (
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {address.fullName}
                      </p>
                    )}
                    
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>{address.street}</p>
                      <p>{address.city}, {address.region}</p>
                      {address.postalCode && <p>{address.postalCode}</p>}
                      <p>{address.country}</p>
                      {address.phoneNumber && (
                        <p className="mt-2 text-pink-600 dark:text-pink-400">
                          📞 {address.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button className="px-3 py-1 text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded hover:bg-pink-200 dark:hover:bg-pink-800/30 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      Set Default
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-3 px-4 border-2 border-dashed border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400 font-medium rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors">
              Add New Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-8">
              <MapPin size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">No addresses found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {orders.length > 0 
                  ? "Your order addresses will appear here once you place orders"
                  : "Start shopping to see your order addresses here"
                }
              </p>
            </div>
            <button className="w-full py-3 px-4 border-2 border-dashed border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400 font-medium rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors">
              Add New Address
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-pink-700 dark:text-pink-400 text-xl tracking-wide">
        Account Settings
      </h3>
      
      <div className="text-center py-8">
        <Settings size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 mb-2">Account settings coming soon</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">We&apos;re working on bringing you more features</p>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'orderSummary': return renderOrderSummary()
      case 'addresses': return renderAddresses()
      case 'accountSettings': return renderAccountSettings()
      default: return renderOrderSummary()
    }
  }

  return (
    <div className="container-responsive py-6 sm:py-12 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-pink-300 dark:border-pink-700">
        <div className="flex flex-col items-center gap-4 mb-6 sm:mb-8 md:mb-10">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-pink-500 via-pink-600 to-pink-700 flex items-center justify-center text-3xl sm:text-5xl font-extrabold text-white select-none shadow-xl">
            {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
          </div>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-700 dark:text-pink-400 tracking-wide">
              Welcome, {user?.firstName || 'User'}!
            </h2>
            <p className="text-pink-600 dark:text-pink-300 text-base sm:text-lg font-light tracking-wide mt-1">
              Manage your account and orders
            </p>
            {user?.emailAddresses[0]?.emailAddress && (
              <p className="text-pink-500 dark:text-pink-400 text-sm mt-1">
                {user.emailAddresses[0].emailAddress}
              </p>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-between w-full py-3 px-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-pink-200 dark:border-pink-700"
          >
            <span className="font-medium text-pink-700 dark:text-pink-400">
              {navItems.find(item => item.id === activeTab)?.label || 'Menu'}
            </span>
            {mobileMenuOpen ? <X size={20} className="text-pink-600 dark:text-pink-400" /> : <Menu size={20} className="text-pink-600 dark:text-pink-400" />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex flex-col gap-2 w-full sm:w-64 flex-shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-pink-600 text-white shadow-lg'
                      : 'text-pink-700 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-700'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="sm:hidden flex flex-col gap-2 w-full mb-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'text-pink-700 dark:text-pink-400 bg-white dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-pink-700'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          )}

          {/* Content Section */}
          <section className="flex-1 bg-pink-50 dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-200 dark:border-pink-600">
            {renderContent()}
          </section>
        </div>
      </div>
    </div>
  )
}
