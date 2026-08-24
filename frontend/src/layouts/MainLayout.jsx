import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Wallet, Menu, Moon, Sun, PiggyBank, ShieldCheck, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/expenses', label: 'Expenses', icon: <Receipt size={20} /> },
  { path: '/analytics', label: 'Analytics', icon: <PieChart size={20} /> },
  { path: '/budgets', label: 'Budgets', icon: <Wallet size={20} /> },
];

const MainLayout = () => {
  const { theme, toggleTheme } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="app-container">
      {/* Sidebar - Desktop */}
      <aside className="sidebar hidden md:flex flex-col border-r border-border bg-card">
        <div className="p-6 flex items-center gap-3 border-b border-border/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-sky-500 flex items-center justify-center text-white shadow-md shadow-primary/20">
            <PiggyBank size={22} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold font-sora tracking-tight text-foreground flex items-center gap-1.5">
              BudgetBuddy
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Active & Synchronized" />
            </h1>
            <p className="text-[11px] text-muted-foreground font-medium">Smart Wealth Manager</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/25 translate-x-0.5' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Human Psychology Trust Card at bottom of sidebar */}
        <div className="p-4 m-4 rounded-xl bg-muted/50 border border-border/80 text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Bank-Grade Encryption</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Your financial data is encrypted and persistent.
          </p>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={closeMobileMenu}>
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border p-5 animate-rise flex flex-col justify-between" onClick={e => e.stopPropagation()}>
            <div>
              <div className="mb-6 pb-4 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                  <PiggyBank size={22} />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-sora text-foreground">BudgetBuddy</h1>
                  <span className="text-xs text-muted-foreground">Smart Wealth Companion</span>
                </div>
              </div>
              <nav className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive 
                          ? 'bg-primary text-white shadow-md' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Protected & Synchronized</span>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden btn btn-ghost btn-icon" onClick={toggleMobileMenu} aria-label="Open Menu">
              <Menu size={22} />
            </button>
            
            {/* Header App Name & Psychology Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-sky-500 flex items-center justify-center text-white shadow-sm md:hidden">
                <PiggyBank size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold font-sora text-foreground tracking-tight">
                    BudgetBuddy
                  </h2>
                  <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Sync
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground hidden sm:block">
                  Personal Wealth & Expense Tracking System
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              className="btn btn-ghost btn-icon rounded-xl hover:bg-muted transition-colors" 
              onClick={toggleTheme} 
              aria-label="Toggle Dark/Light Mode"
              title="Switch Visual Theme"
            >
              {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-700" />}
            </button>
            
            {/* User Profile Avatar */}
            <div 
              className="flex items-center gap-2 pl-2 border-l border-border"
              title="User Account"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                S
              </div>
              <span className="text-xs font-semibold text-foreground hidden sm:block">Srushti</span>
            </div>
          </div>
        </header>
        
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
