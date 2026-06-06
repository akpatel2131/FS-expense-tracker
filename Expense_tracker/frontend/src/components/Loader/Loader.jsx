import styles from './Loader.module.css';

/**
 * Animated dual-ring spinner. Use `fullscreen` for page-level loading and
 * leave it off for inline cases.
 */
export default function Loader({ fullscreen = false, label = 'Loading…' }) {
  return (
    <div className={fullscreen ? styles.fullscreen : styles.inline}>
      <div className={styles.spinner} aria-hidden="true">
        <span></span><span></span>
      </div>
      {label && <p className={styles.label}>{label}</p>}
    </div>
  );
}
