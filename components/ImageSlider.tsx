'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Slide {
  id: number
  image: string
  title: string
  subtitle?: string
  ctaText: string
  ctaLink: string
  backgroundColor?: string
}

const slides: Slide[] = [
    {
        id: 1,
        image: "https://i.postimg.cc/269zX5ZS/Screenshot-2025-08-09-141453.png",
        title: "NEW ARRIVALS",
        subtitle: "Discover the latest beauty innovations",
        ctaText: "SHOP NOW",
        ctaLink: "/new-trending",
        backgroundColor: "bg-gradient-to-r from-pink-50 to-purple-50"
      },
  {
    id: 2,
    image: 'https://i.postimg.cc/htT00zdc/Screenshot-2025-08-09-135454.png',
    title: 'LUXURY BEAUTY',
    subtitle: 'Premium skincare & makeup essentials',
    ctaText: 'EXPLORE',
    ctaLink: '/products',
    backgroundColor: 'bg-gradient-to-r from-amber-50 to-orange-50'
  },
  {
    id: 3,
    image: 'https://media.ulta.com/i/ulta/PCP_WK2725_Hero_KBeauty_XL?w=2000&$background-defaultLight$&fmt=auto',
    title: 'SKIN CARE HEROES',
    subtitle: 'Transform your skin with expert formulas',
    ctaText: 'SHOP SKIN CARE',
    ctaLink: '/skin-care',
    backgroundColor: 'bg-gradient-to-r from-blue-50 to-indigo-50'
  }
]

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative h-[200px] md:h-[350px] lg:h-[300px]">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            <div className={`relative h-full w-full ${slide.backgroundColor}`}>
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-fit"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 transition-all duration-300 hover:bg-white hover:shadow-lg md:h-12 md:w-12"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 transition-all duration-300 hover:bg-white hover:shadow-lg md:h-12 md:w-12"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ImageSlider
