import { Link, useLocation } from "react-router-dom";
import { BarChart3, ArrowLeftRight, RefreshCw, DollarSign, Building2 } from "lucide-react";

const navItems = [
  { path: "/", label: "Transaction Feed", icon: ArrowLeftRight },
  { path: "/reimbursements", label: "Reimbursements", icon: RefreshCw },
  { path: "/cash", label: "Cash & Projections", icon: DollarSign },
];

export default function AppLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-border bg-card">
        {/* Brand */}
        <div className="h-14 flex items-center px-4 border-b border-border shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center mr-2.5">
            <BarChart3 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">FinFlow</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Company context */}
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Demo Company</span>
          </div>
        </div>
      </aside>

      {/* Page content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}