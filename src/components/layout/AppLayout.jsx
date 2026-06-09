import { Link, useLocation } from "react-router-dom";
import { BarChart3, ArrowLeftRight, RefreshCw, DollarSign, Building2, LayoutDashboard, Network } from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/", label: "Transaction Feed", icon: ArrowLeftRight },
  { path: "/reimbursements", label: "Reimbursements", icon: RefreshCw },
  { path: "/cash", label: "Cash & Projections", icon: DollarSign },
  { path: "/entities", label: "Business Entities", icon: Network },
];

export default function AppLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - collapsed/icon-only */}
      <aside className="w-14 shrink-0 flex flex-col border-r border-border bg-card">
        {/* Brand */}
        <div className="h-14 flex items-center justify-center border-b border-border shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col items-center py-3 gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                title={label}
                className={`
                  w-9 h-9 flex items-center justify-center rounded-lg transition-colors
                  ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
              </Link>
            );
          })}
        </nav>

        {/* Company context */}
        <div className="flex items-center justify-center py-4 border-t border-border">
          <div title="Demo Company">
            <Building2 className="w-4 h-4 text-muted-foreground" />
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