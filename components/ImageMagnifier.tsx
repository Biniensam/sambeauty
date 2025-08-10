'use client'

import React, { useState, useRef, useEffect } from 'react'

interface ImageMagnifierProps {
  src: string
  alt: string
  className?: string
  zoomType?: 'hover' | 'click'
  zoomScale?: number
  width?: number
  height?: number
  lensSize?: number
  lensShape?: 'circular' | 'rectangular'
  showIndicator?: boolean
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({ 
  src, 
  alt, 
  className = '', 
  zoomType = 'hover',
  zoomScale = 2.5,
  width,
  height,
  lensSize = 150,
  lensShape = 'circular',
  showIndicator = true
}) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)

  // Responsive lens size
  const getResponsiveLensSize = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 480) return Math.min(lensSize * 0.9, 140)
      if (window.innerWidth <= 768) return Math.min(lensSize * 0.95, 150)
      return lensSize
    }
    return lensSize
  }

  const responsiveLensSize = getResponsiveLensSize()

  // Handle window resize for responsive lens sizing
  useEffect(() => {
    const handleResize = () => {
      // Force re-render when window resizes
      setMousePosition(prev => ({ ...prev }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate percentage position for the lens
    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100

    // Constrain lens position within container bounds
    const maxX = rect.width - responsiveLensSize
    const maxY = rect.height - responsiveLensSize
    const constrainedX = Math.max(0, Math.min(maxX, x - responsiveLensSize / 2))
    const constrainedY = Math.max(0, Math.min(maxY, y - responsiveLensSize / 2))

    setMousePosition({ x: percentX, y: percentY })
    setLensPosition({ x: constrainedX, y: constrainedY })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    // Calculate percentage position for the lens
    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100

    // Constrain lens position within container bounds
    const maxX = rect.width - responsiveLensSize
    const maxY = rect.height - responsiveLensSize
    const constrainedX = Math.max(0, Math.min(maxX, x - responsiveLensSize / 2))
    const constrainedY = Math.max(0, Math.min(maxY, y - responsiveLensSize / 2))

    setMousePosition({ x: percentX, y: percentY })
    setLensPosition({ x: constrainedX, y: constrainedY })
  }

  const handleMouseEnter = () => {
    if (zoomType === 'hover') {
      setIsZoomed(true)
    }
  }

  const handleMouseLeave = () => {
    if (zoomType === 'hover') {
      setIsZoomed(false)
    }
  }

  const handleClick = () => {
    if (zoomType === 'click') {
      setIsZoomed(!isZoomed)
    }
  }

  // Calculate background position for the magnified image
  const getLensBackgroundStyle = () => {
    if (!isZoomed) return {}
    
    const bgX = (mousePosition.x / 100) * (zoomScale * 100 - 100)
    const bgY = (mousePosition.y / 100) * (zoomScale * 100 - 100)
    
    return {
      backgroundImage: `url(${src})`,
      backgroundSize: `${zoomScale * 100}%`,
      backgroundPosition: `${bgX}% ${bgY}%`,
      backgroundRepeat: 'no-repeat'
    }
  }

  const getLensStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${lensPosition.x}px`,
      top: `${lensPosition.y}px`,
      width: `${responsiveLensSize}px`,
      height: `${responsiveLensSize}px`,
      pointerEvents: 'none' as const,
      zIndex: 10,
      ...getLensBackgroundStyle()
    }

    if (lensShape === 'circular') {
      return {
        ...baseStyle,
        borderRadius: '50%',
        border: '3px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
      }
    } else {
      return {
        ...baseStyle,
        borderRadius: '8px',
        border: '2px solid rgba(255, 255, 255, 0.9)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
      }
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`magnifier-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchMove={handleTouchMove}
      style={{ 
        cursor: isZoomed ? 'zoom-out' : 'zoom-in',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Main image */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="magnifier-image"
        draggable={false}
      />
      
      {/* Magnifying lens */}
      {isZoomed && (
        <div 
          ref={lensRef}
          className="magnifier-lens"
          style={getLensStyle()}
        >
          {/* Lens inner effects */}
          <div 
            className="absolute inset-0"
            style={{
              borderRadius: lensShape === 'circular' ? '50%' : '6px',
              background: lensShape === 'circular' 
                ? 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
              pointerEvents: 'none'
            }}
          />
          
          {/* Lens border highlight */}
          <div 
            className="absolute inset-0"
            style={{
              borderRadius: lensShape === 'circular' ? '50%' : '6px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {/* Zoom overlay indicator */}
      {isZoomed && showIndicator && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute w-3 h-3 bg-white rounded-full opacity-90 shadow-lg"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 5,
              animation: 'pulse 2s infinite'
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ImageMagnifier
