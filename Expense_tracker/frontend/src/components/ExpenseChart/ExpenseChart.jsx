import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import styles from './ExpenseChart.module.css';

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b',
  '#3b82f6', '#ef4444', '#14b8a6', '#06b6d4', '#64748b',
];

const fmtCurrency = (n) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n || 0);

/**
 * Side-by-side donut (category split) + bar (last 6 months) chart panel.
 * Handles empty data gracefully so the dashboard never shows a broken chart.
 */
export default function ExpenseChart({ byCategory = [], monthlySeries = [] }) {
  const hasCategory = byCategory.some((c) => c.total > 0);
  const hasMonthly = monthlySeries.some((m) => m.total > 0);

  return (
    <div className={styles.grid}>
      <section className={styles.card}>
        <header className={styles.head}>
          <h3>Spending by category</h3>
          <span className={styles.sub}>All-time breakdown</span>
        </header>

        {hasCategory ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="total"
                nameKey="category"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                stroke="none"
                isAnimationActive
                animationDuration={800}
              >
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => fmtCurrency(v)}
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  color: 'var(--text-primary)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className={styles.empty}>No category data yet.</p>
        )}
      </section>

      <section className={styles.card}>
        <header className={styles.head}>
          <h3>Last 6 months</h3>
          <span className={styles.sub}>Monthly totals</span>
        </header>

        {hasMonthly ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlySeries} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#8b5cf6" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'var(--accent-soft)' }}
                formatter={(v) => fmtCurrency(v)}
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  color: 'var(--text-primary)',
                }}
              />
              <Bar
                dataKey="total"
                fill="url(#barGrad)"
                radius={[10, 10, 0, 0]}
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className={styles.empty}>No monthly data yet.</p>
        )}
      </section>
    </div>
  );
}
