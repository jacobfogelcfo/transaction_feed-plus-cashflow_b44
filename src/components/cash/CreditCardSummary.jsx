import { CreditCard, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { mockCreditCards } from "@/lib/mockData";

export default function CreditCardSummary({ creditCards }) {
  const cards = creditCards || mockCreditCards;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Credit Cards</h3>
      </div>
      <div className="divide-y divide-border">
        {cards.map(card => {
          const utilization = Math.round((card.balance_owed / card.credit_limit) * 100);
          const remaining = card.credit_limit - card.balance_owed;

          return (
            <div key={card.id} className="px-4 py-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded" style={{ backgroundColor: card.color || "#374151" }} />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{card.name}</p>
                    {card.last_four && <p className="text-[10px] text-muted-foreground">••{card.last_four}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(card.balance_owed)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">of {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(card.credit_limit)}</p>
                </div>
              </div>

              {/* Utilization bar */}
              <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                <div
                  className={`h-1.5 rounded-full transition-all ${utilization > 80 ? "bg-red-500" : utilization > 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${utilization}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="text-emerald-600 font-medium">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(remaining)} remaining
                </span>
                {card.payment_due_date && (
                  <span>Due {format(new Date(card.payment_due_date), "MMM d")}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}