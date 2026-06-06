import styles from './DashboardCard.module.css';

/**
 * Reusable summary card for the dashboard. Accepts a slot for an icon, a
 * label, the main value, an optional accent colour (gradient class) and an
 * optional caption (e.g. "this month").
 */
export default function DashboardCard({
  icon, label, value, caption, variant = 'primary',
}) {
  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.iconWrap}>{icon}</div>
      <div className={styles.body}>
        <p className={styles.label}>{label}</p>
        <h3 className={styles.value}>{value}</h3>
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
      <div className={styles.glow} aria-hidden="true" />
    </article>
  );
}
