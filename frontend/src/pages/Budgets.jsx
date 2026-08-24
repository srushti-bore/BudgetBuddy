import React, { useState, useEffect } from 'react';
import { Plus, Target, CheckCircle2, AlertTriangle, XCircle, Wallet, Edit2, Trash2 } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import BudgetForm from '../components/features/BudgetForm';
import LoadingState from '../components/common/LoadingState';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { budgetService } from '../services/budgetService';
import { toast } from 'sonner';

const PERIOD_TABS = [
  { id: 'ALL', label: 'All Budgets' },
  { id: 'MONTHLY', label: 'Monthly' },
  { id: 'WEEKLY', label: 'Weekly' },
  { id: 'YEARLY', label: 'Yearly' }
];

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [utilizations, setUtilizations] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await budgetService.getAll();
      const safeData = Array.isArray(data) ? data : [];
      setBudgets(safeData);
      
      const utils = {};
      for (const budget of safeData) {
        try {
          const utilData = await budgetService.getUtilization(budget.id);
          utils[budget.id] = utilData;
        } catch (e) {
          console.warn('Could not fetch utilization for budget', budget.id, e);
        }
      }
      setUtilizations(utils);
    } catch (err) {
      setError(err.message || 'Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editingBudget) {
        await budgetService.update(editingBudget.id, data);
        toast.success('Budget updated');
      } else {
        await budgetService.create(data);
        toast.success('Budget created');
      }
      setIsModalOpen(false);
      setEditingBudget(null);
      fetchBudgets();
    } catch (err) {
      toast.error(err.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    try {
      await budgetService.delete(id);
      toast.success('Budget deleted');
      fetchBudgets();
    } catch (err) {
      toast.error(err.message || 'Failed to delete budget');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount || 0);
  };

  const filteredBudgets = selectedPeriod === 'ALL' 
    ? budgets 
    : budgets.filter(b => b.period === selectedPeriod);

  // Totals for quick overview
  const totalAllocated = budgets.reduce((acc, b) => acc + (b.amount || 0), 0);
  const totalSpent = Object.values(utilizations).reduce((acc, u) => acc + (u?.spentAmount || 0), 0);
  const totalRemaining = totalAllocated - totalSpent;

  return (
    <div className="space-y-6 animate-rise">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sora text-foreground">Budgets & Limits</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Set spending limits and track your savings easily.</p>
        </div>
        <Button onClick={() => { setEditingBudget(null); setIsModalOpen(true); }} className="shadow-sm">
          <Plus size={18} />
          Create Budget
        </Button>
      </div>

      {/* Simplified Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Budget Pool</span>
          <span className="text-2xl font-bold numeric text-foreground mt-1">{formatCurrency(totalAllocated)}</span>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Spent</span>
          <span className="text-2xl font-bold numeric text-primary mt-1">{formatCurrency(totalSpent)}</span>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available Remaining</span>
          <span className={`text-2xl font-bold numeric mt-1 ${totalRemaining < 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {formatCurrency(totalRemaining)}
          </span>
        </div>
      </div>

      {/* Clean Period Filter Tabs */}
      <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto">
        {PERIOD_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedPeriod(tab.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              selectedPeriod === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground bg-muted/40 hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingState text="Loading budgets..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchBudgets} />
      ) : filteredBudgets.length === 0 ? (
        <EmptyState 
          title="No budgets created yet" 
          description={selectedPeriod === 'ALL' ? "Create your first budget limit to keep your expenses on track." : `No ${selectedPeriod.toLowerCase()} budgets configured.`}
          action={
            <Button onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}>
              <Plus size={18} /> Create Budget
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBudgets.map((budget) => {
            const util = utilizations[budget.id];
            const spent = util ? util.spentAmount : 0;
            const remaining = util ? util.remainingAmount : budget.amount;
            const percent = util ? Math.min(util.utilizationPercentage, 100) : 0;
            const rawPercent = util ? util.utilizationPercentage : 0;

            let statusBadge = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            let progressBg = 'bg-emerald-500';
            let StatusIcon = CheckCircle2;
            let statusLabel = 'On Track';

            if (rawPercent >= 100) {
              statusBadge = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
              progressBg = 'bg-rose-500';
              StatusIcon = XCircle;
              statusLabel = 'Exceeded';
            } else if (rawPercent >= 80) {
              statusBadge = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
              progressBg = 'bg-amber-500';
              StatusIcon = AlertTriangle;
              statusLabel = 'Near Limit';
            }

            return (
              <Card key={budget.id} className="relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50">
                    <div>
                      <CardTitle className="text-base font-bold text-foreground">{budget.name}</CardTitle>
                      <span className="inline-block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                        {budget.period} BUDGET
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusBadge}`}>
                      <StatusIcon size={14} />
                      <span>{statusLabel}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-4">
                    {/* Spent vs Total Amount */}
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-xs text-muted-foreground block">Spent</span>
                        <span className="text-2xl font-bold numeric text-foreground">{formatCurrency(spent)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground block">Limit</span>
                        <span className="text-sm font-semibold numeric text-muted-foreground">{formatCurrency(budget.amount)}</span>
                      </div>
                    </div>
                    
                    {/* Visual Progress Meter */}
                    <div className="space-y-1.5">
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-muted-foreground">{rawPercent.toFixed(0)}% used</span>
                        <span className={remaining < 0 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'}>
                          {remaining < 0 ? `${formatCurrency(Math.abs(remaining))} Over Limit` : `${formatCurrency(remaining)} Left`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center px-5 py-3 bg-muted/30 border-t border-border/50 -mx-5 -mb-5 mt-4">
                  <span className="text-[11px] text-muted-foreground">
                    {budget.startDate ? new Date(budget.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''} – {budget.endDate ? new Date(budget.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingBudget(budget); setIsModalOpen(true); }} className="hover:bg-card">
                      <Edit2 size={14} className="mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-500/10" onClick={() => handleDelete(budget.id)}>
                      <Trash2 size={14} className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingBudget(null); }} 
        title={editingBudget ? "Edit Budget Limit" : "Create New Budget"}
      >
        <BudgetForm 
          initialData={editingBudget}
          onSubmit={handleCreateOrUpdate} 
          onCancel={() => { setIsModalOpen(false); setEditingBudget(null); }} 
        />
      </Modal>
    </div>
  );
};

export default Budgets;
