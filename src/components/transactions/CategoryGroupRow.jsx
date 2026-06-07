import { useState } from "react";
import { ChevronRight } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import VendorAvatar from "./VendorAvatar";
import SourceBadge from "./SourceBadge";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";

export default function CategoryGroupRow({ category, transactions, onVendorClick }) {
  const [expanded, setExpanded] = useState(false);

  const total = transactions.reduce((s, t) => s + t.amount, 0);
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <tr
        className="cursor-pointer hover:bg-muted/40 transition-colors border-b border-border bg-muted/20"
        onClick={() => setExpanded(e => !e)}
      >
        <td className="px-4 py-3" colSpan={2}>
          <div className="flex items-center gap-2">
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
            <CategoryBadge category={category} />
            <span className="text-xs text-muted-foreground ml-1">{transactions.length} transactions</span>
          </div>
        </td>
        <td className="px-4 py-3 text-right" colSpan={6}>
          <span className={`text-sm font-semibold tabular-nums ${total >= 0 ? "text-emerald-600" : "text-foreground"}`}>
            {total >= 0 ? "+" : ""}{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(total))}
          </span>
        </td>
      </tr>
      {expanded && sorted.map(txn => (
        <tr key={txn.id} className="border-b border-border hover:bg-blue-50/30 transition-colors bg-blue-50/10">
          <td className="px-4 py-2.5 pl-12">
            <button
              onClick={() => onVendorClick(txn.vendor_name)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left"
            >
              <VendorAvatar name={txn.vendor_name} size="sm" />
              <span className="text-sm font-medium text-foreground">{txn.vendor_name}</span>
            </button>
          </td>
          <td className="px-4 py-2.5">
            <SourceBadge sourceName={txn.source_name} sourceType={txn.source_type} connectionMethod={txn.connection_method} />
          </td>
          <td className="px-4 py-2.5">
            <span className={`text-xs ${txn.type === "income" ? "text-emerald-600" : "text-slate-500"}`}>
              {txn.type === "income" ? "Income" : "Expense"}
            </span>
          </td>
          <td className="px-4 py-2.5" />
          <td className="px-4 py-2.5 text-right">
            <span className={`text-sm font-semibold tabular-nums ${txn.type === "income" ? "text-emerald-600" : "text-foreground"}`}>
              {txn.type === "income" ? "+" : ""}{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(txn.amount))}
            </span>
          </td>
          <td className="px-4 py-2.5">
            <span className="text-xs text-muted-foreground tabular-nums">{format(new Date(txn.date), "MMM d, yyyy")}</span>
          </td>
          <td className="px-4 py-2.5">
            <StatusBadge status={txn.status} />
          </td>
          <td className="px-4 py-2.5" />
        </tr>
      ))}
    </>
  );
}