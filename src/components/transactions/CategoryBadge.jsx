const CATEGORY_COLORS = {
  "Payroll": "bg-violet-50 text-violet-700 border-violet-200",
  "Rent & Facilities": "bg-orange-50 text-orange-700 border-orange-200",
  "Software & Subscriptions": "bg-blue-50 text-blue-700 border-blue-200",
  "Travel": "bg-sky-50 text-sky-700 border-sky-200",
  "Meals & Entertainment": "bg-amber-50 text-amber-700 border-amber-200",
  "Utilities": "bg-slate-50 text-slate-600 border-slate-200",
  "Professional Services": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Marketing & Advertising": "bg-pink-50 text-pink-700 border-pink-200",
  "Equipment & Hardware": "bg-zinc-50 text-zinc-700 border-zinc-200",
  "Taxes & Compliance": "bg-red-50 text-red-700 border-red-200",
  "Insurance": "bg-teal-50 text-teal-700 border-teal-200",
  "Shipping & Logistics": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Client Revenue": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Other Income": "bg-green-50 text-green-700 border-green-200",
  "Other Expense": "bg-gray-50 text-gray-600 border-gray-200",
};

export default function CategoryBadge({ category }) {
  if (!category) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs border bg-muted text-muted-foreground border-border">
        Uncategorized
      </span>
    );
  }

  const colorClass = CATEGORY_COLORS[category] || "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium ${colorClass}`}>
      {category}
    </span>
  );
}