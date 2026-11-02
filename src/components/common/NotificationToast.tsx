import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearNotification } from '../../features/books/booksSlice';
import { NotificationType } from '../../types/book';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.books.notification);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      dispatch(clearNotification());
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification, dispatch]);

  if (!notification) return null;

  const icons: Record<NotificationType, React.ReactNode> = {
    warning: <AlertTriangle className="toast-icon toast-warning-icon" size={20} />,
    success: <CheckCircle className="toast-icon toast-success-icon" size={20} />,
    info: <Info className="toast-icon toast-info-icon" size={20} />,
    error: <XCircle className="toast-icon toast-error-icon" size={20} />,
  };

  return (
    <div
      className={`notification-toast toast-${notification.type}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="toast-content">
        {icons[notification.type]}
        <span className="toast-message">{notification.message}</span>
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={() => dispatch(clearNotification())}
        aria-label="Đóng thông báo"
      >
        <X size={16} />
      </button>
    </div>
  );
};
