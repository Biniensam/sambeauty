'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from './NotificationContext';

interface NotificationPopupProps {
  notification: Notification;
  onClose: () => void;
  index: number;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-gray-800 dark:text-gray-200';
    }
  };

  const getProgressBarColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-600 dark:bg-green-400';
      case 'error':
        return 'bg-red-600 dark:bg-red-400';
      case 'warning':
        return 'bg-yellow-600 dark:bg-yellow-400';
      case 'info':
        return 'bg-blue-600 dark:bg-blue-400';
      default:
        return 'bg-gray-600 dark:bg-gray-400';
    }
  };

  return (
    <div
      className={`fixed right-4 z-50 w-80 max-w-sm transition-all duration-300 ease-out ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
      style={{
        top: `${80 + index * 90}px`,
      }}
    >
      <div
        className={`rounded-lg border shadow-lg ${getBackgroundColor()} ${getTextColor()} overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-5">
                {notification.message}
              </p>
              {notification.action && (
                <div className="mt-3">
                  <button
                    onClick={notification.action.onClick}
                    className={`text-xs font-medium underline hover:no-underline focus:outline-none ${
                      notification.type === 'success'
                        ? 'text-green-700 dark:text-green-300'
                        : notification.type === 'error'
                        ? 'text-red-700 dark:text-red-300'
                        : notification.type === 'warning'
                        ? 'text-yellow-700 dark:text-yellow-300'
                        : 'text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {notification.action.label}
                  </button>
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={handleClose}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  notification.type === 'success'
                    ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-800 focus:ring-green-600'
                    : notification.type === 'error'
                    ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-800 focus:ring-red-600'
                    : notification.type === 'warning'
                    ? 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-800 focus:ring-yellow-600'
                    : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800 focus:ring-blue-600'
                }`}
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        {notification.duration && notification.duration > 0 && (
          <div className="h-1 bg-black/10 dark:bg-white/10">
            <div
              className={`h-full transition-all ease-linear ${getProgressBarColor()}`}
              style={{
                width: '100%',
                animation: `shrink ${notification.duration}ms linear`,
              }}
            />
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationPopup;
