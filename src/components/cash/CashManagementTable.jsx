import { useMemo, useState } from "react";
import { format, addDays, startOfDay, isAfter } from "date-fns";
import { mockCreditCards } from "@/lib/mockData";
import { EyeOff, Eye } from "lucide-react";

const fmtCur = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

export default function CashManagementTable({ expectedTransactions, currentCashBalance, creditCards, onHiddenIdsChange }) {
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const cards = creditCards || mockCreditCards;

  const toggleHidden = (id) => {
    setHiddenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onHiddenIdsChange?.(next);
      return next;
    });
  };

  const projection = useMemo(() => {
    const today = startOfDay(new Date());
    const end = addDays(today, 90);

    let cashBalance = currentCashBalance || 322968;
    let ccBalances = {};
    cards.forEach(card => { ccBalances[card.name] = card.balance_owed; });

    const rows = [];
    rows.push({
      id: "__start__",
      date: format(today, "yyyy-MM-dd"),
      description: "Current Balance",
      amount: null,
      method: "—",
      status: "actual",
      cashBalance,
      ccTotal: Object.values(ccBalances).reduce((s, v) => s + v, 0),
      isStart: true,
    });

    const events = [];
    (expectedTransactions || []).filter(t => t.status !== "paid" && t.status !== "cleared").forEach(t => {
      const d = new Date(t.edate);
      if (!isAfter(d, end)) events.push({ ...t, _date: d });
    });
    cards.forEach(card => {
      if (card.payment_due_date) {
        const d = new Date(card.payment_due_date);
        if (!isAfter(d, end)) {
          events.push({
            id: `cc_pay_${card.id}`,
            description: `${card.name} Payment`,
            amount: -(card.expected_payment_amount || card.balance_owed),
            payment_method: "bank",
            status: "pending",
            isCardPayment: true,
            cardName: card.name,
            _date: d,
          });
        }
      }
    });
    events.sort((a, b) => a._date - b._date);

    events.forEach(evt => {
      const isHidden = hiddenIds.has(evt.id);
      if (!isHidden) {
        if (evt.payment_method === "cc" && !evt.isCardPayment) {
          const cardName = evt.payment_source || cards[0]?.name;
          ccBalances[cardName] = (ccBalances[cardName] || 0) + Math.abs(evt.amount);
        } else {
          cashBalance += evt.amount;
          if (evt.isCardPayment) ccBalances[evt.cardName] = 0;
        }
      }

      const ccTotal = Object.values(ccBalances).reduce((s, v) => s + Math.max(0, v), 0);
      rows.push({
        id: evt.id,
        date: format(evt._date, "yyyy-MM-dd"),
        description: evt.description,
        amount: evt.amount,
        method: evt.payment_method === "cc" ? "CC" : "Bank",
        status: evt.status,
        cashBalance: Math.round(cashBalance),
        ccTotal: Math.round(ccTotal),
        isHidden,
        isCardPayment: evt.isCardPayment,
      });
    });

    return rows;
  }, [expectedTransactions, currentCashBalance, creditCards, hiddenIds]);

  return (
    <div className="bg-card flex flex-col h-full">
      <div className="px-4 py-2.5 border-b border-border shrink-0 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Cash Management Projection</h3>
          <p className="text-[10px] text-muted-foreground">90-day rolling forecast · Click <EyeOff className="inline w-2.5 h-2.5" /> to model excluding a payment</p>
        </div>
        {hiddenIds.size > 0 && (
          <button
            onClick={() => { setHiddenIds(new Set()); onHiddenIdsChange?.(new Set()); }}
            className="text-[10px] text-primary hover:underline flex items-center gap-1"
          >
            <Eye className="w-3 h-3" /> Show all ({hiddenIds.size} hidden)
          </button>
        )}
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full">
          <thead className="sticky top-0 bg-muted/60 border-b border-border">
            <tr>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">Date</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">Description</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">Method</th>
              <th className="px-3 py-2 text-right text-[10px] font-medium text-muted-foreground">Amount</th>
              <th className="px-3 py-2 text-right text-[10px] font-medium text-muted-foreground">CC Owed</th>
              <th className="px-3 py-2 text-right text-[10px] font-medium text-muted-foreground">Cash Balance</th>
              <th className="px-2 py-2 w-8" />
            </tr>
          </thead>
          <tbody>
            {projection.map((row, i) => {
              const isNegative = row.cashBalance < 0;
              if (row.isStart) {
                return (
                  <tr key="start" className="border-b border-border bg-muted/30 font-semibold text-xs">
                    <td className="px-3 py-2 text-muted-foreground tabular-nums">{format(new Date(row.date), "MM/dd")}</td>
                    <td className="px-3 py-2 text-foreground" colSpan={4}>{row.description}</td>
                    <td className="px-3 py-2 text-right tabular-nums font-bold text-foreground">{fmtCur(row.cashBalance)}</td>
                    <td />
                  </tr>
                );
              }

              return (
                <tr
                  key={`${row.date}-${i}`}
                  className={`border-b border-border text-xs transition-colors group
                    ${row.isHidden ? "opacity-40 bg-slate-50 line-through-row" : isNegative ? "bg-red-50/40 hover:bg-red-50/60" : "hover:bg-muted/30"}
                  `}
                >
                  <td className={`px-3 py-2 tabular-nums whitespace-nowrap ${row.isHidden ? "text-muted-foreground line-through" : "text-muted-foreground"}`}>
                    {format(new Date(row.date), "MM/dd")}
                  </td>
                  <td className="px-3 py-2 max-w-[130px]">
                    <span className={`truncate block ${row.isHidden ? "text-muted-foreground line-through" : "text-foreground"}`}>{row.description}</span>
                    {row.isHidden && <span className="text-[9px] text-amber-600 font-medium">hidden from projection</span>}
                  </td>
                  <td className="px-3 py-2">
                    {row.method !== "—" && (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border ${row.isHidden ? "opacity-40" : ""} ${row.method === "CC" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-700 border-slate-200"}`}>
                        {row.method}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {row.amount !== null && (
                      <span className={`${row.isHidden ? "text-muted-foreground line-through" : row.amount >= 0 ? "text-emerald-600 font-medium" : "text-foreground"}`}>
                        {row.amount >= 0 ? "+" : ""}
                        {fmtCur(row.amount)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-foreground">{fmtCur(row.ccTotal)}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-semibold">
                    <span className={isNegative && !row.isHidden ? "text-red-600" : "text-foreground"}>{fmtCur(row.cashBalance)}</span>
                  </td>
                  <td className="px-2 py-2">
                    {!row.isCardPayment && (
                      <button
                        onClick={() => toggleHidden(row.id)}
                        title={row.isHidden ? "Show in projection" : "Hide from projection"}
                        className={`p-1 rounded transition-all ${row.isHidden ? "text-amber-500 opacity-100" : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-amber-500 hover:bg-amber-50"}`}
                      >
                        {row.isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}