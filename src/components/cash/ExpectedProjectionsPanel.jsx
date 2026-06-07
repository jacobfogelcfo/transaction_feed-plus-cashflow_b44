import { useState, useMemo } from "react";
import { Plus, ChevronDown, ChevronRight, Trash2, Check, RotateCcw } from "lucide-react";
import { format } from "date-fns";

const fmt = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.abs(v));

const RECURRING_OPTIONS = ["one-time", "weekly", "monthly"];
const METHOD_OPTIONS = ["bank", "cc"];

function TransactionRow({ row, onUpdate, onDelete }) {
  const isIncome = row.amount >= 0;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-muted/40 group rounded text-xs">
      <input
        type="text"
        value={row.description}
        onChange={e => onUpdate({ ...row, description: e.target.value })}
        className="flex-1 min-w-0 bg-transparent outline-none truncate text-foreground placeholder:text-muted-foreground"
        placeholder="Description..."
      />
      <input
        type="number"
        value={Math.abs(row.amount)}
        onChange={e => {
          const abs = parseFloat(e.target.value) || 0;
          onUpdate({ ...row, amount: isIncome ? abs : -abs });
        }}
        className="w-20 bg-transparent outline-none text-right tabular-nums font-medium focus:bg-muted rounded px-1"
        style={{ color: isIncome ? "#059669" : "inherit" }}
      />
      <input
        type="date"
        value={row.edate}
        onChange={e => onUpdate({ ...row, edate: e.target.value })}
        className="text-[10px] text-muted-foreground bg-transparent outline-none cursor-pointer"
      />
      <select
        value={row.recurring}
        onChange={e => onUpdate({ ...row, recurring: e.target.value })}
        className="text-[10px] text-muted-foreground bg-transparent border-0 outline-none cursor-pointer"
      >
        {RECURRING_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <select
        value={row.status}
        onChange={e => onUpdate({ ...row, status: e.target.value })}
        className={`text-[10px] font-medium border rounded px-1 py-0.5 outline-none cursor-pointer ${
          row.status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
          row.status === "hold" ? "bg-red-50 text-red-700 border-red-200" :
          "bg-amber-50 text-amber-700 border-amber-200"
        }`}
      >
        <option value="pending">pending</option>
        <option value="paid">paid</option>
        <option value="hold">hold</option>
      </select>
      <button
        onClick={() => onDelete(row.id)}
        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-all shrink-0"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

function CategoryGroup({ category, rows, onUpdate, onDelete, onAddRow, allCategories }) {
  const [open, setOpen] = useState(true);
  const total = rows.reduce((s, r) => s + r.amount, 0);
  const isIncome = total >= 0;

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
      >
        {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
        <span className="text-xs font-semibold text-foreground flex-1">{category}</span>
        <span className="text-xs font-bold tabular-nums" style={{ color: isIncome ? "#059669" : "inherit" }}>
          {isIncome ? "+" : "-"}{fmt(total)}
        </span>
        <span className="text-[10px] text-muted-foreground ml-1">{rows.length} items</span>
      </button>
      {open && (
        <div className="divide-y divide-border/50">
          {rows.map(row => (
            <TransactionRow key={row.id} row={row} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
          <div className="px-2 py-1.5">
            <button
              onClick={() => onAddRow(category)}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add row
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExpectedProjectionsPanel({ transactions, onChange }) {
  const [showAddRow, setShowAddRow] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newRow, setNewRow] = useState({
    description: "", amount: "", edate: new Date().toISOString().split("T")[0],
    payment_method: "bank", payment_source: "Mercury", recurring: "one-time",
    status: "pending", category: ""
  });

  // Group by category
  const grouped = useMemo(() => {
    const cats = {};
    transactions.forEach(t => {
      const key = t.category || "Uncategorized";
      if (!cats[key]) cats[key] = [];
      cats[key].push(t);
    });
    return cats;
  }, [transactions]);

  const allCategories = Object.keys(grouped);

  const updateRow = (updated) => {
    onChange(transactions.map(t => t.id === updated.id ? updated : t));
  };

  const deleteRow = (id) => {
    onChange(transactions.filter(t => t.id !== id));
  };

  const addRow = (category = "") => {
    const row = {
      ...newRow,
      id: `e${Date.now()}`,
      amount: parseFloat(newRow.amount) || 0,
      category: category || newRow.category || "Uncategorized",
    };
    if (!row.description) return;
    onChange([...transactions, row]);
    setNewRow({
      description: "", amount: "", edate: new Date().toISOString().split("T")[0],
      payment_method: "bank", payment_source: "Mercury", recurring: "one-time",
      status: "pending", category: ""
    });
    setShowAddRow(false);
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    // Just add a placeholder row in that category
    const row = {
      id: `e${Date.now()}`,
      description: "New item",
      amount: 0,
      edate: new Date().toISOString().split("T")[0],
      payment_method: "bank",
      payment_source: "Mercury",
      recurring: "one-time",
      status: "pending",
      category: newCategory.trim(),
    };
    onChange([...transactions, row]);
    setNewCategory("");
    setShowAddCategory(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Expected Projections</h3>
          <p className="text-[10px] text-muted-foreground">Planned income & expenses</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowAddCategory(s => !s)}
            className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground border border-border rounded px-2 py-1 hover:bg-muted transition-colors"
          >
            <Plus className="w-3 h-3" />
            Category
          </button>
          <button
            onClick={() => setShowAddRow(s => !s)}
            className="flex items-center gap-1 text-[10px] font-medium bg-primary text-primary-foreground rounded px-2 py-1 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add Row
          </button>
        </div>
      </div>

      {/* Add Category inline */}
      {showAddCategory && (
        <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center gap-2">
          <input
            autoFocus
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addCategory(); if (e.key === "Escape") setShowAddCategory(false); }}
            placeholder="Category name..."
            className="flex-1 text-xs bg-card border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30"
          />
          <button onClick={addCategory} className="text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded">Add</button>
          <button onClick={() => setShowAddCategory(false)} className="text-[10px] text-muted-foreground px-1 py-1">✕</button>
        </div>
      )}

      {/* Add Row inline */}
      {showAddRow && (
        <div className="px-4 py-2 border-b border-border bg-primary/5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={newRow.description}
              onChange={e => setNewRow(r => ({ ...r, description: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && addRow()}
              placeholder="Description..."
              className="flex-1 text-xs bg-card border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30"
            />
            <input
              type="number"
              value={newRow.amount}
              onChange={e => setNewRow(r => ({ ...r, amount: e.target.value }))}
              placeholder="Amount"
              className="w-24 text-xs bg-card border border-border rounded px-2 py-1 outline-none"
            />
            <input
              type="date"
              value={newRow.edate}
              onChange={e => setNewRow(r => ({ ...r, edate: e.target.value }))}
              className="text-xs bg-card border border-border rounded px-2 py-1 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={newRow.category}
              onChange={e => setNewRow(r => ({ ...r, category: e.target.value }))}
              className="text-xs bg-card border border-border rounded px-2 py-1 outline-none flex-1"
            >
              <option value="">Select category...</option>
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="__new__">+ New category</option>
            </select>
            <select
              value={newRow.recurring}
              onChange={e => setNewRow(r => ({ ...r, recurring: e.target.value }))}
              className="text-xs bg-card border border-border rounded px-2 py-1 outline-none"
            >
              {RECURRING_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select
              value={newRow.payment_method}
              onChange={e => setNewRow(r => ({ ...r, payment_method: e.target.value }))}
              className="text-xs bg-card border border-border rounded px-2 py-1 outline-none"
            >
              {METHOD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <button onClick={() => addRow()} className="text-[10px] bg-primary text-primary-foreground px-3 py-1.5 rounded">Save</button>
            <button onClick={() => setShowAddRow(false)} className="text-[10px] text-muted-foreground px-1 py-1">✕</button>
          </div>
        </div>
      )}

      {/* Grouped list */}
      <div className="flex-1 overflow-auto px-3 py-3">
        {Object.entries(grouped).map(([cat, rows]) => (
          <CategoryGroup
            key={cat}
            category={cat}
            rows={rows}
            onUpdate={updateRow}
            onDelete={deleteRow}
            onAddRow={addRow}
            allCategories={allCategories}
          />
        ))}
        {Object.keys(grouped).length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-8">
            No expected transactions yet. Add a row or category to get started.
          </div>
        )}
      </div>
    </div>
  );
}