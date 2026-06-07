import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart } from "recharts";
import { format, addDays, isAfter, isBefore, startOfDay } from "date-fns";
import { mockCreditCards } from "@/lib/mockData";

function buildProjection(expectedTransactions, startDate, endDate, currentCashBalance, creditCards) {
  const days = [];
  let current = startOfDay(new Date(startDate));
  const end = startOfDay(new Date(endDate));

  let cashBalance = currentCashBalance;
  let ccBalances = {};
  (creditCards || mockCreditCards).forEach(card => {
    ccBalances[card.name] = card.balance_owed;
  });

  // Build a map of events by date
  const eventsByDate = {};
  (expectedTransactions || []).forEach(t => {
    if (t.status === "cleared" || t.status === "paid") return;
    const dateKey = t.edate;
    if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];
    eventsByDate[dateKey].push(t);
  });

  // CC payments from cards
  (creditCards || mockCreditCards).forEach(card => {
    if (card.payment_due_date) {
      const dateKey = card.payment_due_date;
      if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];
      eventsByDate[dateKey].push({
        id: `cc_pay_${card.id}`,
        description: `${card.name} Payment`,
        amount: -(card.expected_payment_amount || card.balance_owed),
        payment_method: "bank",
        isCardPayment: true,
        cardName: card.name,
      });
    }
  });

  while (!isAfter(current, end)) {
    const dateKey = format(current, "yyyy-MM-dd");
    const events = eventsByDate[dateKey] || [];

    events.forEach(evt => {
      if (evt.payment_method === "cc" && !evt.isCardPayment) {
        // CC swipe: CC balance goes up (more owed), cash unchanged
        const cardName = evt.payment_source || "Amex Business Platinum";
        ccBalances[cardName] = (ccBalances[cardName] || 0) + Math.abs(evt.amount) * (evt.amount < 0 ? 1 : -1);
      } else {
        // Bank payment or CC bill payment: cash changes
        cashBalance += evt.amount;
        if (evt.isCardPayment) {
          ccBalances[evt.cardName] = 0;
        }
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="bg-card border border-border rounded-lg shadow-xl p-3 text-xs">
      <p className="font-semibold text-foreground mb-1.5">{data?.date ? format(new Date(data.date), "MMMM d, yyyy") : label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">Cash Balance</span>
          <span className={`font-semibold tabular-nums ${data.cash < 0 ? "text-red-600" : "text-emerald-600"}`}>
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data.cash)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">CC Owed</span>
          <span className="font-semibold tabular-nums text-foreground">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data.ccOwed)}
          </span>
        </div>
        {data.events?.length > 0 && (
          <div className="pt-1 border-t border-border mt-1">
            {data.events.map((e, i) => <p key={i} className="text-muted-foreground">{e}</p>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default function CashProjectionChart({ expectedTransactions, startDate, endDate, currentCashBalance, creditCards }) {
  const data = useMemo(() =>
    buildProjection(expectedTransactions, startDate, endDate, currentCashBalance, creditCards),
    [expectedTransactions, startDate, endDate, currentCashBalance, creditCards]
  );

  const minCash = Math.min(...data.map(d => d.cash));
  const maxCash = Math.max(...data.map(d => d.cash));
  const hasNegative = minCash < 0;

  // Show every Nth label based on date range length
  const totalDays = data.length;
  const tickInterval = totalDays > 60 ? Math.floor(totalDays / 8) : totalDays > 30 ? 7 : 3;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(237, 72%, 65%)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="hsl(237, 72%, 65%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="negGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }}
            tickLine={false}
            axisLine={false}
            interval={tickInterval}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `$${Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
          <Area
            type="monotone"
            dataKey="cash"
            stroke="hsl(237, 72%, 65%)"
            strokeWidth={2}
            fill="url(#cashGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "hsl(237, 72%, 65%)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}