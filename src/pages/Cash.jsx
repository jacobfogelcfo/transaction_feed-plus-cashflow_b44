import { useState, useMemo } from "react";
import { format, addDays } from "date-fns";
import CashProjectionChart from "@/components/cash/CashProjectionChart";
import CashManagementTable from "@/components/cash/CashManagementTable";
import AccountSummaryBar from "@/components/cash/AccountSummaryBar";
import ExpectedProjectionsPanel from "@/components/cash/ExpectedProjectionsPanel";
import { mockExpectedTransactions, mockCreditCards } from "@/lib/mockData";

const CURRENT_CASH = 322968;

export default function Cash() {
  const [expectedTransactions, setExpectedTransactions] = useState(mockExpectedTransactions);
  const [creditCards, setCreditCards] = useState(mockCreditCards);
  const [currentCash, setCurrentCash] = useState(CURRENT_CASH);
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [timePreset, setTimePreset] = useState(90);
  const [cadence, setCadence] = useState("daily");

  return (
    <div className="flex flex-col overflow-hidden h-full">
      {/* Page title */}
      <div className="px-6 py-3 border-b border-border bg-card shrink-0 flex items-center gap-3">
        <h1 className="text-lg font-bold text-foreground">Cash & Projections</h1>
      </div>

      {/* Account summary bar */}
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
          <div className="bg-card border-b border-border px-4 pt-3 pb-2 shrink-0" style={{ height: "220px" }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Cash Flow Projection</h3>
                <p className="text-[10px] text-muted-foreground">Projected bank balance</p>
              </div>
            </div>
            <div style={{ height: "155px" }}>
              <CashProjectionChart
                expectedTransactions={expectedTransactions}
                currentCashBalance={currentCash}
                creditCards={creditCards}
                hiddenIds={hiddenIds}
                timePreset={timePreset}
                onTimePresetChange={setTimePreset}
                cadence={cadence}
                onCadenceChange={setCadence}
              />
            </div>
          </div>

          {/* Cash management projection table */}
          <div className="flex-1 overflow-hidden">
            <CashManagementTable
              expectedTransactions={expectedTransactions}
              currentCashBalance={currentCash}
              creditCards={creditCards}
              onHiddenIdsChange={setHiddenIds}
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