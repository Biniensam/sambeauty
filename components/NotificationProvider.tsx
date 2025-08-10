'use client';

import React from 'react';
import { useNotification } from './NotificationContext';
import NotificationPopup from './NotificationPopup';

const NotificationProvider: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {notifications.map((notification, index) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationPopup
            notification={notification}
            onClose={() => removeNotification(notification.id)}
            index={index}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationProvider;
