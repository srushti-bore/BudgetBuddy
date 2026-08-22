import React, { useState, useEffect } from 'react';
import { Plus, Target, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';
import BudgetForm from '../components/features/BudgetForm';
import LoadingState from '../components/common/LoadingState';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { budgetService } from '../services/budgetService';
import { toast } from 'sonner';

const PERIOD_TABS = ['ALL', 'WEEKLY', 'MONTHLY', 'YEARLY'];

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
      setBudgets(data);
      
      const utils = {};
      for (const budget of data) {
        const utilData = await budgetService.getUtilization(budget.id);
        utils[budget.id] = utilData;
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

  return (
    <div className="space-y-6 animate-rise">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="display-lg">Budgets</h1>
          <p className="text-muted-foreground mt-1">Set limits, monitor utilization, and stay on budget.</p>
        </div>
        <Button onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}>
          <Plus size={18} />
          Create Budget
        </Button>
      </div>

      {/* Period Filter Tabs */}
      <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto">
        {PERIOD_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedPeriod(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedPeriod === tab
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab === 'ALL' ? 'All Periods' : tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingState text="Loading budgets..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchBudgets} />
      ) : filteredBudgets.length === 0 ? (
        <EmptyState 
          title="No budgets found" 
          description={selectedPeriod === 'ALL' ? "Create your first budget to start tracking your spending goals." : `No ${selectedPeriod.toLowerCase()} budgets configured.`}
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

            let statusColor = 'text-success';
            let progressBg = 'bg-success';
            let StatusIcon = CheckCircle2;
            let statusLabel = 'On Track';

            if (rawPercent >= 100) {
              statusColor = 'text-destructive';
              progressBg = 'bg-destructive';
              StatusIcon = XCircle;
              statusLabel = 'Exceeded';
            } else if (rawPercent >= 80) {
              statusColor = 'text-warning';
              progressBg = 'bg-warning';
              StatusIcon = AlertTriangle;
              statusLabel = 'Near Limit';
            }

            return (
              <Card key={budget.id} className="relative overflow-hidden flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base font-semibold">{budget.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{budget.startDate} to {budget.endDate}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-muted ${statusColor}`}>
                    <StatusIcon size={14} />
                    <span>{statusLabel}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="mt-2 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold numeric">{formatCurrency(spent)}</span>
                      <span className="text-sm text-muted-foreground numeric">of {formatCurrency(budget.amount)}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{rawPercent.toFixed(1)}% utilized</span>
                      <span>{formatCurrency(remaining)} {remaining < 0 ? 'over' : 'left'}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                    <span className="badge badge-outline">{budget.period}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingBudget(budget); setIsModalOpen(true); }}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(budget.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingBudget(null); }} 
        title={editingBudget ? "Edit Budget" : "New Budget"}
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
