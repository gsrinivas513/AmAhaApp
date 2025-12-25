import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

/**
 * Custom hook to use notifications throughout the app
 * @returns {Object} Notification methods and state
 * 
 * Usage:
 * const { notify } = useNotification();
 * notify.success('Operation completed!');
 * notify.error('Something went wrong');
 * notify.warning('Are you sure?');
 * notify.info('Just letting you know');
 * notify.loading('Processing...');
 */
export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotification must be used within NotificationProvider'
    );
  }

  return context;
}
