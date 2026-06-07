import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer
} from "recharts";
import { format, addDays, isAfter, startOfDay, startOfMonth, endOfMonth, addMonths, eachMonthOfInterval } from "date-fns";
import { mockCreditCards } from "@/lib/mockData";

const fmtCur = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

// ── Daily projection ──────────────────────────────────────────────────────────
function buildDailyProjection(expectedTransactions, startDate, endDate, currentCashBalance, creditCards, hiddenIds) {
  const cards = creditCards || mockCreditCards;
  const days = [];
  let current = startOfDay(new Date(startDate));
  const end = startOfDay(new Date(endDate));

  let cashBalance = currentCashBalance;
  let ccBalances = {};
  cards.forEach(card => { ccBalances[card.name] = card.balance_owed; });

  const eventsByDate = {};
  (expectedTransactions || []).forEach(t => {
    if (t.status === "cleared" || t.status === "paid") return;
    if (hiddenIds?.has(t.id)) return;
    if (!eventsByDate[t.edate]) eventsByDate[t.edate] = [];
    eventsByDate[t.edate].push(t);
  });
  cards.forEach(card => {
    if (card.payment_due_date) {
      if (!eventsByDate[card.payment_due_date]) eventsByDate[card.payment_due_date] = [];
      eventsByDate[card.payment_due_date].push({
        id: `cc_pay_${card.id}`, description: `${card.name} Payment`,
        amount: -(card.expected_payment_amount || card.balance_owed),
        payment_method: "bank", isCardPayment: true, cardName: card.name,
      });
    }
  });

  while (!isAfter(current, end)) {
    const dateKey = format(current, "yyyy-MM-dd");
    const events = eventsByDate[dateKey] || [];
    events.forEach(evt => {
      if (evt.payment_method === "cc" && !evt.isCardPayment) {
        const cardName = evt.payment_source || cards[0]?.name;
        ccBalances[cardName] = (ccBalances[cardName] || 0) + Math.abs(evt.amount);
      } else {
        cashBalance += evt.amount;
        if (evt.isCardPayment) ccBalances[evt.cardName] = 0;
      }
    });
    const totalCCOwed = Object.values(ccBalances).reduce((s, v) => s + Math.max(0, v), 0);
    days.push({
      date: dateKey,
      label: format(current, "MMM d"),
      cash: Math.round(cashBalance),
      ccOwed: Math.round(totalCCOwed),
      events: events.map(e => e.description),
    });
    current = addDays(current, 1);
  }
  return days;
}

// ── Monthly projection ────────────────────────────────────────────────────────
function buildMonthlyProjection(expectedTransactions, startDate, endDate, currentCashBalance, creditCards, hiddenIds) {
  const cards = creditCards || mockCreditCards;
  const months = eachMonthOfInterval({ start: new Date(startDate), end: new Date(endDate) });

  let cashBalance = currentCashBalance;
  let ccBalances = {};
  cards.forEach(card => { ccBalances[card.name] = card.balance_owed; });

  const txns = (expectedTransactions || []).filter(t =>
    t.status !== "cleared" && t.status !== "paid" && !hiddenIds?.has(t.id)
  );

  return months.map(monthStart => {
    const mEnd = endOfMonth(monthStart);
    const label = format(monthStart, "MMM yyyy");

    let income = 0, expenses = 0, ccPayments = 0;
    const catBreakdown = {};

    // Regular expected transactions in this month
    txns.forEach(t => {
      const d = new Date(t.edate);
      if (d >= monthStart && d <= mEnd) {
        if (t.payment_method === "cc" && !t.isCardPayment) {
          const cardName = t.payment_source || cards[0]?.name;
          ccBalances[cardName] = (ccBalances[cardName] || 0) + Math.abs(t.amount);
        } else {
          cashBalance += t.amount;
          if (t.amount > 0) income += t.amount;
          else expenses += Math.abs(t.amount);
        }
        const cat = t.category || "Other";
        catBreakdown[cat] = (catBreakdown[cat] || 0) + t.amount;
      }
    });

    // CC payments due this month
    cards.forEach(card => {
      if (card.payment_due_date) {
        const d = new Date(card.payment_due_date);
        if (d >= monthStart && d <= mEnd) {
          const amt = card.expected_payment_amount || card.balance_owed;
          cashBalance -= amt;
          ccPayments += amt;
          expenses += amt;
          ccBalances[card.name] = 0;
        }
      }
    });

    const totalCCOwed = Object.values(ccBalances).reduce((s, v) => s + Math.max(0, v), 0);

    return {
      label,
      cash: Math.round(cashBalance),
      income: Math.round(income),
      expenses: Math.round(expenses),
      ccPayments: Math.round(ccPayments),
      ccOwed: Math.round(totalCCOwed),
      catBreakdown,
    };
  });
}

// ── Tooltips ──────────────────────────────────────────────────────────────────
const DailyTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-card border border-border rounded-lg shadow-xl p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-foreground mb-1.5">{d?.date ? format(new Date(d.date), "MMMM d, yyyy") : d?.label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-6">
          <span className="text-muted-foreground">Cash Balance</span>
          <span className={`font-semibold tabular-nums ${d.cash < 0 ? "text-red-600" : "text-emerald-600"}`}>{fmtCur(d.cash)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-muted-foreground">CC Owed</span>
          <span className="font-semibold tabular-nums">{fmtCur(d.ccOwed)}</span>
        </div>
        {d.events?.length > 0 && (
          <div className="pt-1 border-t border-border mt-1 space-y-0.5">
            {d.events.map((e, i) => <p key={i} className="text-muted-foreground">{e}</p>)}
          </div>
        )}
      </div>
    </div>
  );
};

const MonthlyTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const cats = Object.entries(d.catBreakdown || {}).sort((a, b) => a[1] - b[1]);
  return (
    <div className="bg-card border border-border rounded-lg shadow-xl p-3 text-xs min-w-[210px]">
      <p className="font-semibold text-foreground mb-2">{d.label}</p>
      <div className="space-y-1 mb-2">
        <div className="flex justify-between gap-6">
          <span className="text-muted-foreground">EOM Cash Balance</span>
          <span className={`font-bold tabular-nums ${d.cash < 0 ? "text-red-600" : "text-emerald-600"}`}>{fmtCur(d.cash)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-emerald-600">↑ Income</span>
          <span className="font-semibold tabular-nums text-emerald-600">{fmtCur(d.income)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-red-500">↓ Expenses</span>
          <span className="font-semibold tabular-nums text-red-500">{fmtCur(d.expenses)}</span>
        </div>
        {d.ccPayments > 0 && (
          <div className="flex justify-between gap-4">
            <span className="text-blue-500">CC Repayments</span>
            <span className="font-semibold tabular-nums text-blue-500">{fmtCur(d.ccPayments)}</span>
          </div>
        )}
      </div>
      {cats.length > 0 && (
        <div className="border-t border-border pt-1.5 space-y-0.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">By Category</p>
          {cats.map(([cat, amt]) => (
            <div key={cat} className="flex justify-between gap-4">
              <span className="text-muted-foreground truncate max-w-[110px]">{cat}</span>
              <span className={`tabular-nums font-medium ${amt >= 0 ? "text-emerald-600" : "text-red-500"}`}>{fmtCur(amt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const TIME_PRESETS = [
  { label: "30d", days: 30 },
  { label: "3mo", days: 90 },
  { label: "6mo", days: 180 },
  { label: "9mo", days: 270 },
  { label: "1yr", days: 365 },
];

export default function CashProjectionChart({ expectedTransactions, currentCashBalance, creditCards, hiddenIds, timePreset, onTimePresetChange, cadence, onCadenceChange }) {
  const startDate = format(new Date(), "yyyy-MM-dd");
  const endDate = format(addDays(new Date(), timePreset || 90), "yyyy-MM-dd");

  const dailyData = useMemo(() =>
    cadence === "monthly" ? [] : buildDailyProjection(expectedTransactions, startDate, endDate, currentCashBalance, creditCards, hiddenIds),
    [expectedTransactions, startDate, endDate, currentCashBalance, creditCards, hiddenIds, cadence]
  );

  const monthlyData = useMemo(() =>
    cadence === "monthly" ? buildMonthlyProjection(expectedTransactions, startDate, endDate, currentCashBalance, creditCards, hiddenIds) : [],
    [expectedTransactions, startDate, endDate, currentCashBalance, creditCards, hiddenIds, cadence]
  );

  const data = cadence === "monthly" ? monthlyData : dailyData;
  const totalPoints = data.length;
  const tickInterval = cadence === "daily" ? (totalPoints > 60 ? Math.floor(totalPoints / 8) : totalPoints > 30 ? 7 : 3) : 0;

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {/* Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Time presets */}
        <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
          {TIME_PRESETS.map(p => (
            <button
              key={p.days}
              onClick={() => onTimePresetChange(p.days)}
              className={`px-2.5 py-1 text-[10px] font-medium rounded transition-colors ${timePreset === p.days ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {/* Cadence */}
        <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
          {["daily", "monthly"].map(c => (
            <button
              key={c}
              onClick={() => onCadenceChange(c)}
              className={`px-2.5 py-1 text-[10px] font-medium rounded capitalize transition-colors ${cadence === c ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
          {cadence === "monthly" ? (
            <>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2.5 bg-emerald-500 rounded-sm" />
                <span>Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-2.5 bg-indigo-500 rounded-sm" />
                <span>Expenses</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-primary rounded" />
              <span>Cash Balance</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-px border-b border-dashed border-red-400" />
            <span>Zero</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {cadence === "monthly" ? (
            <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} tickLine={false} axisLine={false}
                tickFormatter={v => `$${Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} width={50} />
              <Tooltip content={<MonthlyTooltip />} />
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={36} />
              <Bar dataKey="expenses" name="Expenses" fill="#6366f1" radius={[3, 3, 0, 0]} maxBarSize={36} />
            </BarChart>
          ) : (
            <AreaChart data={dailyData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(237, 72%, 65%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(237, 72%, 65%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} tickLine={false} axisLine={false} interval={tickInterval} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} tickLine={false} axisLine={false}
                tickFormatter={v => `$${Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} width={50} />
              <Tooltip content={<DailyTooltip />} />
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
              <Area type="monotone" dataKey="cash" stroke="hsl(237, 72%, 65%)" strokeWidth={2}
                fill="url(#cashGradient)" dot={false} activeDot={{ r: 4, fill: "hsl(237, 72%, 65%)" }} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}