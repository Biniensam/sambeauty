"use client"
import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  ShoppingBag, 
  MapPin, 
  ChevronRight,
  Menu,
  X,
  Eye,
  Calendar,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { useLanguage } from './LanguageProvider'
import { useUser } from '@clerk/nextjs'
import { apiService, CustomerOrder } from '@/services/api'
import { getProductImage } from '@/utils/imageUtils'

export default function Accountpage() {
  const { t } = useLanguage()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('orderSummary')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch customer orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      
      setLoading(true)
      setError(null)
      
      try {
        const email = user.primaryEmailAddress?.emailAddress
        const response = await apiService.getCustomerOrdersByContact(email)
        
        if (response.success && response.data) {
          setOrders(response.data)
        } else {
          setError(response.message || 'Failed to fetch orders')
        }
      } catch (err) {
        setError('Network error. Please try again.')
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  // Helper function to get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' }
      case 'processing':
        return { icon: Package, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' }
      case 'shipped':
        return { icon: Truck, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' }
      case 'delivered':
        return { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' }
      case 'cancelled':
        return { icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' }
      default:
        return { icon: Clock, color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900/30' }
    }
  }

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
        {orders.length > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <AlertCircle size={48} className="text-red-300 dark:text-red-600 mx-auto mb-4" />
          <p className="text-red-500 dark:text-red-400 mb-2">Error loading orders</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No orders yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => {
            const statusInfo = getStatusInfo(order.status)
            const StatusIcon = statusInfo.icon
            
            return (
              <div key={order._id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Order #{order.orderNumber}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                    <div className="flex items-center gap-1">
                      <StatusIcon size={12} />
                      {order.status}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  {order.products.slice(0, 2).map((product, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <img
                        src={getProductImage(product.image)}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Qty: {product.quantity} • {product.price.toFixed(2)} ETB
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.products.length > 2 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{order.products.length - 2} more items
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{order.items}</span> items
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {order.total.toFixed(2)} ETB
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin size={12} />
                    <span className="truncate">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.region}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
          
          {orders.length > 5 && (
            <button className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
              View All {orders.length} Orders
              <ChevronRight size={16} />
            </button>
            )}
        </div>
      )}
    </div>
  )

  const renderAddresses = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-pink-700 dark:text-pink-400 text-xl tracking-wide">
        Saved Addresses
      </h3>
      <div className="space-y-4">
        <div className="text-center py-8">
          <MapPin size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No addresses saved</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Add your first address to get started</p>
        </div>
        <button className="w-full py-3 px-4 border-2 border-dashed border-pink-300 dark:border-pink-700 text-pink-600 dark:text-pink-400 font-medium rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors">
          Add New Address
        </button>
      </div>
    </div>
  )

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
