"use client"
import React, { useState } from 'react'
import { useFavorites } from '@/components/FavoritesContext'
import { useLanguage } from '@/components/LanguageProvider'
import { useCart } from '@/components/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNavigation from '@/components/BottomNavigation'
import Toast from '@/components/Toast'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getProductImage } from '@/utils/imageUtils'

export default function WishlistPage() {
  const { state: favoritesState, removeFavorite } = useFavorites()
  const { t } = useLanguage()
  const { addItem } = useCart()
  const router = useRouter()
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const handleBuyNow = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      image: getProductImage(item.image),
    })
    setToastMessage(t('itemAdded'))
    setShowToast(true)
    router.push('/cart')
  }

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      image: getProductImage(item.image),
    })
    setToastMessage(t('itemAdded'))
    setShowToast(true)
  }

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto py-10 px-4 min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-6">{t('wishlistTitle')}</h1>
        {favoritesState.items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-2">{t('wishlistEmpty')}</p>
            <Link href="/products" className="btn-primary mt-4 inline-block">{t('browseProducts')}</Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {favoritesState.items.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white dark:bg-gray-900 rounded-lg shadow p-4">
                <img src={getProductImage(item.image)} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md" />
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.brand}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('birr', { price: item.price.toFixed(2) })}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex flex-row gap-2">
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition-colors"
                      aria-label={t('removeFromFavorites')}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="btn-secondary text-sm px-3 py-2"
                    >
                      {t('addToCart')}
                    </button>
                    <button
                      onClick={() => handleBuyNow(item)}
                      className="btn-primary text-sm px-3 py-2"
                    >
                      {t('buyNow')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <BottomNavigation />
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
    </>
  )
}
