import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  TrendingUp, TrendingDown, CreditCard, Landmark, AlertCircle,
  ExternalLink, Plus, Trash2, CheckCircle2, Clock, AlertTriangle
} from "lucide-react";
import { mockBankAccounts, mockCreditCards, mockTransactions, mockReimbursements } from "@/lib/mockData";

const fmt = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
const fmtFull = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

function StatCard({ icon: Icon, label, value, sub, iconColor, valueColor }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className={`text-lg font-bold tabular-nums ${valueColor || "text-foreground"}`}>{value}</p>
        {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function InstitutionLogo({ logo, name, size = 24 }) {
  const [failed, setFailed] = useState(false);
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  if (logo && !failed) {
    return (
      <div className="rounded border border-border bg-white flex items-center justify-center overflow-hidden shrink-0" style={{ width: size, height: size }}>
        <img src={logo} alt={name} className="w-full h-full object-contain p-0.5" onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div className="rounded bg-muted flex items-center justify-center shrink-0 text-[9px] font-bold text-muted-foreground" style={{ width: size, height: size }}>
      {initials}
    </div>
  );
}

// ── Notes & Links ─────────────────────────────────────────────────────────────
function NotesAndLinks() {
  const [notes, setNotes] = useState("Key contacts:\n• CFO: Sarah Chen (sarah@acmecorp.com)\n• AR contact: Mike Torres\n\nPayment terms: Net 30\nFiscal year end: December");
  const [links, setLinks] = useState([
    { id: 1, label: "Notion — Client Overview", url: "https://notion.so" },
    { id: 2, label: "Notion — Financial Procedures", url: "https://notion.so" },
  ]);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [addingLink, setAddingLink] = useState(false);

  const addLink = () => {
    if (!newLabel || !newUrl) return;
    setLinks(prev => [...prev, { id: Date.now(), label: newLabel, url: newUrl }]);
    setNewLabel(""); setNewUrl(""); setAddingLink(false);
  };

  const removeLink = (id) => setLinks(prev => prev.filter(l => l.id !== id));

  return (
    <div className="bg-card rounded-xl border border-border flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Notes</h3>
      </div>
      <div className="px-4 pt-3 pb-2">
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full text-xs text-foreground bg-muted/40 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary/30 resize-none border border-border/60"
          rows={5}
          placeholder="Add notes about this client..."
        />
      </div>

      {/* Links */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Wiki Links</p>
          <button onClick={() => setAddingLink(v => !v)} className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-1">
          {links.map(link => (
            <div key={link.id} className="flex items-center gap-2 group">
              <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
              <a href={link.url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex-1 truncate">{link.label}</a>
              <button onClick={() => removeLink(link.id)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-all">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        {addingLink && (
          <div className="mt-2 space-y-1.5">
            <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label..."
              className="w-full text-xs bg-card border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30" />
            <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://..."
              className="w-full text-xs bg-card border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30" />
            <div className="flex gap-1.5">
              <button onClick={addLink} className="text-[10px] bg-primary text-primary-foreground px-2.5 py-1 rounded">Save</button>
              <button onClick={() => setAddingLink(false)} className="text-[10px] text-muted-foreground px-1">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Upcoming payments ─────────────────────────────────────────────────────────
function UpcomingPayments({ creditCards }) {
  const upcoming = [...creditCards]
    .filter(c => c.payment_due_date)
    .sort((a, b) => new Date(a.payment_due_date) - new Date(b.payment_due_date));

  const today = new Date();

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Upcoming CC Payments</h3>
      </div>
      <div className="divide-y divide-border">
        {upcoming.map(card => {
          const daysLeft = Math.ceil((new Date(card.payment_due_date) - today) / (1000 * 60 * 60 * 24));
          const urgent = daysLeft <= 5;
          const warning = daysLeft <= 10 && daysLeft > 5;
          return (
            <div key={card.id} className="px-4 py-3 flex items-center gap-3">
              <InstitutionLogo logo={card.logo} name={card.institution} size={26} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{card.name}</p>
                <p className="text-[10px] text-muted-foreground">Due {format(new Date(card.payment_due_date), "MMM d")}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold tabular-nums text-foreground">{fmt(card.expected_payment_amount || card.balance_owed)}</p>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${urgent ? "bg-red-50 text-red-600" : warning ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-700"}`}>
                  {daysLeft <= 0 ? "Due today" : `${daysLeft}d`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const bankAccounts = mockBankAccounts;
  const creditCards = mockCreditCards;
  const transactions = mockTransactions;
  const reimbursements = mockReimbursements;

  const totalCash = useMemo(
    () => bankAccounts.flatMap(b => b.subAccounts).reduce((s, a) => s + a.balance, 0),
    [bankAccounts]
  );
  const totalCCOwed = useMemo(() => creditCards.reduce((s, c) => s + c.balance_owed, 0), [creditCards]);
  const totalCCLimit = useMemo(() => creditCards.reduce((s, c) => s + c.credit_limit, 0), [creditCards]);
  const ccUtilPct = Math.round((totalCCOwed / totalCCLimit) * 100);

  const thisMonth = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return transactions.filter(t => new Date(t.date) >= start);
  }, [transactions]);

  const mtdIncome = thisMonth.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const mtdExpenses = thisMonth.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
  const pendingReimb = reimbursements.filter(r => r.status === "pending").reduce((s, r) => s + Math.abs(r.transaction_amount), 0);

  const recentTx = useMemo(() => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 12), [transactions]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 border-b border-border bg-card shrink-0">
        <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
        <p className="text-[11px] text-muted-foreground">{format(new Date(), "MMMM yyyy")} snapshot</p>
      </div>

      <div className="flex-1 overflow-auto px-6 py-5 space-y-6">

        {/* ── KPI row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={Landmark} label="Total Cash on Hand" value={fmt(totalCash)}
            sub={`${bankAccounts.length} accounts`}
            iconColor="bg-emerald-100 text-emerald-700"
            valueColor="text-emerald-700"
          />
          <StatCard
            icon={CreditCard} label="CC Debt / Limit" value={`${fmt(totalCCOwed)}`}
            sub={`${ccUtilPct}% of ${fmt(totalCCLimit)} limit`}
            iconColor={ccUtilPct > 60 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}
            valueColor={ccUtilPct > 60 ? "text-red-600" : "text-foreground"}
          />
          <StatCard
            icon={TrendingUp} label="MTD Revenue" value={fmt(mtdIncome)}
            sub="This calendar month"
            iconColor="bg-primary/10 text-primary"
            valueColor="text-foreground"
          />
          <StatCard
            icon={TrendingDown} label="MTD Expenses" value={fmt(mtdExpenses)}
            sub={`Net ${mtdIncome - mtdExpenses >= 0 ? "+" : ""}${fmt(mtdIncome - mtdExpenses)}`}
            iconColor="bg-muted text-muted-foreground"
            valueColor="text-foreground"
          />
        </div>

        {/* ── Bank Accounts ── */}
        <div className="bg-card rounded-xl border border-border">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Bank Accounts</h3>
            <span className="text-xs font-bold text-emerald-600 tabular-nums">{fmt(totalCash)} total</span>
          </div>
          <div className="divide-y divide-border">
            {bankAccounts.flatMap(bank =>
              bank.subAccounts.map(sub => (
                <div key={sub.id} className="px-4 py-3 flex items-center gap-3">
                  <InstitutionLogo logo={bank.logo} name={bank.institution} size={28} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">{bank.institution}</p>
                    <p className="text-[10px] text-muted-foreground">{sub.label}</p>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-foreground">{fmt(sub.balance)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── CC + Upcoming + Notes row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Credit Cards */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Credit Cards</h3>
              <span className="text-xs font-bold text-red-500 tabular-nums">{fmt(totalCCOwed)} owed</span>
            </div>
            <div className="divide-y divide-border">
              {creditCards.map(card => {
                const utilPct = Math.min(100, (card.balance_owed / card.credit_limit) * 100);
                const utilColor = utilPct > 80 ? "#ef4444" : utilPct > 50 ? "#f59e0b" : "#10b981";
                return (
                  <div key={card.id} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <InstitutionLogo logo={card.logo} name={card.institution} size={22} />
                      <p className="text-xs font-medium text-foreground truncate flex-1">{card.name}</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span style={{ color: utilColor }} className="font-bold tabular-nums">{fmt(card.balance_owed)}</span>
                      <span className="text-muted-foreground">/ {fmt(card.credit_limit)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${utilPct}%`, backgroundColor: utilColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming CC Payments */}
          <UpcomingPayments creditCards={creditCards} />

          {/* Notes & Links */}
          <NotesAndLinks />
        </div>

        {/* ── Pending Reimbursements alert ── */}
        {pendingReimb > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800">
              <span className="font-semibold">{fmt(pendingReimb)}</span> in outstanding reimbursements from {reimbursements.filter(r => r.status === "pending").length} item{reimbursements.filter(r => r.status === "pending").length !== 1 ? "s" : ""}.
            </p>
          </div>
        )}

        {/* ── Recent Transactions ── */}
        <div className="bg-card rounded-xl border border-border">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
            <span className="text-[10px] text-muted-foreground">Last {recentTx.length} transactions</span>
          </div>
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted-foreground">Vendor</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted-foreground">Source</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-2 text-right text-[10px] font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map(tx => (
                  <tr key={tx.id} className="border-b border-border/60 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5 text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">
                      {format(new Date(tx.date), "MMM d")}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-medium text-foreground">{tx.vendor_name}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] text-muted-foreground">{tx.category || "—"}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${tx.source_type === "cc" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-700 border-slate-200"}`}>
                        {tx.source_name}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {tx.status === "cleared" && (
                        <span className="flex items-center gap-1 text-[9px] text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" /> Cleared
                        </span>
                      )}
                      {tx.status === "pending" && (
                        <span className="flex items-center gap-1 text-[9px] text-amber-600">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {tx.status === "needs_review" && (
                        <span className="flex items-center gap-1 text-[9px] text-red-600">
                          <AlertTriangle className="w-3 h-3" /> Review
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      <span className={`text-xs font-semibold ${tx.amount >= 0 ? "text-emerald-600" : "text-foreground"}`}>
                        {tx.amount >= 0 ? "+" : ""}{fmtFull(tx.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}