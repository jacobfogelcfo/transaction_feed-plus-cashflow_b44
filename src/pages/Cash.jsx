import { useState, useMemo } from "react";
import { format, addDays } from "date-fns";
import CashProjectionChart from "@/components/cash/CashProjectionChart";
import CashManagementTable from "@/components/cash/CashManagementTable";
import AccountSummaryBar from "@/components/cash/AccountSummaryBar";
import ExpectedProjectionsPanel from "@/components/cash/ExpectedProjectionsPanel";
import { mockExpectedTransactions, mockCreditCards } from "@/lib/mockData";
import { Calendar } from "lucide-react";

const CURRENT_CASH = 322968;

export default function Cash() {
  const [expectedTransactions, setExpectedTransactions] = useState(mockExpectedTransactions);
  const [creditCards, setCreditCards] = useState(mockCreditCards);
  const [currentCash, setCurrentCash] = useState(CURRENT_CASH);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 90), "yyyy-MM-dd"));

  return (
    <div className="flex flex-col overflow-hidden h-full">
      {/* Top summary bar: bank + credit cards */}
      <AccountSummaryBar
        creditCards={creditCards}
        onCreditCardsChange={setCreditCards}
        bankBalance={currentCash}
        onBankBalanceChange={setCurrentCash}
      />

      {/* Main split: 2/3 left | 1/3 right */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Chart + Cash management table */}
        <div className="flex flex-col overflow-hidden border-r border-border" style={{ flex: "2 2 0%" }}>
          {/* Chart area */}
          <div className="bg-card border-b border-border p-4 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Cash Flow Projection</h3>
                <p className="text-xs text-muted-foreground">Projected bank balance over time</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
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
                <div className="flex items-center gap-3 text-xs text-muted-foreground ml-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 bg-primary rounded" />
                    <span>Cash</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-px bg-red-400 border-dashed border-b border-red-400" />
                    <span>Zero</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ height: "160px" }}>
              <CashProjectionChart
                expectedTransactions={expectedTransactions}
                startDate={startDate}
                endDate={endDate}
                currentCashBalance={currentCash}
                creditCards={creditCards}
              />
            </div>
          </div>

          {/* Cash management projection table */}
          <div className="flex-1 overflow-hidden">
            <CashManagementTable
              expectedTransactions={expectedTransactions}
              currentCashBalance={currentCash}
              creditCards={creditCards}
            />
          </div>
        </div>

        {/* RIGHT: Expected Projections */}
        <div className="flex flex-col overflow-hidden bg-card" style={{ flex: "1 1 0%" }}>
          <ExpectedProjectionsPanel
            transactions={expectedTransactions}
            onChange={setExpectedTransactions}
          />
        </div>
      </div>
    </div>
  );
}