'use client';

import Notification from './Notification';
import type { NotificationData } from '../hooks/useNotifications';

interface NotificationContainerProps {
    notifications: NotificationData[];
    onRemove: (id: string) => void;
}

export default function NotificationContainer({
    notifications,
    onRemove
}: NotificationContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    duration={notification.duration}
                    onClose={() => onRemove(notification.id)}
                />
            ))}
        </div>
    );
}
