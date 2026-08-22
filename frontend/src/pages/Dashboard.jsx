import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, IndianRupee, ReceiptText, ArrowRight, PieChart as PieIcon, Wallet } from 'lucide-react';
import {
  Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale,
  Tooltip, Legend
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';
import ErrorMessage from '../components/common/ErrorMessage';
import Modal from '../components/common/Modal';
import ExpenseForm from '../components/features/ExpenseForm';
import { analyticsService } from '../services/analyticsService';
import { expenseService } from '../services/expenseService';
import { budgetService } from '../services/budgetService';
import { useAppContext } from '../context/AppContext';
import { toast } from 'sonner';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CATEGORY_COLORS = [
  '#3B82F6', '#22C55E', '#0EA5E9', '#F59E0B',
  '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'
];

const Dashboard = () => {
  const { theme } = useAppContext();
  const [summary, setSummary] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [summaryData, recentData, budgetData] = await Promise.all([
        analyticsService.getSummary(),
        expenseService.getAll({ page: 0, size: 5, sortBy: 'expenseDate', direction: 'desc' }),
        budgetService.getAll()
      ]);

      setSummary(summaryData);
      setRecentExpenses(recentData.content || []);
      setBudgets(budgetData || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateExpense = async (data) => {
    try {
      await expenseService.create(data);
      toast.success('Expense recorded successfully');
      setIsExpenseModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to create expense');
    }
  };

  if (isLoading) return <LoadingState text="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount || 0);
  };

  return (
    <div className="space-y-6 animate-rise">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="display-lg">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Here is a complete overview of your personal finances.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/budgets">
            <Button variant="secondary">
              <Wallet size={18} />
              Budgets
            </Button>
          </Link>
          <Button onClick={() => setIsExpenseModalOpen(true)}>
            <Plus size={18} />
            Record Expense
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spending</CardTitle>
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold numeric">{formatCurrency(summary?.totalSpending)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold numeric">{formatCurrency(summary?.monthlySpending)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold numeric">{formatCurrency(summary?.weeklySpending)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
            <ReceiptText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold numeric">{formatCurrency(summary?.dailySpending)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Recent Expenses + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Expenses List (2 Cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Link to="/expenses" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">No expenses recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-muted/40 rounded-lg hover:bg-muted/80 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.category} • {item.expenseDate ? new Date(item.expenseDate).toLocaleDateString() : ''}</p>
                    </div>
                    <span className="font-semibold text-sm numeric text-destructive">
                      -{formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Categories — Pie Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Categories</CardTitle>
            <Link to="/analytics" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              Full Analytics <PieIcon size={14} />
            </Link>
          </CardHeader>
          <CardContent>
            {!summary?.categoryBreakdown || summary.categoryBreakdown.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">No category data available.</p>
            ) : (
              <div>
                <div className="h-[200px] mb-4">
                  <Pie
                    data={{
                      labels: summary.categoryBreakdown.slice(0, 6).map(c => (c.category || '').replace('_', ' ')),
                      datasets: [{
                        data: summary.categoryBreakdown.slice(0, 6).map(c => c.amount || 0),
                        backgroundColor: CATEGORY_COLORS,
                        borderWidth: 0,
                        hoverOffset: 6
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: theme === 'dark' ? '#F9FAFB' : '#111827',
                            font: { size: 11, family: 'Inter' },
                            boxWidth: 10,
                            padding: 8
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: (ctx) => {
                              const item = summary?.categoryBreakdown?.[ctx.dataIndex];
                              const pct = item?.percentage != null ? item.percentage.toFixed(1) : '0.0';
                              return ` ${formatCurrency(ctx.raw)} (${pct}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
                <div className="space-y-2 mt-2">
                  {summary.categoryBreakdown.slice(0, 4).map((cat, i) => (
                    <div key={cat.category || i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="font-medium truncate">{(cat.category || '').replace('_', ' ')}</span>
                          <span className="text-muted-foreground numeric ml-2">{cat.percentage?.toFixed(1) || 0}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(cat.percentage || 0, 100)}%`, backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Purchases Bar Chart + Active Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Horizontal Bar Chart — Top 5 Purchases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top 5 Purchases</CardTitle>
            {summary?.highestExpense && (
              <span className="text-xs text-muted-foreground font-medium">
                Highest: <span className="numeric text-danger font-semibold">{formatCurrency(summary.highestExpense.amount)}</span>
              </span>
            )}
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">No expenses recorded yet.</p>
            ) : (
              <div className="h-[220px]">
                <Bar
                  data={{
                    labels: [...recentExpenses]
                      .sort((a, b) => b.amount - a.amount)
                      .slice(0, 5)
                      .map(e => e.title.length > 14 ? e.title.slice(0, 14) + '…' : e.title),
                    datasets: [{
                      label: 'Amount (₹)',
                      data: [...recentExpenses]
                        .sort((a, b) => b.amount - a.amount)
                        .slice(0, 5)
                        .map(e => e.amount),
                      backgroundColor: CATEGORY_COLORS,
                      borderRadius: 6,
                      borderWidth: 0,
                    }]
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => ` ₹${Number(ctx.raw).toLocaleString('en-IN')}`
                        }
                      }
                    },
                    scales: {
                      x: {
                        ticks: {
                          color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                          font: { size: 11, family: 'Roboto Mono' },
                          callback: (v) => `₹${Number(v).toLocaleString('en-IN')}`
                        },
                        grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }
                      },
                      y: {
                        ticks: {
                          color: theme === 'dark' ? '#F9FAFB' : '#111827',
                          font: { size: 12, family: 'Inter' }
                        },
                        grid: { display: false }
                      }
                    }
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Budgets</CardTitle>
            <Link to="/budgets" className="text-sm font-medium text-primary hover:underline">
              Manage Budgets
            </Link>
          </CardHeader>
          <CardContent>
            {budgets.length === 0 ? (
              <p className="text-muted-foreground text-sm">No active budgets created.</p>
            ) : (
              <div className="space-y-3">
                {budgets.slice(0, 3).map(b => (
                  <div key={b.id} className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.period} limit</p>
                    </div>
                    <span className="font-semibold text-sm numeric">
                      {formatCurrency(b.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Expense Modal */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Record Expense">
        <ExpenseForm onSubmit={handleCreateExpense} onCancel={() => setIsExpenseModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;
