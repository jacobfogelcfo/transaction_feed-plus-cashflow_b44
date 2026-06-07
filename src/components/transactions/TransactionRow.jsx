import { MoreHorizontal, ArrowUpRight, ArrowDownLeft, Flag, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import VendorAvatar from "./VendorAvatar";
import SourceBadge from "./SourceBadge";
import CategoryBadge from "./CategoryBadge";
import StatusBadge from "./StatusBadge";
import CategorySelect from "./CategorySelect";
import { format } from "date-fns";

function formatAmount(amount) {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(abs);
  return { text: (amount < 0 ? "-" : "+") + formatted.replace("$", "") + "", raw: formatted };
}

function ActionMenu({ onMarkReimbursement, onMarkNeedsReview }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg py-1 overflow-hidden">
          <button
            onClick={() => { onMarkReimbursement(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted transition-colors text-left"
          >
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            Mark as Reimbursement
          </button>
          <button
            onClick={() => { onMarkNeedsReview(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-muted transition-colors text-left"
          >
            <Flag className="w-3.5 h-3.5 text-muted-foreground" />
            Flag for Review
          </button>
        </div>
      )}
    </div>
  );
}

export default function TransactionRow({ txn, onVendorClick, onMarkReimbursement, onCategoryChange, customCategories, onMarkNeedsReview }) {
  const { text: amtText } = formatAmount(txn.amount);

  return (
    <tr className="group hover:bg-muted/40 transition-colors border-b border-border last:border-0">
      {/* Vendor */}
      <td className="px-4 py-3">
        <button
          onClick={() => onVendorClick(txn.vendor_name)}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity text-left"
        >
          <VendorAvatar name={txn.vendor_name} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate leading-tight">{txn.vendor_name}</p>
            {txn.is_reimbursement && (
              <span className="text-[10px] text-amber-600 font-medium">Reimbursement</span>
            )}
          </div>
        </button>
      </td>

      {/* Source */}
      <td className="px-4 py-3">
        <SourceBadge
          sourceName={txn.source_name}
          sourceType={txn.source_type}
          connectionMethod={txn.connection_method}
        />
      </td>

      {/* Type */}
      <td className="px-4 py-3">
        <div className={`inline-flex items-center gap-1 text-xs font-medium ${txn.type === "income" ? "text-emerald-600" : "text-slate-500"}`}>
          {txn.type === "income"
            ? <ArrowDownLeft className="w-3.5 h-3.5" />
            : <ArrowUpRight className="w-3.5 h-3.5" />
          }
          {txn.type === "income" ? "Income" : "Expense"}
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <CategorySelect
          value={txn.category}
          onChange={(cat) => onCategoryChange(txn.id, cat)}
          customCategories={customCategories}
        />
      </td>

      {/* Amount */}
      <td className="px-4 py-3 text-right">
        <span className={`text-sm font-semibold tabular-nums ${txn.type === "income" ? "text-emerald-600" : "text-foreground"}`}>
          {txn.type === "income" ? "+" : ""}{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(txn.amount))}
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-3">
        <span className="text-xs text-muted-foreground tabular-nums">
          {format(new Date(txn.date), "MMM d, yyyy")}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={txn.status} />
      </td>

      {/* Actions — sticky right */}
      <td className="px-4 py-3 sticky right-0 bg-card group-hover:bg-muted/40 transition-colors">
        <div className="flex items-center justify-end gap-1">
          <ActionMenu
            onMarkReimbursement={() => onMarkReimbursement(txn)}
            onMarkNeedsReview={() => onMarkNeedsReview(txn.id)}
          />
        </div>
      </td>
    </tr>
  );
}