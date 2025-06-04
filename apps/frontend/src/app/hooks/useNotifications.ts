'use client';

import { useState, useCallback } from 'react';

export interface NotificationData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback(
    (
      message: string,
      type: NotificationData['type'] = 'info',
      duration?: number
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification: NotificationData = {
        id,
        message,
        type,
        duration,
      };

      setNotifications(prev => [...prev, notification]);
      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper functions
  const success = useCallback(
    (message: string, duration?: number) => {
      return addNotification(message, 'success', duration);
    },
    [addNotification]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      return addNotification(message, 'error', duration);
    },
    [addNotification]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      return addNotification(message, 'warning', duration);
    },
    [addNotification]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      return addNotification(message, 'info', duration);
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  };
}
