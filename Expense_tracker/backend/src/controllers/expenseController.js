const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');

/**
 * @desc    Create a new expense for the authenticated user
 * @route   POST /api/expenses
 * @access  Private
 */
const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, note, date } = req.body;

  if (!title || amount === undefined || amount === null || !category) {
    res.status(400);
    throw new Error('Title, amount and category are required');
  }

  if (Number(amount) <= 0) {
    res.status(400);
    throw new Error('Amount must be greater than zero');
  }

  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount: Number(amount),
    category,
    note: note || '',
    date: date ? new Date(date) : new Date(),
  });

  res.status(201).json(expense);
});

/**
 * @desc    List expenses with optional search & category filters
 * @route   GET /api/expenses
 * @access  Private
 *
 * Query parameters:
 *   q        — search across title and note (case-insensitive)
 *   category — exact category match (or 'All')
 *   from/to  — ISO date bounds
 */
const getExpenses = asyncHandler(async (req, res) => {
  const { q, category, from, to } = req.query;
  const filter = { user: req.user._id };

  if (category && category !== 'All') {
    filter.category = category;
  }

  if (q) {
    const regex = new RegExp(q.trim(), 'i');
    filter.$or = [{ title: regex }, { note: regex }];
  }

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
  res.json(expenses);
});

/**
 * @desc    Retrieve a single expense
 * @route   GET /api/expenses/:id
 * @access  Private
 */
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  res.json(expense);
});

/**
 * @desc    Update an expense
 * @route   PUT /api/expenses/:id
 * @access  Private
 */
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  const { title, amount, category, note, date } = req.body;
  if (title !== undefined) expense.title = title;
  if (amount !== undefined) {
    if (Number(amount) <= 0) {
      res.status(400);
      throw new Error('Amount must be greater than zero');
    }
    expense.amount = Number(amount);
  }
  if (category !== undefined) expense.category = category;
  if (note !== undefined) expense.note = note;
  if (date !== undefined) expense.date = new Date(date);

  const updated = await expense.save();
  res.json(updated);
});

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  res.json({ id: req.params.id, message: 'Expense deleted' });
});

/**
 * @desc    Aggregate statistics for the dashboard
 * @route   GET /api/expenses/stats
 * @access  Private
 *
 * Returns:
 *   total          — total amount spent (all time)
 *   monthly        — total amount spent in current calendar month
 *   count          — number of expenses
 *   recent         — 5 most recent expenses
 *   byCategory     — [{ category, total }] grouped sums
 *   monthlySeries  — last 6 months of totals (oldest → newest)
 */
const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [aggAll, aggMonth, recent, byCategoryAgg] = await Promise.all([
    Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Expense.aggregate([
      { $match: { user: userId, date: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.find({ user: userId }).sort({ date: -1, createdAt: -1 }).limit(5),
    Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { _id: 0, category: '$_id', total: 1 } },
      { $sort: { total: -1 } },
    ]),
  ]);

  // Build last 6 months series including months with zero spend.
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyAgg = await Expense.aggregate([
    { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { y: { $year: '$date' }, m: { $month: '$date' } },
        total: { $sum: '$amount' },
      },
    },
  ]);

  const monthlySeries = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const found = monthlyAgg.find(
      (x) => x._id.y === d.getFullYear() && x._id.m === d.getMonth() + 1
    );
    monthlySeries.push({
      label: d.toLocaleString('default', { month: 'short' }) + ' ' + String(d.getFullYear()).slice(-2),
      total: found ? Number(found.total.toFixed(2)) : 0,
    });
  }

  res.json({
    total: aggAll[0]?.total || 0,
    count: aggAll[0]?.count || 0,
    monthly: aggMonth[0]?.total || 0,
    recent,
    byCategory: byCategoryAgg,
    monthlySeries,
  });
});

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getStats,
};
