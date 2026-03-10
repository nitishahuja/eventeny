import { useEffect } from 'react';
import './Toast.css';

function Toast({ message, variant = 'error', onDismiss, autoHideMs = 5000 }) {
  useEffect(() => {
    if (!autoHideMs) return;
    const id = setTimeout(() => {
      onDismiss?.();
    }, autoHideMs);
    return () => clearTimeout(id);
  }, [autoHideMs, onDismiss]);

  if (!message) return null;

  return (
    <div className='toast-root' role='status' aria-live='polite'>
      <div className={`toast toast--${variant}`}>
        <span className='toast-message'>{message}</span>
        <button
          type='button'
          className='toast-close'
          onClick={onDismiss}
          aria-label='Dismiss notification'
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;

