import { useState, useMemo } from "react";
import { Search, ChevronDown, Calendar } from "lucide-react";
import { mockTransactions } from "@/lib/mockData";
import TransactionRow from "@/components/transactions/TransactionRow";
import CategoryGroupRow from "@/components/transactions/CategoryGroupRow";
import VendorHistoryModal from "@/components/transactions/VendorHistoryModal";
import ReimbursementModal from "@/components/transactions/ReimbursementModal";
import { startOfMonth, endOfMonth, subMonths, isWithinInterval } from "date-fns";

const TIME_FRAMES = [
  { label: "Current Month", value: "current" },
  { label: "Last Month", value: "last" },
  { label: "Last 3 Months", value: "3months" },
  { label: "Last 6 Months", value: "6months" },
  { label: "This Year", value: "year" },
];

function getTimeframeInterval(tf) {
  const now = new Date();
  if (tf === "current") return { start: startOfMonth(now), end: endOfMonth(now) };
  if (tf === "last") { const lm = subMonths(now, 1); return { start: startOfMonth(lm), end: endOfMonth(lm) }; }
  if (tf === "3months") return { start: subMonths(now, 3), end: now };
  if (tf === "6months") return { start: subMonths(now, 6), end: now };
  if (tf === "year") return { start: new Date(now.getFullYear(), 0, 1), end: now };
  return { start: startOfMonth(now), end: endOfMonth(now) };
}

export default function TransactionFeed() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [customCategories, setCustomCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [categoryTimeframe, setCategoryTimeframe] = useState("current");
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [reimbursementTxn, setReimbursementTxn] = useState(null);
  const [reimbursements, setReimbursements] = useState([]);

  const handleCategoryChange = (id, category) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, category } : t));
  };

  const handleMarkNeedsReview = (id) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "needs_review" } : t));
  };

  const handleSaveReimbursement = (reimb) => {
    setReimbursements(prev => [...prev, { ...reimb, id: `r${Date.now()}` }]);
    setTransactions(prev => prev.map(t => t.id === reimb.transaction_id ? { ...t, is_reimbursement: true } : t));
  };

  const handleAddCustomCategory = (name) => {
    setCustomCategories(prev => prev.includes(name) ? prev : [...prev, name]);
  };

  const filtered = useMemo(() => {
    let txns = transactions;
    if (search) {
      txns = txns.filter(t => t.vendor_name.toLowerCase().includes(search.toLowerCase()) || t.category?.toLowerCase().includes(search.toLowerCase()));
    }
    if (activeFilter === "needs_review") txns = txns.filter(t => t.status === "needs_review");
    if (activeFilter === "by_category") {
      const interval = getTimeframeInterval(categoryTimeframe);
      txns = txns.filter(t => isWithinInterval(new Date(t.date), interval));
    }
    return txns;
  }, [transactions, search, activeFilter, categoryTimeframe]);

  const groupedByCategory = useMemo(() => {
    if (activeFilter !== "by_category") return null;
    const groups = {};
    filtered.forEach(t => {
      const key = t.category || "Uncategorized";
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return Object.entries(groups).sort((a, b) => {
      const totA = Math.abs(a[1].reduce((s, t) => s + t.amount, 0));
      const totB = Math.abs(b[1].reduce((s, t) => s + t.amount, 0));
      return totB - totA;
    });
  }, [filtered, activeFilter]);

  const needsReviewCount = transactions.filter(t => t.status === "needs_review").length;

  return (
    <div className="flex flex-col h-full">
      {/* Page title */}
      <div className="px-6 py-3 border-b border-border bg-card shrink-0">
        <h1 className="text-lg font-bold text-foreground">Transaction Feed</h1>
      </div>
      {/* Toolbar */}
      <div className="bg-card border-b border-border px-6 py-3 flex items-center gap-3 shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-muted rounded-lg border-0 outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/30"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Quick filters */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeFilter === "all" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            All
            <span className="ml-1.5 text-[10px] text-muted-foreground">{transactions.length}</span>
          </button>

          {/* By Category */}
          <div className="relative">
            <button
              onClick={() => {
                setActiveFilter("by_category");
                setShowTimeframeDropdown(o => !o);
              }}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeFilter === "by_category" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              By Category
              <ChevronDown className="w-3 h-3" />
            </button>
            {activeFilter === "by_category" && showTimeframeDropdown && (
              <div className="absolute top-full left-0 mt-1 z-30 bg-card border border-border rounded-lg shadow-lg py-1 w-44">
                {TIME_FRAMES.map(tf => (
                  <button
                    key={tf.value}
                    onClick={() => { setCategoryTimeframe(tf.value); setShowTimeframeDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${categoryTimeframe === tf.value ? "text-primary font-medium bg-primary/5" : "text-foreground hover:bg-muted"}`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveFilter("needs_review")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeFilter === "needs_review" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Needs Review
            {needsReviewCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-[9px] bg-red-500 text-white rounded-full font-bold">
                {needsReviewCount}
              </span>
            )}
          </button>
        </div>

        {activeFilter === "by_category" && (
          <button
            onClick={() => setShowTimeframeDropdown(o => !o)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-md px-2.5 py-1.5 hover:bg-muted transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            {TIME_FRAMES.find(t => t.value === categoryTimeframe)?.label}
          </button>
        )}

        <div className="ml-auto text-xs text-muted-foreground">
          {filtered.length} transactions
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-card border-b border-border">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground w-[220px]">Vendor / Client</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground w-[180px]">Source</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground w-[90px]">Type</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground w-[180px]">Category</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground w-[120px]">Amount</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground w-[120px]">Date</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground w-[110px]">Status</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground sticky right-0 bg-card w-[60px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeFilter === "by_category" && groupedByCategory ? (
              groupedByCategory.map(([cat, txns]) => (
                <CategoryGroupRow
                  key={cat}
                  category={cat}
                  transactions={txns}
                  onVendorClick={setSelectedVendor}
                />
              ))
            ) : (
              filtered.map(txn => (
                <TransactionRow
                  key={txn.id}
                  txn={txn}
                  onVendorClick={setSelectedVendor}
                  onMarkReimbursement={setReimbursementTxn}
                  onCategoryChange={handleCategoryChange}
                  customCategories={customCategories}
                  onMarkNeedsReview={handleMarkNeedsReview}
                />
              ))
            )}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selectedVendor && (
        <VendorHistoryModal
          vendorName={selectedVendor}
          transactions={transactions}
          onClose={() => setSelectedVendor(null)}
        />
      )}
      {reimbursementTxn && (
        <ReimbursementModal
          transaction={reimbursementTxn}
          onClose={() => setReimbursementTxn(null)}
          onSave={handleSaveReimbursement}
        />
      )}
    </div>
  );
}