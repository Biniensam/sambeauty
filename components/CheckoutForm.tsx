'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCart } from './CartContext'
import { useLanguage } from './LanguageProvider'
import { getProductImage } from '@/utils/imageUtils'
import { apiService, CheckoutData } from '@/services/api'
import { useNotification } from './NotificationContext'
import { useUser } from '@clerk/nextjs'


interface CheckoutFormProps {
  onBack?: () => void
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onBack }) => {
  const { state: cartState, clearCart } = useCart()
  const { t } = useLanguage()
  const router = useRouter()
  const { showSuccess, showError } = useNotification()
  const { user, isSignedIn } = useUser()

  // Helper function to get order ID from URL if editing
  const getOrderIdFromUrl = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get('edit')
    }
    return null
  }

  const orderId = getOrderIdFromUrl()
  const isEditing = !!orderId

  
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    street: '',
    city: '',
    region: '',
    postalCode: '',
    paymentMethod: 'cash_on_delivery' as 'cash_on_delivery' | 'bank_transfer' | 'mobile_money' | 'card',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-fill form data when user is signed in or editing an order
  useEffect(() => {
    if (isSignedIn && user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.fullName || user.firstName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        // You can also auto-fill other fields if available in user metadata
        // phoneNumber: user.publicMetadata?.phoneNumber || '',
        // street: user.publicMetadata?.street || '',
        // city: user.publicMetadata?.city || '',
        // region: user.publicMetadata?.region || '',
        // postalCode: user.publicMetadata?.postalCode || '',
      }))
    }

    // If editing an order, fetch and pre-fill order data
    if (isEditing && orderId) {
      // You can implement API call to fetch order details here
      // For now, we'll show a message that this is an edit
      console.log('Editing order:', orderId)
    }

    // If user is signed in, try to fetch their previous order data to pre-fill address fields
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      const fetchPreviousOrderData = async () => {
        try {
          const response = await apiService.getCustomerOrdersByContact(user.primaryEmailAddress?.emailAddress)
          if (response.success && response.data && response.data.length > 0) {
            // Get the most recent order
            const latestOrder = response.data[0]
            if (latestOrder.shippingAddress) {
              setFormData(prev => ({
                ...prev,
                street: latestOrder.shippingAddress.street || '',
                city: latestOrder.shippingAddress.city || '',
                region: latestOrder.shippingAddress.region || '',
              }))
            }
          }
        } catch (error) {
          console.log('Could not fetch previous order data:', error)
        }
      }
      
      fetchPreviousOrderData()
    }
  }, [isSignedIn, user, isEditing, orderId])

  const shippingCost = cartState.total < 2000 ? 500 : 0
  const grandTotal = cartState.total + shippingCost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerName.trim() || !formData.phoneNumber.trim() || 
        !formData.street.trim() || !formData.city.trim() || !formData.region.trim()) {
      showError('Please fill in all required fields')
      return
    }





    setIsSubmitting(true)

    try {
      const checkoutData: CheckoutData = {
        customerInfo: {
          fullName: formData.customerName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          email: formData.email.trim(),
        },
        items: cartState.items.map(item => ({
          product: item.id,
          productName: item.name,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          fullName: formData.customerName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          street: formData.street.trim(),
          city: formData.city.trim(),
          region: formData.region.trim(),
          country: 'Ethiopia',
          postalCode: formData.postalCode.trim(),
        },
        shippingCost,
        notes: 'Order placed from website',
        paymentMethod: formData.paymentMethod,
        customerId: isSignedIn ? user?.id || 'guest' : 'guest', // Use actual user ID if signed in
      }

      const response = await apiService.submitCheckout(checkoutData)
      
      if (response.success) {
        const message = isEditing 
          ? `Order updated successfully! Order #${response.data?.orderNumber || 'N/A'}`
          : `Order placed successfully! Order #${response.data?.orderNumber || 'N/A'}`
        
        showSuccess(message)
        
        // Clear cart after successful order (only for new orders)
        if (!isEditing) {
          setTimeout(() => {
            clearCart()
          }, 3000)
        }
        
        // Redirect to account page to view the order
        setTimeout(() => {
          router.push('/account')
        }, 3000)
      } else {
        showError(response.message || 'An error occurred during checkout. Please try again.')
      }
    } catch (error) {
      showError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push('/cart')
    }
  }

  if (cartState.items.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag size={64} className="text-gray-300 dark:text-gray-700 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your cart is empty</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Add items to your cart to proceed with checkout</p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              {t('continueShopping')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-6 sm:py-12">
      <div className="container-responsive">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isEditing ? 'Edit Order' : t('checkout')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isEditing 
              ? 'Update your order information' 
              : 'Complete your order'
            }
          </p>
          {isEditing && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📝 You are editing order #{orderId}. Your customer information has been pre-filled.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer Information</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                      {isSignedIn && user?.fullName && (
                        <span className="ml-2 text-xs text-green-600 dark:text-green-400">(Auto-filled from your account)</span>
                      )}
                    </label>
                                         <input
                       type="text"
                       id="customerName"
                       name="customerName"
                       value={formData.customerName}
                       onChange={handleInputChange}
                       placeholder={t('enterYourFullName')}
                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-beauty-pink focus:border-transparent dark:bg-gray-800 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                       required
                       disabled={isSignedIn && !!user?.fullName}
                       title={isSignedIn && !!user?.fullName ? "This field is auto-filled from your account and cannot be edited" : ""}
                     />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('phoneNumber')} *
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder={t('enterYourPhoneNumber')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-beauty-pink focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Email
                      {isSignedIn && user?.primaryEmailAddress?.emailAddress && (
                        <span className="ml-2 text-xs text-green-600 dark:text-green-400">(Auto-filled from your account)</span>
                      )}
                    </label>
                                         <input
                       type="email"
                       id="email"
                       name="email"
                       value={formData.email}
                       onChange={handleInputChange}
                       placeholder="Enter your email address"
                       className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-beauty-pink focus:border-transparent dark:bg-gray-800 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                       disabled={isSignedIn && !!user?.primaryEmailAddress?.emailAddress}
                       title={isSignedIn && !!user?.primaryEmailAddress?.emailAddress ? "This field is auto-filled from your account and cannot be edited" : ""}
                     />
                  </div>

                  {/* Shipping Information Section */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">Shipping Information</h3>
                  </div>

                  {/* Street Address Field */}
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address *
                      {isSignedIn && formData.street && (
                        <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(Pre-filled from previous order)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="Enter your street address"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-beauty-pink focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                      required
                    />
                  </div>

                  {/* City Field */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                      {isSignedIn && formData.city && (
                        <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(Pre-filled from previous order)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-beauty-pink focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                      required
                    />
                  </div>

                  {/* Region Field */}
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Region *
                      {isSignedIn && formData.region && (
                        <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(Pre-filled from previous order)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      placeholder="Enter your region"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-beauty-pink focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                      required
                    />
                  </div>

                  {/* Postal Code Field */}
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Enter your postal code"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-beauty-pink focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  {/* Payment Information Section */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Information</h3>
                  </div>

                  {/* Payment Method Field */}
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Method *
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-beauty-pink focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
                      required
                    >
                      <option value="cash_on_delivery">Cash on Delivery</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="card">Credit/Debit Card</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                                     <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isSubmitting ? 'Processing...' : (isEditing ? 'Update Order' : 'Place Order')}
                   </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('orderSummary')}</h2>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={getProductImage(item.image)}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.brand}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t('quantity')}: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {t('birr', { price: (item.price * item.quantity).toFixed(2) })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('subtotal')} ({cartState.itemCount} {t('items')})</span>
                    <span className="font-medium">{t('birr', { price: cartState.total.toFixed(2) })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('shipping')}</span>
                    <span className={`font-medium ${shippingCost > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {shippingCost > 0 ? t('birr', { price: shippingCost.toFixed(2) }) : 'Free'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>{t('total')}</span>
                      <span>{t('birr', { price: grandTotal.toFixed(2) })}</span>
                    </div>
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{t('authenticProducts')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{t('returnPolicy')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default CheckoutForm
