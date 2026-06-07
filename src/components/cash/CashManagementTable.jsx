import { useMemo } from "react";
import { format, addDays, startOfDay, isAfter } from "date-fns";
import { mockCreditCards } from "@/lib/mockData";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function CashManagementTable({ expectedTransactions, currentCashBalance, creditCards }) {
  const cards = creditCards || mockCreditCards;

  const projection = useMemo(() => {
    const today = startOfDay(new Date());
    const end = addDays(today, 90);

    let cashBalance = currentCashBalance || 322968;
    let ccBalances = {};
    cards.forEach(card => { ccBalances[card.name] = card.balance_owed; });

    const rows = [];

    // Start row
    rows.push({
      date: format(today, "yyyy-MM-dd"),
      description: "Current Balance",
      amount: null,
      method: "—",
      status: "actual",
      cashBalance,
      ccTotal: Object.values(ccBalances).reduce((s, v) => s + v, 0),
    });

    // Collect all events
    const events = [];
    (expectedTransactions || []).filter(t => t.status !== "paid" && t.status !== "cleared").forEach(t => {
      const d = new Date(t.edate);
      if (!isAfter(d, end)) {
        events.push({ ...t, _date: d });
      }
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
            payment_source: "Mercury",
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
      if (evt.payment_method === "cc" && !evt.isCardPayment) {
        const cardName = evt.payment_source || cards[0]?.name;
        ccBalances[cardName] = (ccBalances[cardName] || 0) + Math.abs(evt.amount);
      } else {
        cashBalance += evt.amount;
        if (evt.isCardPayment) ccBalances[evt.cardName] = 0;
      }

      const ccTotal = Object.values(ccBalances).reduce((s, v) => s + Math.max(0, v), 0);

      rows.push({
        date: format(evt._date, "yyyy-MM-dd"),
        description: evt.description,
        amount: evt.amount,
        method: evt.payment_method === "cc" ? "CC" : "Bank",
        status: evt.status,
        cashBalance: Math.round(cashBalance),
        ccTotal: Math.round(ccTotal),
      });
    });

    return rows;
  }, [expectedTransactions, currentCashBalance, creditCards]);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h3 className="text-sm font-semibold text-foreground">Cash Management Projection</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">90-day rolling forecast</p>
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
            </tr>
          </thead>
          <tbody>
            {projection.map((row, i) => {
              const isNegative = row.cashBalance < 0;
              const isFirst = i === 0;

              return (
                <tr
                  key={`${row.date}-${i}`}
                  className={`border-b border-border text-xs transition-colors
                    ${isNegative ? "bg-red-50/40 hover:bg-red-50/60" : "hover:bg-muted/30"}
                    ${isFirst ? "font-semibold bg-muted/30" : ""}
                  `}
                >
                  <td className="px-3 py-2 text-muted-foreground tabular-nums whitespace-nowrap">
                    {format(new Date(row.date), "MM/dd")}
                  </td>
                  <td className="px-3 py-2 max-w-[140px]">
                    <span className="truncate block text-foreground">{row.description}</span>
                  </td>
                  <td className="px-3 py-2">
                    {row.method !== "—" && (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border ${row.method === "CC" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-700 border-slate-200"}`}>
                        {row.method}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {row.amount !== null && (
                      <span className={row.amount >= 0 ? "text-emerald-600 font-medium" : "text-foreground"}>
                        {row.amount >= 0 ? "+" : ""}
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(row.amount)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-foreground">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(row.ccTotal)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums font-semibold">
                    <span className={isNegative ? "text-red-600" : "text-foreground"}>
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(row.cashBalance)}
                    </span>
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