import { useState, useMemo } from "react";
import { Plus, ChevronDown, ChevronRight, Trash2 } from "lucide-react";

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

function InlineAddRow({ category, allCategories, onSave, onCancel }) {
  const [row, setRow] = useState({
    description: "", amount: "", edate: new Date().toISOString().split("T")[0],
    payment_method: "bank", recurring: "one-time", status: "pending",
    category: category || "",
  });

  const save = () => {
    if (!row.description) return;
    onSave({ ...row, amount: parseFloat(row.amount) || 0, id: `e${Date.now()}` });
  };

  return (
    <div className="px-2 py-2 bg-primary/5 border-t border-border flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <input autoFocus value={row.description} onChange={e => setRow(r => ({ ...r, description: e.target.value }))}
          onKeyDown={e => e.key === "Enter" && save()}
          placeholder="Description..." className="flex-1 text-xs bg-card border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30" />
        <input type="number" value={row.amount} onChange={e => setRow(r => ({ ...r, amount: e.target.value }))}
          placeholder="Amount" className="w-24 text-xs bg-card border border-border rounded px-2 py-1 outline-none" />
        <input type="date" value={row.edate} onChange={e => setRow(r => ({ ...r, edate: e.target.value }))}
          className="text-xs bg-card border border-border rounded px-2 py-1 outline-none" />
      </div>
      <div className="flex items-center gap-1.5">
        {!category && (
          <select value={row.category} onChange={e => setRow(r => ({ ...r, category: e.target.value }))}
            className="text-xs bg-card border border-border rounded px-2 py-1 outline-none flex-1">
            <option value="">Select category...</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <select value={row.recurring} onChange={e => setRow(r => ({ ...r, recurring: e.target.value }))}
          className="text-xs bg-card border border-border rounded px-2 py-1 outline-none">
          {RECURRING_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={row.payment_method} onChange={e => setRow(r => ({ ...r, payment_method: e.target.value }))}
          className="text-xs bg-card border border-border rounded px-2 py-1 outline-none">
          {METHOD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <button onClick={save} className="text-[10px] bg-primary text-primary-foreground px-2.5 py-1.5 rounded">Save</button>
        <button onClick={onCancel} className="text-[10px] text-muted-foreground px-1">✕</button>
      </div>
    </div>
  );
}

function CategoryGroup({ category, rows, onUpdate, onDelete, onAddRow, allCategories }) {
  const [open, setOpen] = useState(true);
  const [addingRow, setAddingRow] = useState(false);
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
        <span className="text-[10px] text-muted-foreground ml-1">{rows.length} item{rows.length !== 1 ? "s" : ""}</span>
      </button>

      {open && (
        <div>
          {rows.length === 0 ? (
            <div className="px-4 py-4 text-center">
              <button
                onClick={() => setAddingRow(true)}
                className="flex items-center gap-1.5 text-xs text-primary hover:underline mx-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                Add transaction to this category
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {rows.map(row => (
                <TransactionRow key={row.id} row={row} onUpdate={onUpdate} onDelete={onDelete} />
              ))}
              {!addingRow && (
                <div className="px-2 py-1.5">
                  <button onClick={() => setAddingRow(true)} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                    <Plus className="w-3 h-3" /> Add row
                  </button>
                </div>
              )}
            </div>
          )}
          {addingRow && (
            <InlineAddRow
              category={category}
              allCategories={allCategories}
              onSave={(row) => { onAddRow(row); setAddingRow(false); }}
              onCancel={() => setAddingRow(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function ExpectedProjectionsPanel({ transactions, onChange }) {
  const [showAddRow, setShowAddRow] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Track empty categories (created but no transactions yet)
  const [emptyCategories, setEmptyCategories] = useState([]);

  const grouped = useMemo(() => {
    const cats = {};
    // Include empty categories
    emptyCategories.forEach(c => { if (!cats[c]) cats[c] = []; });
    transactions.forEach(t => {
      const key = t.category || "Uncategorized";
      if (!cats[key]) cats[key] = [];
      cats[key].push(t);
    });
    return cats;
  }, [transactions, emptyCategories]);

  const allCategories = Object.keys(grouped);

  const updateRow = (updated) => onChange(transactions.map(t => t.id === updated.id ? updated : t));
  const deleteRow = (id) => onChange(transactions.filter(t => t.id !== id));
  const addRow = (row) => {
    const cat = row.category || "Uncategorized";
    // Remove from empty categories if it was there
    setEmptyCategories(prev => prev.filter(c => c !== cat));
    onChange([...transactions, row]);
  };

  const addCategory = () => {
    const name = newCategory.trim();
    if (!name || allCategories.includes(name)) return;
    setEmptyCategories(prev => [...prev, name]);
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
            <Plus className="w-3 h-3" /> Category
          </button>
          <button
            onClick={() => setShowAddRow(s => !s)}
            className="flex items-center gap-1 text-[10px] font-medium bg-primary text-primary-foreground rounded px-2 py-1 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Row
          </button>
        </div>
      </div>

      {/* Add Category inline */}
      {showAddCategory && (
        <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center gap-2 shrink-0">
          <input
            autoFocus value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addCategory(); if (e.key === "Escape") setShowAddCategory(false); }}
            placeholder="Category name..."
            className="flex-1 text-xs bg-card border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30"
          />
          <button onClick={addCategory} className="text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded">Add</button>
          <button onClick={() => setShowAddCategory(false)} className="text-[10px] text-muted-foreground">✕</button>
        </div>
      )}

      {/* Global Add Row */}
      {showAddRow && (
        <div className="shrink-0 border-b border-border">
          <InlineAddRow
            category=""
            allCategories={allCategories}
            onSave={(row) => { addRow(row); setShowAddRow(false); }}
            onCancel={() => setShowAddRow(false)}
          />
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