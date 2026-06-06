import styles from './ErrorMessage.module.css';

/**
 * Standard inline error banner. Optional `onDismiss` shows a close button.
 */
export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className={styles.error} role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>{message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className={styles.close} aria-label="Dismiss error">
          &times;
        </button>
      )}
    </div>
  );
}
