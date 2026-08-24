import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const PERIODS = [
  { value: 'MONTHLY', label: 'Monthly (Best for regular expenses)' },
  { value: 'WEEKLY', label: 'Weekly (Best for short-term goals)' },
  { value: 'YEARLY', label: 'Yearly (Best for annual targets)' }
];

const BudgetForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    period: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        amount: initialData.amount || '',
        period: initialData.period || 'MONTHLY',
        startDate: initialData.startDate || new Date().toISOString().split('T')[0],
        endDate: initialData.endDate || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-update end date when period changes for convenience
    if (name === 'period') {
      const now = new Date();
      let end = new Date();
      if (value === 'WEEKLY') {
        end.setDate(now.getDate() + 7);
      } else if (value === 'MONTHLY') {
        end.setMonth(now.getMonth() + 1);
      } else if (value === 'YEARLY') {
        end.setFullYear(now.getFullYear() + 1);
      }
      setFormData(prev => ({
        ...prev,
        period: value,
        endDate: end.toISOString().split('T')[0]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Budget Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., Monthly Groceries, Dining Out"
        required
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Budget Limit (₹)"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="5000"
          required
        />
        
        <Select
          label="Budget Period"
          name="period"
          value={formData.period}
          onChange={handleChange}
          options={PERIODS}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        
        <Input
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Save Changes' : 'Create Budget'}
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;
