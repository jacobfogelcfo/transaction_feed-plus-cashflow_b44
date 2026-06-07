const STATUS_CONFIG = {
  cleared: { label: "Cleared", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending", class: "bg-amber-50 text-amber-700 border-amber-200" },
  needs_review: { label: "Needs Review", class: "bg-red-50 text-red-600 border-red-200" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-medium ${config.class}`}>
      {config.label}
    </span>
  );
}