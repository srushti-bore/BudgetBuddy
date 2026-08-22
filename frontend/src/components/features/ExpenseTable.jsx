import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';

const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return <EmptyState title="No expenses found" description="You haven't recorded any expenses yet." />;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th className="text-right">Amount</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{formatDate(expense.expenseDate)}</td>
              <td className="font-medium">{expense.title}</td>
              <td>
                <span className="badge badge-outline">
                  {expense.category.replace('_', ' ')}
                </span>
              </td>
              <td className="text-right font-medium text-destructive">
                -{formatCurrency(expense.amount)}
              </td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete(expense.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
