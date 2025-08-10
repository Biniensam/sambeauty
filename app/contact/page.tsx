'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Clock, TrendingUp, Gift, Star, ChevronRight, Send, Percent, Zap } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 })
  const { t } = useLanguage()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          return { hours: 23, minutes: 59, seconds: 59 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Skincare Set",
      price: 129.99,
      originalPrice: 199.99,
      discount: 35,
      image: "/api/placeholder/300/300",
      rating: 4.8,
      reviews: 234
    },
    {
      id: 2,
      name: "Luxury Perfume Collection",
      price: 89.99,
      originalPrice: 149.99,
      discount: 40,
      image: "/api/placeholder/300/300",
      rating: 4.9,
      reviews: 189
    },
    {
      id: 3,
      name: "Professional Makeup Kit",
      price: 79.99,
      originalPrice: 119.99,
      discount: 33,
      image: "/api/placeholder/300/300",
      rating: 4.7,
      reviews: 312
    }
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setEmail('')
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Promotional Banner */}
        <section className="mb-12 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  <Zap className="w-8 h-8" />
                  FLASH SALE ALERT!
                </h1>
                <p className="text-xl mb-4">Up to 50% OFF on Premium Beauty Products</p>
                <div className="flex items-center gap-4 mb-6">
                  <Clock className="w-6 h-6" />
                  <div className="flex gap-2">
                    <div className="bg-white/20 px-3 py-1 rounded">
                      <span className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-sm">H</span>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded">
                      <span className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="text-sm">M</span>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded">
                      <span className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="text-sm">S</span>
                    </div>
                  </div>
                </div>
                <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                  Shop Flash Sale
                </button>
              </div>
              <div className="hidden md:block mt-4 md:mt-0">
                <Gift className="w-24 h-24 opacity-80" />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-serif font-bold mb-8 text-center">{t('footerContactUs')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6">{t('footerContactUs')}</h2>
                <div className="flex flex-col gap-4 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-3">
                    <Mail className="text-pink-500" />
                    <a href="mailto:support@sambeauty.com" className="hover:underline">support@sambeauty.com</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-pink-500" />
                    <a href="tel:+1234567890" className="hover:underline">+251970057408</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-pink-500" />
                    Office Number 402, Soliana Commercial Center, Lideta, Addis Ababa Ethiopia
                  </div>
                </div>
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">{t('footerStayConnectedTitle')}</h2>
                  <div className="flex gap-4 text-pink-500">
                    <a href="#" aria-label="Facebook" className="hover:text-primary-800"><Facebook /></a>
                    <a href="#" aria-label="Twitter" className="hover:text-primary-800"><Twitter /></a>
                    <a href="#" aria-label="Instagram" className="hover:text-primary-800"><Instagram /></a>
                    <a href="#" aria-label="YouTube" className="hover:text-primary-800"><Youtube /></a>
                  </div>
                </div>
              </section>

              <section className="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-400 rounded-lg p-8 shadow-lg flex flex-col justify-center items-center text-white">
                <h2 className="text-3xl font-bold mb-4">{t('discoverOurCuratedCollection')}</h2>
                <p className="mb-6 max-w-md text-center">
                  {t('dontMissOutOnExclusiveDeals')}
                </p>
                <button className="btn-primary bg-white text-pink-600 hover:bg-pink-600 hover:text-white transition-colors px-6 py-3 rounded-full font-semibold">
                  {t('shopNow')}
                </button>
              </section>
            </div>

            
          </div>

          {/* Sidebar Promotional Content */}
          <div className="space-y-8">
            {/* Trust Badges */}
            <section className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Why Shop With Us</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Percent className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Best Prices Guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Fast & Free Shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">4.8/5 Customer Rating</span>
                </div>
              </div>
            </section>

            {/* Quick Links */}
            <section className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/products" className="flex items-center justify-between text-sm hover:text-pink-500 transition-colors">
                  <span>All Products</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="/new-trending" className="flex items-center justify-between text-sm hover:text-pink-500 transition-colors">
                  <span>New Arrivals</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="/brands" className="flex items-center justify-between text-sm hover:text-pink-500 transition-colors">
                  <span>Top Brands</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ContactPage
