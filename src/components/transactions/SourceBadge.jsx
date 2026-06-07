import { SOURCE_LOGOS } from "@/lib/mockData";
import { Wifi, Link2, PenLine } from "lucide-react";

const CONNECTION_ICONS = {
  plaid: { icon: Wifi, label: "Plaid", color: "text-blue-500" },
  direct: { icon: Link2, label: "Direct", color: "text-green-500" },
  manual: { icon: PenLine, label: "Manual", color: "text-amber-500" },
};

export default function SourceBadge({ sourceName, sourceType, connectionMethod }) {
  const logoUrl = SOURCE_LOGOS[sourceName];
  const conn = CONNECTION_ICONS[connectionMethod] || CONNECTION_ICONS.manual;
  const ConnIcon = conn.icon;

  return (
    <div className="flex items-center gap-2">
      {logoUrl ? (
        <div className="w-6 h-6 rounded border border-border bg-white flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={logoUrl}
            alt={sourceName}
            className="w-full h-full object-contain p-0.5"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      ) : (
        <div className="w-6 h-6 rounded border border-border bg-muted flex items-center justify-center shrink-0">
          <span className="text-[8px] font-bold text-muted-foreground">{sourceName?.slice(0,2)?.toUpperCase()}</span>
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium text-foreground truncate leading-tight">{sourceName}</span>
        <div className="flex items-center gap-1">
          <ConnIcon className={`w-2.5 h-2.5 ${conn.color}`} />
          <span className="text-[10px] text-muted-foreground">{conn.label}</span>
        </div>
      </div>
    </div>
  );
}