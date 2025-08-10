'use client'

import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'

const Footer = () => {
  const { t } = useLanguage()
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-12">
      <div className="container-responsive py-8 sm:py-12">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-4 md:gap-8 lg:gap-12">
          {/* Column 1: Logo & Social */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 min-w-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 transition-transform duration-300 hover:scale-110"
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
              <h1 className="text-lg sm:text-3xl font-serif font-extrabold text-pink-600 truncate select-none bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 bg-clip-text text-transparent">
                SamBeauty
              </h1>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs">{t('footerDescription')}</p>
            <div className="flex gap-3 mt-2">
              <a href="#" aria-label="Facebook" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"><Twitter size={20} /></a>
              <a href="#" aria-label="Instagram" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"><Instagram size={20} /></a>
              <a href="#" aria-label="YouTube" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div className="flex flex-col gap-2 md:col-span-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('footerShopTitle')}</h4>
            <Link href="/skin-care" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">{t('footerSkinCare')}</Link>
            <Link href="/makeup" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">{t('footerMakeUp')}</Link>
            <Link href="/hair" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">{t('footerHair')}</Link>
            <Link href="/perfume" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">{t('footerFragrance')}</Link>
          </div>

          {/* Column 3: Customer Service */}
          <div className="flex flex-col gap-2 md:col-span-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('footerCustomerServiceTitle')}</h4>
            <Link href="/account" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">{t('footerMyAccount')}</Link>
            <Link href="/orders" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">{t('footerOrderTracking')}</Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm">{t('footerContactUs')}</Link>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('footerStayConnectedTitle')}</h4>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder={t('footerEmailPlaceholder')}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <button type="submit" className="btn-primary px-4 py-2 text-sm">{t('footerSubscribeButton')}</button>
            </form>
            <div className="flex flex-col gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <div className="flex items-center gap-2"><MapPin size={35} /> Office Number 402, Soliana Commercial Center, Lideta, Addis Ababa Ethiopia</div>
              <div className="flex items-center gap-2"><Phone size={16} /> +251970057408</div>
              <div className="flex items-center gap-2"><Mail size={16} /> support@sambeauty.com</div>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap text-sm font-semibold text-gray-700 dark:text-gray-300">
              {/* Payment method images with names - slightly larger */}
              <div className="flex items-center gap-1">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/fr/6/6e/CBESA.png" 
                  alt="CBE" 
                  className="h-10 object-contain"
                />
               
              </div>
              <div className="flex items-center gap-1">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/a/a4/Telebirr.png" 
                  alt="Telebirr" 
                  className="h-10 object-contain"
                />
              
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} {t('footerCopyright')}. {t('footerAllRightsReserved')}
        </div>
      </div>
    </footer>
  )
}

export default Footer 