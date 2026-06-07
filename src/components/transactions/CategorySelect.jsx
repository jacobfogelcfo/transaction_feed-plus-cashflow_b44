import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Check } from "lucide-react";
import { STANDARD_CATEGORIES } from "@/lib/mockData";

export default function CategorySelect({ value, onChange, customCategories = [], onAddCustom }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const allCategories = [...STANDARD_CATEGORIES, ...customCategories.filter(c => !STANDARD_CATEGORIES.includes(c))];
  const filtered = allCategories.filter(c => c.toLowerCase().includes(search.toLowerCase()));
  const canCreate = search.trim() && !allCategories.find(c => c.toLowerCase() === search.trim().toLowerCase());

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (cat) => {
    onChange(cat);
    setOpen(false);
    setSearch("");
  };

  const createAndSelect = () => {
    const cat = search.trim();
    if (onAddCustom) onAddCustom(cat);
    select(cat);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
      >
        <span className={value ? "text-foreground" : ""}>{value || "Uncategorized"}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-52 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="p-1.5 border-b border-border">
            <input
              autoFocus
              className="w-full text-xs px-2 py-1.5 rounded bg-muted outline-none placeholder:text-muted-foreground"
              placeholder="Search categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-48 overflow-auto py-1">
            {filtered.map(cat => (
              <button
                key={cat}
                onClick={() => select(cat)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs hover:bg-muted transition-colors text-left"
              >
                <span>{cat}</span>
                {value === cat && <Check className="w-3 h-3 text-primary" />}
              </button>
            ))}
            {canCreate && (
              <button
                onClick={createAndSelect}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted transition-colors text-primary text-left border-t border-border mt-1 pt-2"
              >
                <Plus className="w-3 h-3" />
                Create "{search.trim()}"
              </button>
            )}
            {filtered.length === 0 && !canCreate && (
              <p className="px-3 py-2 text-xs text-muted-foreground">No categories found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}