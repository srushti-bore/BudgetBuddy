import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ExpenseForm from '../components/features/ExpenseForm';
import ExpenseTable from '../components/features/ExpenseTable';
import ExpenseFilters from '../components/features/ExpenseFilters';
import LoadingState from '../components/common/LoadingState';
import ErrorMessage from '../components/common/ErrorMessage';
import { expenseService } from '../services/expenseService';
import { toast } from 'sonner';

const DEFAULT_FILTERS = {
  search: '',
  category: '',
  fromDate: '',
  toDate: '',
  minAmount: '',
  maxAmount: '',
  page: 0,
  size: 10,
  sortBy: 'expenseDate',
  direction: 'desc'
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Clean up empty params before sending
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
          params[key] = filters[key];
        }
      });
      const data = await expenseService.getAll(params);
      setExpenses(data.content);
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        totalElements: data.totalElements
      });
    } catch (err) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (editingExpense) {
        await expenseService.update(editingExpense.id, data);
        toast.success('Expense updated');
      } else {
        await expenseService.create(data);
        toast.success('Expense recorded');
      }
      setIsModalOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      toast.error(err.message || 'Failed to save expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await expenseService.delete(id);
      toast.success('Expense deleted');
      fetchExpenses();
    } catch (err) {
      toast.error(err.message || 'Failed to delete expense');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="space-y-6 animate-rise">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="display-lg">Expenses</h1>
          <p className="text-muted-foreground mt-1">Manage, filter, and track your spending history.</p>
        </div>
        <Button onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}>
          <Plus size={18} />
          Add Expense
        </Button>
      </div>

      <ExpenseFilters 
        filters={filters} 
        onFilterChange={setFilters} 
        onReset={() => setFilters(DEFAULT_FILTERS)} 
      />

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchExpenses} />
      ) : (
        <>
          <ExpenseTable 
            expenses={expenses} 
            onEdit={(expense) => { setEditingExpense(expense); setIsModalOpen(true); }} 
            onDelete={handleDelete} 
          />

          {/* Pagination Bar */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
              <span className="text-sm text-muted-foreground">
                Showing page {pagination.page + 1} of {pagination.totalPages} ({pagination.totalElements} total items)
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  disabled={pagination.page === 0} 
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  <ChevronLeft size={16} /> Previous
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  disabled={pagination.page >= pagination.totalPages - 1} 
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingExpense(null); }} 
        title={editingExpense ? "Edit Expense" : "New Expense"}
      >
        <ExpenseForm 
          initialData={editingExpense}
          onSubmit={handleCreateOrUpdate} 
          onCancel={() => { setIsModalOpen(false); setEditingExpense(null); }} 
        />
      </Modal>
    </div>
  );
};

export default Expenses;
