import { Link, useLocation } from "react-router-dom";
import { BarChart3, ArrowLeftRight, RefreshCw, DollarSign, Building2 } from "lucide-react";

const tabs = [
  { path: "/", label: "Transaction Feed", icon: ArrowLeftRight },
  { path: "/reimbursements", label: "Reimbursements", icon: RefreshCw },
  { path: "/cash", label: "Cash", icon: DollarSign },
];

export default function AppLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="h-14 border-b border-border bg-card flex items-center px-6 shrink-0">
        <div className="flex items-center gap-2.5 mr-8">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">FinFlow</span>
        </div>

        {/* Tab navigation */}
        <nav className="flex items-center gap-0.5 h-full">
          {tabs.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center gap-2 px-4 h-full text-sm font-medium transition-colors relative
                  ${isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-md px-3 py-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Demo Company</span>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}