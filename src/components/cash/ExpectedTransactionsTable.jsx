import { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { mockExpectedTransactions } from "@/lib/mockData";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  hold: "bg-red-50 text-red-700 border-red-200",
  cleared: "bg-blue-50 text-blue-700 border-blue-200",
};

const PAYMENT_METHOD_OPTIONS = ["bank", "cc"];
const STATUS_OPTIONS = ["pending", "paid", "hold", "cleared"];
const RECURRING_OPTIONS = ["one-time", "weekly", "monthly"];

function EditableCell({ value, onChange, type = "text", options }) {
  const [editing, setEditing] = useState(false);

  if (options) {
    return (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-xs bg-transparent border-0 outline-none cursor-pointer text-foreground"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }

  if (editing) {
    return (
      <input
        autoFocus
        type={type}
        value={value}
        onChange={e => onChange(type === "number" ? parseFloat(e.target.value) : e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={e => e.key === "Enter" && setEditing(false)}
        className="w-full text-xs bg-muted rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30"
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className="cursor-text hover:bg-muted px-1 py-0.5 rounded text-xs transition-colors"
    >
      {type === "number"
        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(value || 0))
        : (type === "date" && value ? format(new Date(value), "MM/dd/yy") : (value || "—"))
      }
    </span>
  );
}

export default function ExpectedTransactionsTable({ onDataChange }) {
  const [rows, setRows] = useState(mockExpectedTransactions);
  const [newRow, setNewRow] = useState(null);

  const updateRow = (id, field, value) => {
    const updated = rows.map(r => r.id === id ? { ...r, [field]: value } : r);
    setRows(updated);
    onDataChange?.(updated);
  };

  const deleteRow = (id) => {
    const updated = rows.filter(r => r.id !== id);
    setRows(updated);
    onDataChange?.(updated);
  };

  const addRow = () => {
    setNewRow({
      id: `e${Date.now()}`,
      description: "",
      amount: 0,
      edate: new Date().toISOString().split("T")[0],
      payment_method: "bank",
      payment_source: "Mercury",
      recurring: "one-time",
      status: "pending",
      category: "",
      notes: "",
    });
  };

  const saveNewRow = () => {
    if (!newRow?.description) { setNewRow(null); return; }
    const updated = [...rows, newRow];
    setRows(updated);
    onDataChange?.(updated);
    setNewRow(null);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Expected Transactions</h3>
        <Button size="sm" variant="outline" onClick={addRow} className="h-7 text-xs gap-1">
          <Plus className="w-3.5 h-3.5" />
          Add Row
        </Button>
      </div>
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">Description</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">Amount</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">eDate</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">Method</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">Source</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">Recur</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">Status</th>
              <th className="px-3 py-2 w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.sort((a, b) => new Date(a.edate) - new Date(b.edate)).map(row => (
              <tr key={row.id} className={`border-b border-border hover:bg-muted/20 transition-colors group ${row.status === "cleared" ? "opacity-50" : ""}`}>
                <td className="px-3 py-2 max-w-[140px]">
                  <EditableCell value={row.description} onChange={v => updateRow(row.id, "description", v)} />
                </td>
                <td className="px-3 py-2">
                  <span className={`text-xs font-semibold tabular-nums ${row.amount >= 0 ? "text-emerald-600" : "text-foreground"}`}>
                    <EditableCell value={row.amount} onChange={v => updateRow(row.id, "amount", v)} type="number" />
                  </span>
                </td>
                <td className="px-3 py-2">
                  <EditableCell value={row.edate} onChange={v => updateRow(row.id, "edate", v)} type="date" />
                </td>
                <td className="px-3 py-2">
                  <EditableCell value={row.payment_method} onChange={v => updateRow(row.id, "payment_method", v)} options={PAYMENT_METHOD_OPTIONS} />
                </td>
                <td className="px-3 py-2">
                  <EditableCell value={row.payment_source} onChange={v => updateRow(row.id, "payment_source", v)} />
                </td>
                <td className="px-3 py-2">
                  <EditableCell value={row.recurring} onChange={v => updateRow(row.id, "recurring", v)} options={RECURRING_OPTIONS} />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={row.status}
                    onChange={e => updateRow(row.id, "status", e.target.value)}
                    className={`text-[10px] font-medium border rounded px-1.5 py-0.5 cursor-pointer outline-none ${STATUS_STYLES[row.status]}`}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => deleteRow(row.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
            {newRow && (
              <tr className="border-b border-border bg-primary/5">
                <td className="px-3 py-2">
                  <input
                    autoFocus
                    placeholder="Description..."
                    value={newRow.description}
                    onChange={e => setNewRow(r => ({ ...r, description: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && saveNewRow()}
                    className="w-full text-xs bg-muted rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={newRow.amount}
                    onChange={e => setNewRow(r => ({ ...r, amount: parseFloat(e.target.value) }))}
                    className="w-20 text-xs bg-muted rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="date"
                    value={newRow.edate}
                    onChange={e => setNewRow(r => ({ ...r, edate: e.target.value }))}
                    className="text-xs bg-muted rounded px-2 py-1 outline-none"
                  />
                </td>
                <td className="px-3 py-2">
                  <select value={newRow.payment_method} onChange={e => setNewRow(r => ({ ...r, payment_method: e.target.value }))} className="text-xs bg-muted rounded px-1 py-1">
                    {PAYMENT_METHOD_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input placeholder="Source..." value={newRow.payment_source} onChange={e => setNewRow(r => ({ ...r, payment_source: e.target.value }))} className="w-20 text-xs bg-muted rounded px-2 py-1 outline-none" />
                </td>
                <td className="px-3 py-2">
                  <select value={newRow.recurring} onChange={e => setNewRow(r => ({ ...r, recurring: e.target.value }))} className="text-xs bg-muted rounded px-1 py-1">
                    {RECURRING_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2" colSpan={2}>
                  <div className="flex gap-1">
                    <button onClick={saveNewRow} className="text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded">Save</button>
                    <button onClick={() => setNewRow(null)} className="text-[10px] text-muted-foreground px-2 py-1 rounded hover:bg-muted">Cancel</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}