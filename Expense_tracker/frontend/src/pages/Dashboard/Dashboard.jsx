import { useExpenses } from '../../context/ExpenseContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import DashboardCard from '../../components/DashboardCard/DashboardCard.jsx';
import ExpenseChart from '../../components/ExpenseChart/ExpenseChart.jsx';
import ExpenseTable from '../../components/ExpenseTable/ExpenseTable.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage.jsx';
import styles from './Dashboard.module.css';

const fmtCurrency = (n) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n || 0);

/* SVG icons live close to where they're used to keep the file self-contained */
const IconWallet = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" />
    <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
    <circle cx="16" cy="14" r="1.5" />
  </svg>
);
const IconCalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconList = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const IconTrend = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, statsLoading, error, clearError } = useExpenses();

  // Average per recorded expense — a small but useful insight.
  const avg = stats && stats.count > 0 ? stats.total / stats.count : 0;

  return (
    <main className={`${styles.page} page-enter`}>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Welcome back,</p>
          <h2 className={styles.name}>{user?.name?.split(' ')[0] || 'there'} 👋</h2>
        </div>
        <p className={styles.tagline}>Here's a quick look at your spending.</p>
      </header>

      <ErrorMessage message={error} onDismiss={clearError} />

      {statsLoading && !stats ? (
        <Loader label="Crunching the numbers…" />
      ) : (
        <>
          <section className={styles.cards}>
            <DashboardCard
              variant="primary"
              icon={<IconWallet />}
              label="Total spent"
              value={fmtCurrency(stats?.total)}
              caption="All time"
            />
            <DashboardCard
              variant="success"
              icon={<IconCalendar />}
              label="This month"
              value={fmtCurrency(stats?.monthly)}
              caption={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            />
            <DashboardCard
              variant="warning"
              icon={<IconList />}
              label="Transactions"
              value={stats?.count ?? 0}
              caption="Logged entries"
            />
            <DashboardCard
              variant="danger"
              icon={<IconTrend />}
              label="Average per expense"
              value={fmtCurrency(avg)}
              caption="Mean transaction"
            />
          </section>

          <section className={styles.section}>
            <ExpenseChart
              byCategory={stats?.byCategory || []}
              monthlySeries={stats?.monthlySeries || []}
            />
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h3>Recent transactions</h3>
              <span className={styles.sub}>Your last 5 entries</span>
            </div>
            <ExpenseTable expenses={stats?.recent || []} />
          </section>
        </>
      )}
    </main>
  );
}
