import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import LoadingState from '../components/common/LoadingState';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { analyticsService } from '../services/analyticsService';
import { useAppContext } from '../context/AppContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement
);

const Analytics = () => {
  const { theme } = useAppContext();
  const [data, setData] = useState(null);
  const [chartType, setChartType] = useState('line'); // 'line' or 'bar'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const summary = await analyticsService.getSummary();
        setData(summary);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) return <LoadingState text="Generating visual analytics..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!data || data.totalSpending === 0) return (
    <EmptyState 
      title="No analytics data available" 
      description="Record some expenses first to unlock spending trends, category breakdowns, and visual charts."
    />
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount || 0);
  };

  // Chart Theme colors
  const textColor = theme === 'dark' ? '#f8f8fc' : '#04000b';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: textColor,
    plugins: {
      legend: { labels: { color: textColor, font: { family: 'Manrope' } } }
    },
    scales: {
      x: { ticks: { color: textColor, font: { family: 'Manrope' } }, grid: { color: gridColor } },
      y: { ticks: { color: textColor, font: { family: 'Manrope' } }, grid: { color: gridColor } }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: textColor,
    plugins: { legend: { position: 'right', labels: { color: textColor, font: { family: 'Manrope' } } } }
  };

  // 1. Category Breakdown Data
  const categories = Array.isArray(data?.categoryBreakdown) ? data.categoryBreakdown : [];
  const categoryChartData = {
    labels: categories.map(c => (c.category || '').replace('_', ' ')),
    datasets: [{
      label: 'Spending by Category',
      data: categories.map(c => c.amount || 0),
      backgroundColor: [
        '#3b82f6',
        '#22c55e',
        '#0ea5e9',
        '#f59e0b',
        '#ec4899',
        '#8b5cf6',
        '#64748b',
      ],
      borderWidth: 0
    }]
  };

  // 2. Monthly Trend Data
  const monthly = Array.isArray(data?.monthlyReports) ? data.monthlyReports.slice().reverse() : [];
  const monthlyChartData = {
    labels: monthly.map(m => `${(m.month || '').substring(0, 3)} ${m.year || ''}`),
    datasets: [{
      label: 'Total Monthly Spending (₹)',
      data: monthly.map(m => m.totalAmount || 0),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="space-y-6 animate-rise">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="display-lg">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-1">Deep visual analytics of your personal spending history.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground">Total Analyzed Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold numeric">{formatCurrency(data.totalSpending)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground">Average Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold numeric">{formatCurrency(data.averageSpending)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground">Largest Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold numeric text-destructive">
              {data.highestExpense ? formatCurrency(data.highestExpense.amount) : '$0.00'}
            </p>
            {data.highestExpense && <p className="text-xs text-muted-foreground mt-0.5 truncate">{data.highestExpense.title}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground">Lowest Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold numeric text-success">
              {data.lowestExpense ? formatCurrency(data.lowestExpense.amount) : '$0.00'}
            </p>
            {data.lowestExpense && <p className="text-xs text-muted-foreground mt-0.5 truncate">{data.lowestExpense.title}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart (Line / Bar Toggle) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Spending Trend Over Time</CardTitle>
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                chartType === 'line' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                chartType === 'bar' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Bar Chart
            </button>
          </div>
        </CardHeader>
        <CardContent className="h-[350px]">
          {chartType === 'line' ? (
            <Line options={commonOptions} data={monthlyChartData} />
          ) : (
            <Bar options={commonOptions} data={monthlyChartData} />
          )}
        </CardContent>
      </Card>

      {/* Grid: Category Breakdown Pie Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <Pie options={pieOptions} data={categoryChartData} />
          </CardContent>
        </Card>

        {/* Detailed Category Table */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className="text-right">Total (₹)</th>
                    <th className="text-right">Share (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.category}>
                      <td className="font-medium">{cat.category.replace('_', ' ')}</td>
                      <td className="text-right numeric font-medium">{formatCurrency(cat.amount)}</td>
                      <td className="text-right numeric text-muted-foreground">
                        {cat.percentage?.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
