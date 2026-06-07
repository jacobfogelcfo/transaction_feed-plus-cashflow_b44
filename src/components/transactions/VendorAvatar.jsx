import { VENDOR_LOGOS } from "@/lib/mockData";

export default function VendorAvatar({ name, size = "sm" }) {
  const logoUrl = VENDOR_LOGOS[name];
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
  };

  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-green-100 text-green-700",
    "bg-orange-100 text-orange-700",
    "bg-rose-100 text-rose-700",
    "bg-teal-100 text-teal-700",
  ];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  if (logoUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden shrink-0`}>
        <img
          src={logoUrl}
          alt={name}
          className="w-full h-full object-contain p-0.5"
          onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-xs font-semibold">${initials}</span>`; }}
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-lg ${colors[colorIndex]} font-semibold flex items-center justify-center shrink-0`}>
      {initials}
    </div>
  );
}