import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'FOOD', label: 'Food & Dining' },
  { value: 'TRANSPORT', label: 'Transportation' },
  { value: 'SHOPPING', label: 'Shopping' },
  { value: 'BILLS', label: 'Bills & Utilities' },
  { value: 'HEALTH', label: 'Healthcare' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'OTHER', label: 'Other' }
];

const SORT_FIELDS = [
  { value: 'expenseDate', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'title', label: 'Title' },
  { value: 'category', label: 'Category' }
];

const PAGE_SIZES = [
  { value: '5', label: '5 per page' },
  { value: '10', label: '10 per page' },
  { value: '25', label: '25 per page' },
  { value: '50', label: '50 per page' }
];

const ExpenseFilters = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value, page: 0 });
  };

  const toggleSortDirection = () => {
    const nextDirection = filters.direction === 'asc' ? 'desc' : 'asc';
    onFilterChange({ ...filters, direction: nextDirection, page: 0 });
  };

  const hasActiveFilters = filters.search || filters.category || filters.fromDate || filters.toDate || filters.minAmount || filters.maxAmount;

  return (
    <div className="card p-4 space-y-4 mb-6">
      {/* Top Row: Search & Category */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Input
            placeholder="Search by title or description..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        <div className="w-full md:w-48">
          <Select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            options={CATEGORIES}
          />
        </div>
      </div>

      {/* Middle Row: Date Range & Amount Range */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-border">
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">From Date</label>
          <Input
            type="date"
            value={filters.fromDate || ''}
            onChange={(e) => handleChange('fromDate', e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">To Date</label>
          <Input
            type="date"
            value={filters.toDate || ''}
            onChange={(e) => handleChange('toDate', e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Min Amount (₹)</label>
          <Input
            type="number"
            placeholder="0.00"
            value={filters.minAmount || ''}
            onChange={(e) => handleChange('minAmount', e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Max Amount (₹)</label>
          <Input
            type="number"
            placeholder="9999.00"
            value={filters.maxAmount || ''}
            onChange={(e) => handleChange('maxAmount', e.target.value)}
          />
        </div>
      </div>

      {/* Bottom Row: Sorting, Page Size & Clear */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border text-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-muted-foreground font-medium text-xs">Sort by:</span>
          <div className="w-36">
            <Select
              value={filters.sortBy || 'expenseDate'}
              onChange={(e) => handleChange('sortBy', e.target.value)}
              options={SORT_FIELDS}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleSortDirection}
            className="flex items-center gap-1"
          >
            <ArrowUpDown size={14} />
            {filters.direction === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="w-32">
            <Select
              value={String(filters.size || 10)}
              onChange={(e) => handleChange('size', parseInt(e.target.value, 10))}
              options={PAGE_SIZES}
            />
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
              <X size={14} className="mr-1" /> Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;
