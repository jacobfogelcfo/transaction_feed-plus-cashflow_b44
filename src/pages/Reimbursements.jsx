import { useState } from "react";
import { RefreshCw, DollarSign, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { mockReimbursements } from "@/lib/mockData";
import { differenceInDays, format } from "date-fns";
import { Button } from "@/components/ui/button";

function AgingBadge({ days }) {
  if (days < 30) return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">{days}d</span>;
  if (days < 60) return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">{days}d</span>;
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">{days}d</span>;
}

function AgingBar({ days }) {
  const pct = Math.min(100, (days / 90) * 100);
  const color = days < 30 ? "bg-emerald-500" : days < 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="w-16 bg-muted rounded-full h-1.5 mt-1">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Reimbursements() {
  const [reimbursements, setReimbursements] = useState(mockReimbursements);

  const today = new Date();

  const pending = reimbursements.filter(r => r.status === "pending");
  const received = reimbursements.filter(r => r.status === "received");
  const totalOutstanding = pending.reduce((s, r) => s + Math.abs(r.transaction_amount), 0);
  const maxDays = Math.max(0, ...pending.map(r => differenceInDays(today, new Date(r.transaction_date))));

  const handleMarkReceived = (id) => {
    setReimbursements(prev => prev.map(r =>
      r.id === id ? { ...r, status: "received", received_date: today.toISOString().split("T")[0] } : r
    ));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Summary bar */}
      <div className="bg-card border-b border-border px-6 py-4 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Outstanding</p>
              <p className="text-lg font-semibold text-foreground">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalOutstanding)}
              </p>
            </div>
          </div>

          <div className="w-px h-10 bg-border" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-semibold text-foreground">{pending.length}</p>
            </div>
          </div>

          <div className="w-px h-10 bg-border" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Longest Outstanding</p>
              <p className="text-lg font-semibold text-foreground">{maxDays} days</p>
            </div>
          </div>

          <div className="w-px h-10 bg-border" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Received</p>
              <p className="text-lg font-semibold text-foreground">{received.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-card border-b border-border">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Transaction</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Who Owes It</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Expected Date</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Days Outstanding</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reimbursements.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No reimbursements yet</p>
                    <p className="text-xs text-muted-foreground">Mark expenses as reimbursements from the Transaction Feed</p>
                  </div>
                </td>
              </tr>
            )}
            {[...reimbursements].sort((a, b) => {
              if (a.status === "received" && b.status !== "received") return 1;
              if (b.status === "received" && a.status !== "received") return -1;
              return new Date(a.transaction_date) - new Date(b.transaction_date);
            }).map(r => {
              const days = differenceInDays(today, new Date(r.transaction_date));
              const isReceived = r.status === "received";

              let rowBg = "";
              if (!isReceived) {
                rowBg = days >= 60 ? "bg-red-50/30" : days >= 30 ? "bg-amber-50/30" : "";
              }

              return (
                <tr key={r.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${rowBg} ${isReceived ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.transaction_vendor}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(r.transaction_date), "MMM d, yyyy")}</p>
                      {r.notes && <p className="text-xs text-muted-foreground mt-0.5 italic">{r.notes}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{r.owed_by}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      {r.expected_date ? format(new Date(r.expected_date), "MMM d, yyyy") : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!isReceived ? (
                      <div>
                        <AgingBadge days={days} />
                        <AgingBar days={days} />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Received {r.received_date ? format(new Date(r.received_date), "MMM d") : ""}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(r.transaction_amount))}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isReceived ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Received
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!isReceived && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkReceived(r.id)}
                        className="text-xs h-7"
                      >
                        Mark Received
                      </Button>
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