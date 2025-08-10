'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import { ChevronLeft, ChevronRight, Star, Sparkles, Heart, ShoppingBag, ArrowRight, Pause } from 'lucide-react'

const HeroSection = () => {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Dynamic slides based on language
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop',
      alt: t('luxuryBeautyCollection'),
      title: t('discoverYourPerfectLook'),
      subtitle: t('premiumCosmeticsForEveryOccasion'),
      category: t('makeUp'),
      gradient: 'from-pink-400 via-purple-500 to-indigo-600',
      accent: 'pink',
      features: [t('longLasting'), t('crueltyFree'), t('vegan')]
    },
    {
      id: 2,
      image: 'https://media.ulta.com/i/ulta/HP_WK2225_Article_AllThingsUlta_Replenish?w=600&fmt=auto',
      alt: t('skincareEssentials'),
      title: t('glowFromWithin'),
      subtitle: t('advancedSkincareForRadiantBeauty'),
      category: t('skinCare'),
      gradient: 'from-blue-400 via-cyan-500 to-teal-600',
      accent: 'blue',
      features: ['antiAging', 'hydrating', 'natural']
    },
    {
      id: 3,
      image: 'https://media.ulta.com/i/ulta/HP_WK2625_Promo_BOGOLip?w=600&$background-xsubtleLight$&h=600&fmt=auto',
      alt: t('fragranceCollection'),
      title: t('captivateYourSenses'),
      subtitle: t('exclusiveFragrancesThatTellYourStory'),
      category: t('Perfume'),
      gradient: 'from-amber-400 via-orange-500 to-red-600',
      accent: 'amber',
      features: [t('longLasting'), 'unique', 'luxurious']
    },
    {
      id: 4,
      image: 'https://media.ulta.com/i/ulta/HP_WK2525_Article_BTS_Rush?w=600&$background-defaultLight$&fmt=auto',
      alt: t('hairCareProducts'),
      title: t('transformYourHair'),
      subtitle: t('professionalHairCareForEveryTexture'),
      category: t('hair'),
      gradient: 'from-emerald-400 via-green-500 to-teal-600',
      accent: 'emerald',
      features: ['nourishing', 'repairing', 'styling']
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 6000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, slides.length])

  // Mouse movement tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Gradient orbs */}
        <div 
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left content */}
          <div className="space-y-6 text-white">
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Sparkles size={16} className="text-yellow-400" />
              <span className="text-sm font-medium">{currentSlideData.category}</span>
            </div>

            {/* Main title */}
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {currentSlideData.title}
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 max-w-lg">
                {currentSlideData.subtitle}
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-3">
              {currentSlideData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2"
                >
                  <Star size={14} className="text-yellow-400" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>{t('exploreCollection')}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

           
          </div>

          {/* Right content - Image slider */}
          <div className="relative">
            {/* Main image */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.alt}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{
                    transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
                  }}
                />
                
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent`} />
                
                {/* Floating elements */}
                <div className="absolute top-6 right-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                    <Heart size={20} className="text-white" />
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                    <ShoppingBag size={20} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label={t('previousImage')}
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label={t('nextImage')}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center gap-3 mt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`${t('goToSlide')} ${index + 1}`}
                />
              ))}
            </div>

            {/* Play/Pause button */}
            <button
              onClick={togglePlayPause}
              className="absolute top-6 left-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300"
              aria-label={isPlaying ? t('pauseSlideshow') : t('playSlideshow')}
            >
              {isPlaying ? <Pause size={20} /> : <Pause size={20} />}
            </button>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-sm">{t('scrollToExplore')}</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border border-white/10 rounded-3xl m-4" />
        <div className="absolute inset-0 border border-white/5 rounded-3xl m-8" />
      </div>
    </section>
  )
}

export default HeroSection
