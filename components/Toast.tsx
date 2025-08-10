'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  type?: 'success' | 'error' | 'info'
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, type = 'success' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
  const iconColor = type === 'success' ? 'text-green-100' : type === 'error' ? 'text-red-100' : 'text-blue-100'

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[70] lg:hidden">
      <div className={`${bgColor} text-white p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300`}>
        <CheckCircle size={20} className={iconColor} />
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Toast 