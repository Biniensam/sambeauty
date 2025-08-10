"use client"
import React, { useState, useEffect } from 'react'
import { 
  User, 
  Settings, 
  LogOut, 
  ShoppingBag, 
  CreditCard, 
  MapPin, 
  Bell, 
  Shield, 
  Heart,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { getProductImage } from '@/utils/imageUtils'
import { useUser, useClerk } from '@clerk/nextjs'
import { apiService, Customer, CustomerOrder } from '@/services/api'
import ProtectedRoute from './ProtectedRoute'

interface Order {
  id: string
  date: string
  items: number
  total: number
  status: string
  products: Array<{
    name: string
    image: string
    quantity: number
    price: number
  }>
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  addresses: Array<{
    type: string
    address: string
    city: string
    region: string
    country: string
    postalCode?: string
  }>
}

export default function Accountpage() {
  const { t } = useLanguage()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const [activeTab, setActiveTab] = useState('orderSummary')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    addresses: []
  })
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize customer data when user data is loaded
  useEffect(() => {
    const initializeCustomer = async () => {
      if (!isLoaded || !user) return
      
      setIsInitializing(true)
      setError(null)
      
      try {
        const userEmail = user.primaryEmailAddress?.emailAddress
        const userName = user.fullName || user.firstName || 'User'
        const userPhone = user.phoneNumbers?.[0]?.phoneNumber || ''
        
        // Set initial customer info from Clerk user data
        setCustomerInfo({
          name: userName,
          email: userEmail || '',
          phone: userPhone,
          addresses: []
        })

        // Try to find existing customer by email first
        if (userEmail) {
          const customerResponse = await apiService.findCustomerByContact(userEmail)
          
          if (customerResponse.success && customerResponse.data) {
            // Customer found by email
            const customer = customerResponse.data
            setCustomerId(customer._id)
            
            // Update customer info with data from database
            setCustomerInfo({
              name: customer.fullName,
              email: customer.email,
              phone: customer.phoneNumber,
              addresses: customer.addresses.map(addr => ({
                type: addr.type,
                address: addr.street,
                city: addr.city,
                region: addr.region,
                country: addr.country,
                postalCode: addr.postalCode
              }))
            })
            
            // Fetch orders for this customer
            await fetchCustomerOrders(customer._id)
          } else {
            // Customer not found by email, try to find by phone if available
            if (userPhone) {
              const phoneCustomerResponse = await apiService.findCustomerByContact(undefined, userPhone)
              
              if (phoneCustomerResponse.success && phoneCustomerResponse.data) {
                // Customer found by phone
                const customer = phoneCustomerResponse.data
                setCustomerId(customer._id)
                
                // Update customer info with data from database
                setCustomerInfo({
                  name: customer.fullName,
                  email: customer.email,
                  phone: customer.phoneNumber,
                  addresses: customer.addresses.map(addr => ({
                    type: addr.type,
                    address: addr.street,
                    city: addr.city,
                    region: addr.region,
                    country: addr.country,
                    postalCode: addr.postalCode
                  }))
                })
                
                // Fetch orders for this customer
                await fetchCustomerOrders(customer._id)
              } else {
                // No customer found, will create new one when needed
                console.log('No existing customer found, will create new one when needed')
                // Try to fetch orders using Clerk user ID as fallback
                await fetchCustomerOrders(user.id)
              }
            } else {
              // No phone number, try to fetch orders using Clerk user ID as fallback
              await fetchCustomerOrders(user.id)
            }
          }
        } else {
          // No email, try to fetch orders using Clerk user ID as fallback
          await fetchCustomerOrders(user.id)
        }
      } catch (error) {
        console.error('Error initializing customer:', error)
        setError('Failed to load customer data. Please try again.')
        
        // Fallback: try to fetch orders using Clerk user ID
        if (user) {
          await fetchCustomerOrders(user.id)
        }
      } finally {
        setIsInitializing(false)
      }
    }

    initializeCustomer()
  }, [isLoaded, user])

  // Fetch customer orders using customer ID or Clerk user ID as fallback
  const fetchCustomerOrders = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const ordersResponse = await apiService.getCustomerOrders(id)
      if (ordersResponse.success && ordersResponse.data) {
        const ordersData = ordersResponse.data.map(order => ({
          id: order.orderNumber,
          date: new Date(order.date).toLocaleDateString(),
          items: order.items,
          total: order.total,
          status: order.status,
          products: order.products
        }))
        setOrders(ordersData)
      } else {
        setError(ordersResponse.message || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Refresh orders - uses current customer ID or falls back to Clerk user ID
  const refreshOrders = async () => {
    if (customerId) {
      await fetchCustomerOrders(customerId)
    } else if (user) {
      await fetchCustomerOrders(user.id)
    }
  }

  // Load customer orders on component mount (now handled in initializeCustomer)
  // useEffect(() => {
  //   if (user) {
  //     fetchCustomerOrders(user.id)
  //   }
  // }, [user])

  const navItems = [
    { id: 'orderSummary', label: t('orderSummary'), icon: ShoppingBag },
    { id: 'addresses', label: t('addresses'), icon: MapPin },
    { id: 'accountSettings', label: t('accountSettings'), icon: Settings },
    { id: 'signOut', label: t('signOut'), icon: LogOut }
  ]

  const renderOrderSummary = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-pink-700 dark:text-pink-400 text-xl tracking-wide">
          {t('recentOrders')}
        </h3>
        <button
          onClick={refreshOrders}
          disabled={loading}
          className="px-3 py-2 text-sm bg-pink-100 hover:bg-pink-200 dark:bg-pink-900 dark:hover:bg-pink-800 text-pink-700 dark:text-pink-300 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No orders yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-pink-100 dark:border-pink-800 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-pink-700 dark:text-pink-400">Order #{order.id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{order.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={getProductImage(order.products[0].image)}
                    alt={order.products[0].name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{order.products[0].name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.items} items</p>
                  </div>
                </div>
                <p className="font-semibold text-pink-600 dark:text-pink-400">Birr {order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
        {t('viewAllOrders')}
        <ChevronRight size={16} />
      </button>
    </div>
  )

  const renderAddresses = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-pink-700 dark:text-pink-400 text-xl tracking-wide">
        {t('savedAddresses')}
      </h3>
      <div className="space-y-4">
        {customerInfo.addresses.length > 0 ? (
          customerInfo.addresses.map((address, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-pink-100 dark:border-pink-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{address.type}</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {address.address}<br />
                    {address.city}, {address.region}<br />
                    {address.country}{address.postalCode && `, ${address.postalCode}`}
                  </p>
                </div>
                <button className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300">
                  {t('edit')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MapPin size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">No addresses saved</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Add your first address to get started</p>
          </div>
        )}
        <button className="w-full py-3 px-4 border-2 border-dashed border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400 font-medium rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors">
          {t('addNewAddress')}
        </button>
      </div>
    </div>
  )

  const renderAccountSettings = () => {
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSave = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!user) return
      
      setIsUpdating(true)
      setUpdateMessage(null)
      
      try {
        // Update user profile using Clerk
        await user.update({
          firstName: customerInfo.name.split(' ')[0] || customerInfo.name,
          lastName: customerInfo.name.split(' ').slice(1).join(' ') || '',
        })
        
        // If we have a customer ID, also update the customer record in our database
        if (customerId) {
          const updateResponse = await apiService.updateCustomer(customerId, {
            fullName: customerInfo.name,
            phoneNumber: customerInfo.phone,
            addresses: customerInfo.addresses.map(addr => ({
              type: addr.type,
              street: addr.address,
              city: addr.city,
              region: addr.region,
              country: addr.country,
              postalCode: addr.postalCode
            }))
          })
          
          if (updateResponse.success) {
            setUpdateMessage({ type: 'success', text: 'Profile updated successfully in both systems!' })
          } else {
            setUpdateMessage({ type: 'success', text: 'Profile updated in Clerk, but failed to update in our system.' })
          }
        } else {
          setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' })
        }
        
        // Clear message after 3 seconds
        setTimeout(() => setUpdateMessage(null), 3000)
      } catch (error) {
        console.error('Error updating profile:', error)
        setUpdateMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
      } finally {
        setIsUpdating(false)
      }
    }

    return (
      <div className="space-y-6">
        <h3 className="font-semibold text-pink-700 dark:text-pink-400 text-xl tracking-wide">
          {t('accountSettings')}
        </h3>
        
        {/* Update Message */}
        {updateMessage && (
          <div className={`p-4 rounded-lg ${
            updateMessage.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {updateMessage.text}
          </div>
        )}
        
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-pink-700 dark:text-pink-400 font-semibold mb-2">
              {t('name')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border border-pink-300 dark:border-pink-600 bg-white dark:bg-gray-900 px-4 py-3 text-pink-700 dark:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-describedby="name-help"
              required
            />
            <p id="name-help" className="sr-only">{t('enterYourFullName')}</p>
          </div>
          <div>
            <label htmlFor="email" className="block text-pink-700 dark:text-pink-400 font-semibold mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={customerInfo.email}
              disabled
              className="w-full rounded-lg border border-pink-300 dark:border-pink-600 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              aria-describedby="email-help"
            />
            <p id="email-help" className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
          <div>
            <label htmlFor="phone" className="block text-pink-700 dark:text-pink-400 font-semibold mb-2">
              {t('phoneNumber')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-lg border border-pink-300 dark:border-pink-600 bg-white dark:bg-gray-900 px-4 py-3 text-pink-700 dark:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-describedby="phone-help"
            />
            <p id="phone-help" className="sr-only">{t('enterYourPhoneNumber')}</p>
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : t('saveChanges')}
          </button>
        </form>
      </div>
    )
  }

  const renderSignOut = () => {
    const handleSignOut = async () => {
      try {
        await signOut()
        // Clerk will handle the redirect
      } catch (error) {
        console.error('Error signing out:', error)
      }
    }

    return (
      <div className="space-y-6">
        <h3 className="font-semibold text-pink-700 dark:text-pink-400 text-xl tracking-wide">
          {t('signOut')}
        </h3>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-pink-100 dark:border-pink-800">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t('confirmSignOut')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleSignOut}
              className="flex-1 py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
            >
              {t('signOut')}
            </button>
            <button 
              onClick={() => setActiveTab('accountSettings')}
              className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-medium rounded-lg transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'orderSummary': return renderOrderSummary()
      case 'addresses': return renderAddresses()
      case 'accountSettings': return renderAccountSettings()
      case 'signOut': return renderSignOut()
      default: return renderOrderSummary()
    }
  }

  // Show loading state while Clerk is loading or initializing customer data
  if (!isLoaded || isInitializing) {
    return (
      <div className="container-responsive py-6 sm:py-12 bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-pink-300 dark:border-pink-700">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show error if no user
  if (!user) {
    return (
      <div className="container-responsive py-6 sm:py-12 bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-pink-300 dark:border-pink-700">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Please sign in to access your account.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container-responsive py-6 sm:py-12 bg-white dark:bg-gray-900 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-pink-300 dark:border-pink-700">
        <div className="flex flex-col items-center gap-4 mb-6 sm:mb-8 md:mb-10">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-pink-500 via-pink-600 to-pink-700 flex items-center justify-center text-3xl sm:text-5xl font-extrabold text-white select-none shadow-xl">
            {customerInfo.name ? customerInfo.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-700 dark:text-pink-400 tracking-wide">
              {customerInfo.name || 'Welcome!'}
            </h2>
            <p className="text-pink-600 dark:text-pink-300 text-base sm:text-lg font-light tracking-wide mt-1">
              {customerInfo.email ? customerInfo.email : 'Sign in to manage your account'}
            </p>
            {!customerInfo.name && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Complete your profile to get started
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
              {navItems.find(item => item.id === activeTab)?.label || t('menu')}
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
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield size={20} />
                  <span className="font-medium">Error:</span>
                  <span>{error}</span>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}
            
            {renderContent()}
          </section>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
