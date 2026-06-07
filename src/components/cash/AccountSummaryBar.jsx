import { useState } from "react";
import { CreditCard, Landmark, Pencil, Check } from "lucide-react";
import { format } from "date-fns";

function EditableValue({ value, onChange, prefix = "", suffix = "", format: fmt }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const display = fmt ? fmt(value) : `${prefix}${value}${suffix}`;

  if (editing) {
    return (
      <input
        autoFocus
        type="text"
        defaultValue={value}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { onChange(draft || value); setEditing(false); }}
        onKeyDown={e => { if (e.key === "Enter") { onChange(draft || value); setEditing(false); } }}
        className="w-24 text-sm font-bold bg-muted rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-primary/40 tabular-nums"
      />
    );
  }

  return (
    <button
      onClick={() => { setDraft(String(value)); setEditing(true); }}
      className="flex items-center gap-1 group"
    >
      <span className="font-bold text-sm text-foreground tabular-nums">{display}</span>
      <Pencil className="w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

const fmt = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

export default function AccountSummaryBar({ creditCards, onCreditCardsChange, bankBalance, onBankBalanceChange }) {
  return (
    <div className="bg-card border-b border-border px-5 py-3 flex items-center gap-0 shrink-0 overflow-x-auto">
      {/* Bank Balance */}
      <div className="flex items-center gap-3 pr-5 border-r border-border mr-5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
          <Landmark className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Bank Balance</p>
          <EditableValue
            value={bankBalance}
            onChange={v => onBankBalanceChange(parseFloat(String(v).replace(/[^0-9.-]/g, "")) || bankBalance)}
            fmt={fmt}
          />
        </div>
      </div>

      {/* Credit Cards */}
      <div className="flex items-center gap-4">
        {creditCards.map((card, i) => (
          <div key={card.id} className={`flex items-center gap-3 ${i < creditCards.length - 1 ? "pr-4 border-r border-border mr-0" : ""}`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: card.color + "22" }}>
              <CreditCard className="w-4 h-4" style={{ color: card.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[110px]">
                {card.name} ••{card.last_four}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-foreground tabular-nums">{fmt(card.balance_owed)}</span>
                <span className="text-[10px] text-muted-foreground">/ {fmt(card.credit_limit)} limit</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-muted-foreground">Due:</span>
                <input
                  type="date"
                  value={card.payment_due_date || ""}
                  onChange={e => {
                    const updated = creditCards.map(c => c.id === card.id ? { ...c, payment_due_date: e.target.value } : c);
                    onCreditCardsChange(updated);
                  }}
                  className="text-[10px] text-foreground bg-transparent border-0 outline-none cursor-pointer p-0"
                />
              </div>
            </div>
            {/* Utilization bar */}
            <div className="w-1.5 h-10 bg-muted rounded-full overflow-hidden self-center shrink-0">
              <div
                className="w-full rounded-full transition-all"
                style={{
                  height: `${Math.min(100, (card.balance_owed / card.credit_limit) * 100)}%`,
                  backgroundColor: card.balance_owed / card.credit_limit > 0.8 ? "#ef4444" : card.balance_owed / card.credit_limit > 0.5 ? "#f59e0b" : "#10b981"
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}