import { useState, useMemo } from "react";
import { format, addDays } from "date-fns";
import CashProjectionChart from "@/components/cash/CashProjectionChart";
import CreditCardSummary from "@/components/cash/CreditCardSummary";
import ExpectedTransactionsTable from "@/components/cash/ExpectedTransactionsTable";
import CashManagementTable from "@/components/cash/CashManagementTable";
import { mockExpectedTransactions, mockCreditCards } from "@/lib/mockData";
import { DollarSign, TrendingDown, AlertTriangle, Calendar } from "lucide-react";

const CURRENT_CASH = 322968;

export default function Cash() {
  const [expectedTransactions, setExpectedTransactions] = useState(mockExpectedTransactions);
  const [creditCards] = useState(mockCreditCards);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 90), "yyyy-MM-dd"));
  const [currentCash, setCurrentCash] = useState(CURRENT_CASH);

  const lowestProjected = useMemo(() => {
    // Simple scan of projection min
    let bal = currentCash;
    let min = bal;
    const sorted = [...expectedTransactions]
      .filter(t => t.status !== "paid" && t.status !== "cleared" && t.payment_method === "bank")
      .sort((a, b) => new Date(a.edate) - new Date(b.edate));
    sorted.forEach(t => {
      bal += t.amount;
      if (bal < min) min = bal;
    });
    return min;
  }, [expectedTransactions, currentCash]);

  const pendingExpected = expectedTransactions.filter(t => t.status === "pending").length;
  const totalCCOwed = creditCards.reduce((s, c) => s + c.balance_owed, 0);

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
      {/* Summary strip */}
      <div className="bg-card border-b border-border px-6 py-3 flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Cash Balance</p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground text-sm">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(currentCash)}
              </span>
              <button className="text-[10px] text-primary hover:underline" onClick={() => {
                const v = prompt("Enter current cash balance:", currentCash);
                if (v && !isNaN(parseFloat(v))) setCurrentCash(parseFloat(v));
              }}>Edit</button>
            </div>
          </div>
        </div>

        <div className="w-px h-10 bg-border" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">CC Owed</p>
            <span className="font-bold text-foreground text-sm">
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalCCOwed)}
            </span>
          </div>
        </div>

        <div className="w-px h-10 bg-border" />

        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lowestProjected < 0 ? "bg-red-50" : "bg-amber-50"}`}>
            <AlertTriangle className={`w-4 h-4 ${lowestProjected < 0 ? "text-red-500" : "text-amber-500"}`} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Lowest Projected (90d)</p>
            <span className={`font-bold text-sm ${lowestProjected < 0 ? "text-red-600" : "text-foreground"}`}>
              {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(lowestProjected)}
            </span>
          </div>
        </div>

        <div className="w-px h-10 bg-border" />

        {/* Date range for chart */}
        <div className="flex items-center gap-2 ml-auto">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Chart range:</span>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="text-xs border border-border rounded px-2 py-1 bg-muted outline-none focus:ring-1 focus:ring-primary/30"
          />
          <span className="text-xs text-muted-foreground">→</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="text-xs border border-border rounded px-2 py-1 bg-muted outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Main content: chart + left panel */}
      <div className="flex-1 overflow-hidden flex flex-col p-4 gap-4">

        {/* Chart */}
        <div className="bg-card border border-border rounded-xl p-4 shrink-0" style={{ height: "220px" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Cash Flow Projection</h3>
              <p className="text-xs text-muted-foreground">Projected bank balance over time</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-primary rounded" />
                <span>Cash Balance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-red-400 border-dashed border-b border-red-400" />
                <span>Zero Line</span>
              </div>
            </div>
          </div>
          <div className="h-[140px]">
            <CashProjectionChart
              expectedTransactions={expectedTransactions}
              startDate={startDate}
              endDate={endDate}
              currentCashBalance={currentCash}
              creditCards={creditCards}
            />
          </div>
        </div>

        {/* Bottom row: CC summary + Cash mgmt table | Expected transactions */}
        <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
          {/* Left: CC Summary + Cash Management */}
          <div className="w-[380px] flex flex-col gap-4 shrink-0 overflow-auto">
            <CreditCardSummary creditCards={creditCards} />
            <div className="flex-1 min-h-0 overflow-hidden">
              <CashManagementTable
                expectedTransactions={expectedTransactions}
                currentCashBalance={currentCash}
                creditCards={creditCards}
              />
            </div>
          </div>

          {/* Right: Expected Transactions */}
          <div className="flex-1 overflow-hidden">
            <ExpectedTransactionsTable onDataChange={setExpectedTransactions} />
          </div>
        </div>
      </div>
    </div>
  );
}