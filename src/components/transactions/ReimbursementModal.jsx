import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ReimbursementModal({ transaction, onClose, onSave }) {
  const [owedBy, setOwedBy] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");

  if (!transaction) return null;

  const handleSave = () => {
    if (!owedBy.trim()) return;
    onSave({
      transaction_id: transaction.id,
      transaction_vendor: transaction.vendor_name,
      transaction_amount: transaction.amount,
      transaction_date: transaction.date,
      owed_by: owedBy,
      expected_date: expectedDate || null,
      status: "pending",
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="font-semibold text-foreground">Mark as Reimbursement</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {transaction.vendor_name} · {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(transaction.amount))}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <Label className="text-xs font-medium text-foreground mb-1.5 block">Who will reimburse? *</Label>
            <Input
              placeholder="Client or vendor name..."
              value={owedBy}
              onChange={e => setOwedBy(e.target.value)}
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-foreground mb-1.5 block">Expected reimbursement date</Label>
            <Input
              type="date"
              value={expectedDate}
              onChange={e => setExpectedDate(e.target.value)}
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs font-medium text-foreground mb-1.5 block">Notes</Label>
            <Textarea
              placeholder="Add context..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="text-sm resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-5 pt-0">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={!owedBy.trim()} className="bg-primary text-primary-foreground">
            Save Reimbursement
          </Button>
        </div>
      </div>
    </div>
  );
}