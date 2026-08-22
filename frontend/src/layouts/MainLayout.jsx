import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Wallet, Menu, Moon, Sun } from 'lucide-react';
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
      <aside className={`sidebar hidden md:flex flex-col`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold font-sora text-primary">BudgetBuddy</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={closeMobileMenu}>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-4 animate-rise" onClick={e => e.stopPropagation()}>
            <div className="mb-8 p-2">
              <h1 className="text-2xl font-bold font-sora text-primary">BudgetBuddy</h1>
            </div>
            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <div className="flex items-center">
            <button className="md:hidden btn btn-ghost btn-icon mr-2" onClick={toggleMobileMenu}>
              <Menu size={24} />
            </button>
            <h2 className="heading-md font-sora hidden sm:block">Welcome back</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              U
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
