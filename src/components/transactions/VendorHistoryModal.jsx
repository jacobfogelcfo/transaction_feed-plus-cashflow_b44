import { X, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";
import VendorAvatar from "./VendorAvatar";
import CategoryBadge from "./CategoryBadge";
import { format } from "date-fns";

function formatAmount(amount) {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(abs);
  return amount < 0 ? `-${formatted}` : `+${formatted}`;
}

export default function VendorHistoryModal({ vendorName, transactions, onClose }) {
  if (!vendorName) return null;

  const vendorTxns = transactions
    .filter(t => t.vendor_name === vendorName)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalSpent = vendorTxns.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalReceived = vendorTxns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const lastDate = vendorTxns[0]?.date;

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="ml-auto relative w-full max-w-lg h-full bg-card border-l border-border flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <VendorAvatar name={vendorName} size="md" />
            <div>
              <h2 className="font-semibold text-foreground">{vendorName}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{vendorTxns.length} transactions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-0 border-b border-border">
          {totalSpent > 0 && (
            <div className="p-4 border-r border-border">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs">Total Paid</span>
              </div>
              <p className="font-semibold text-sm text-foreground">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalSpent)}
              </p>
            </div>
          )}
          {totalReceived > 0 && (
            <div className="p-4 border-r border-border">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs">Total Received</span>
              </div>
              <p className="font-semibold text-sm text-foreground">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalReceived)}
              </p>
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">Last Txn</span>
            </div>
            <p className="font-semibold text-sm text-foreground">
              {lastDate ? format(new Date(lastDate), "MMM d") : "—"}
            </p>
          </div>
        </div>

        {/* Transaction list */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Transaction History</h3>
            <div className="space-y-1">
              {vendorTxns.map(txn => (
                <div key={txn.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">{format(new Date(txn.date), "MMM d, yyyy")}</span>
                      <CategoryBadge category={txn.category} />
                    </div>
                    <span className="text-xs text-muted-foreground">{txn.source_name} · {txn.status}</span>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums ${txn.type === "income" ? "text-emerald-600" : "text-foreground"}`}>
                    {formatAmount(txn.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}