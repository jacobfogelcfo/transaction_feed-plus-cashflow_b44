import { useState } from "react";
import { Pencil } from "lucide-react";
import { format } from "date-fns";

const fmt = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

function InstitutionLogo({ logo, name, size = 28 }) {
  const [failed, setFailed] = useState(false);
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  if (logo && !failed) {
    return (
      <div className="rounded-md border border-border bg-white flex items-center justify-center overflow-hidden shrink-0" style={{ width: size, height: size }}>
        <img src={logo} alt={name} className="w-full h-full object-contain p-0.5" onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div className="rounded-md bg-muted flex items-center justify-center shrink-0 text-[10px] font-bold text-muted-foreground" style={{ width: size, height: size }}>
      {initials}
    </div>
  );
}

function EditableBalance({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  if (editing) {
    return (
      <input
        autoFocus type="text" defaultValue={value}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { onChange(parseFloat(draft.replace(/[^0-9.-]/g, "")) || value); setEditing(false); }}
        onKeyDown={e => { if (e.key === "Enter") { onChange(parseFloat(draft.replace(/[^0-9.-]/g, "")) || value); setEditing(false); } }}
        className="w-20 text-xs font-bold bg-muted rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-primary/40 tabular-nums"
      />
    );
  }
  return (
    <button onClick={() => { setDraft(String(value)); setEditing(true); }} className="flex items-center gap-0.5 group">
      <span className="text-xs font-bold text-foreground tabular-nums">{fmt(value)}</span>
      <Pencil className="w-2 h-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

export default function AccountSummaryBar({ bankAccounts, onBankAccountsChange, creditCards, onCreditCardsChange }) {
  const totalBank = bankAccounts.flatMap(b => b.subAccounts).reduce((s, a) => s + a.balance, 0);
  const totalCCOwed = creditCards.reduce((s, c) => s + c.balance_owed, 0);

  const updateSubBalance = (bankId, subId, val) => {
    onBankAccountsChange(bankAccounts.map(b =>
      b.id === bankId ? { ...b, subAccounts: b.subAccounts.map(s => s.id === subId ? { ...s, balance: val } : s) } : b
    ));
  };

  const updateCard = (id, patch) => {
    onCreditCardsChange(creditCards.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  return (
    <div className="bg-card flex flex-col shrink-0 divide-y divide-border">

      {/* ── BANK ACCOUNTS SECTION ── */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Bank Accounts</p>
            <p className="text-xs font-bold text-emerald-600 tabular-nums">{fmt(totalBank)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {bankAccounts.map(bank => (
            <div key={bank.id} className="flex items-start gap-2">
              <InstitutionLogo logo={bank.logo} name={bank.institution} size={26} />
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold text-foreground">{bank.institution}</p>
                {bank.subAccounts.map(sub => (
                  <div key={sub.id} className="flex items-center gap-1.5">
                    <span className="text-[9px] text-muted-foreground w-12 truncate">{sub.label}</span>
                    <EditableBalance value={sub.balance} onChange={val => updateSubBalance(bank.id, sub.id, val)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CREDIT CARDS SECTION ── */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Credit Cards</p>
            <p className="text-xs font-bold text-red-500 tabular-nums">{fmt(totalCCOwed)} owed</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {creditCards.map(card => {
            const utilPct = Math.min(100, (card.balance_owed / card.credit_limit) * 100);
            const utilColor = utilPct > 80 ? "#ef4444" : utilPct > 50 ? "#f59e0b" : "#10b981";
            return (
              <div key={card.id} className="flex items-start gap-2">
                <InstitutionLogo logo={card.logo} name={card.institution} size={26} />
                <div className="flex flex-col gap-0.5">
                  <p className="text-[10px] font-semibold text-foreground truncate max-w-[90px]">{card.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold tabular-nums" style={{ color: utilColor }}>{fmt(card.balance_owed)}</span>
                    <span className="text-[9px] text-muted-foreground">/ {fmt(card.credit_limit)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">Due</span>
                    <input
                      type="date"
                      value={card.payment_due_date || ""}
                      onChange={e => updateCard(card.id, { payment_due_date: e.target.value })}
                      className="text-[9px] text-foreground bg-transparent border-0 outline-none cursor-pointer p-0"
                    />
                  </div>
                </div>
                {/* Utilization bar */}
                <div className="w-1.5 h-9 bg-muted rounded-full overflow-hidden self-center shrink-0">
                  <div className="w-full rounded-full transition-all" style={{ height: `${utilPct}%`, backgroundColor: utilColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}