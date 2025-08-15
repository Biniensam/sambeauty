'use client'

import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'

const Footer = () => {
  const { t } = useLanguage()
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-8 sm:mt-12">
      <div className="container-responsive py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Column 1: Logo & Social */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <Link href="/" className="flex items-center space-x-2 min-w-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-pink-500 transition-transform duration-300 hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2C10.343 2 9 3.343 9 5c0 1.657 3 7 3 7s3-5.343 3-7c0-1.657-1.343-3-3-3zM7 21h10a2 2 0 002-2v-1a2 2 0 00-2-2H7a2 2 0 00-2 2v1a2 2 0 002 2z"
                />
              </svg>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-extrabold text-pink-600 truncate select-none bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 bg-clip-text text-transparent">
                SamBeauty
              </h1>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm max-w-xs">{t('footerDescription')}</p>
            <div className="flex gap-2 sm:gap-3 mt-2">
              <a href="#" aria-label="Facebook" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Facebook size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Twitter size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Youtube size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">{t('footerShopTitle')}</h4>
            <Link href="/skin-care" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-xs sm:text-sm transition-colors">{t('footerSkinCare')}</Link>
            <Link href="/makeup" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-xs sm:text-sm transition-colors">{t('footerMakeUp')}</Link>
            <Link href="/hair" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-xs sm:text-sm transition-colors">{t('footerHair')}</Link>
            <Link href="/perfume" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-xs sm:text-sm transition-colors">{t('footerFragrance')}</Link>
          </div>

          {/* Column 3: Customer Service */}
          <div className="flex flex-col gap-1 sm:gap-2">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">{t('footerCustomerServiceTitle')}</h4>
            <Link href="/account" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-xs sm:text-sm transition-colors">{t('footerMyAccount')}</Link>
            <Link href="/account" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-xs sm:text-sm transition-colors">{t('footerOrderTracking')}</Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-xs sm:text-sm transition-colors">{t('footerContactUs')}</Link>
          </div>

          {/* Column 4: Contact & Telegram */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">{t('footerStayConnectedTitle')}</h4>
            <form className="flex flex-col gap-2" onSubmit={(e) => {
              e.preventDefault();
              const message = e.currentTarget.message.value;
              if (message.trim()) {
                window.open(`https://t.me/sambeauty_support?text=${encodeURIComponent(message)}`, '_blank');
              }
            }}>
              <textarea
                name="message"
                placeholder="Send us a message on Telegram..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
              />
              <button type="submit" className="btn-primary px-3 py-2 text-xs sm:text-sm w-full sm:w-auto">
                Send on Telegram
              </button>
            </form>
            <div className="flex flex-col gap-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">Office Number 402, Soliana Commercial Center, Lideta, Addis Ababa Ethiopia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="flex-shrink-0" />
                <span>+251970057408</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="flex-shrink-0" />
                <span>support@sambeauty.com</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <a href="https://t.me/sambeauty_support" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                  @sambeauty_support
                </a>
              </div>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <div className="flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/fr/6/6e/CBESA.png" 
                  alt="CBE" 
                  className="h-8 sm:h-9 lg:h-10 object-contain"
                />
              </div>
              <div className="flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/a/a4/Telebirr.png" 
                  alt="Telebirr" 
                  className="h-8 sm:h-9 lg:h-10 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} {t('footerCopyright')}. {t('footerAllRightsReserved')}
        </div>
      </div>
    </footer>
  )
}

export default Footer 