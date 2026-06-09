import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Plus, Pencil, Trash2, CheckCircle2, AlertCircle, WifiOff,
  ChevronDown, ChevronRight, Building2, Globe
} from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const INITIAL_ENTITIES = [
  {
    id: "ent1",
    name: "Acme Corp",
    legal_name: "Acme Corporation Inc.",
    country: "us",
    ein_or_tax_id: "82-1234567",
    notes: "Main operating entity",
  },
  {
    id: "ent2",
    name: "Acme Israel",
    legal_name: "Acme Technologies Ltd.",
    country: "israel",
    ein_or_tax_id: "514-123456",
    notes: "R&D subsidiary — Israel-based",
  },
];

const INITIAL_CONNECTORS = [
  // Acme Corp
  { id: "c1", entity_id: "ent1", software: "quickbooks", account_name: "Acme Corp - QBO", account_identifier: "acmecorp.qbo.intuit.com", connection_method: "api", is_accounting_software: true, last_sync: "2026-06-09T08:14:00Z", status: "active", notes: "" },
  { id: "c2", entity_id: "ent1", software: "bank_account", account_name: "Mercury Checking", account_identifier: "••• 2968", connection_method: "plaid", is_accounting_software: false, last_sync: "2026-06-09T06:00:00Z", status: "active", notes: "" },
  { id: "c3", entity_id: "ent1", software: "bank_account", account_name: "Chase Checking", account_identifier: "••• 8200", connection_method: "direct", is_accounting_software: false, last_sync: "2026-06-08T22:00:00Z", status: "active", notes: "" },
  { id: "c4", entity_id: "ent1", software: "shopify", account_name: "Acme Store", account_identifier: "acme-store.myshopify.com", connection_method: "api", is_accounting_software: false, last_sync: "2026-06-09T07:30:00Z", status: "active", notes: "" },
  { id: "c5", entity_id: "ent1", software: "stripe", account_name: "Stripe Payments", account_identifier: "acct_1Mx3cRBN", connection_method: "api", is_accounting_software: false, last_sync: "2026-06-09T05:45:00Z", status: "error", notes: "Webhook verification failed" },
  { id: "c6", entity_id: "ent1", software: "gusto", account_name: "Acme Payroll", account_identifier: "acme-corp@gusto.com", connection_method: "api", is_accounting_software: false, last_sync: "2026-06-06T12:00:00Z", status: "active", notes: "" },
  // Acme Israel
  { id: "c7", entity_id: "ent2", software: "xero", account_name: "Acme Israel - Xero", account_identifier: "acmeil.xero.com", connection_method: "api", is_accounting_software: true, last_sync: "2026-06-09T07:00:00Z", status: "active", notes: "" },
  { id: "c8", entity_id: "ent2", software: "bank_account", account_name: "Bank Hapoalim", account_identifier: "••• 4412", connection_method: "direct", is_accounting_software: false, last_sync: "2026-06-08T18:00:00Z", status: "active", notes: "" },
  { id: "c9", entity_id: "ent2", software: "bank_account", account_name: "Mercury (USD)", account_identifier: "••• 1104", connection_method: "plaid", is_accounting_software: false, last_sync: "2026-06-07T09:00:00Z", status: "disconnected", notes: "Re-auth required" },
];

// ── Config ────────────────────────────────────────────────────────────────────
const SOFTWARE_LABELS = {
  quickbooks: "QuickBooks",
  xero: "Xero",
  bank_account: "Bank Account",
  shopify: "Shopify",
  stripe: "Stripe",
  paypal: "PayPal",
  gusto: "Gusto",
  rippling: "Rippling",
  ramp: "Ramp",
  brex: "Brex",
  other: "Other",
};

const SOFTWARE_LOGOS = {
  quickbooks: "https://img.logo.dev/quickbooks.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  xero: "https://img.logo.dev/xero.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  bank_account: null,
  shopify: "https://img.logo.dev/shopify.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  stripe: "https://img.logo.dev/stripe.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  paypal: "https://img.logo.dev/paypal.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  gusto: "https://img.logo.dev/gusto.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  rippling: "https://img.logo.dev/rippling.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  ramp: "https://img.logo.dev/ramp.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  brex: "https://img.logo.dev/brex.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
};

const CONNECTION_COLORS = {
  plaid: "bg-indigo-50 text-indigo-700 border-indigo-200",
  direct: "bg-emerald-50 text-emerald-700 border-emerald-200",
  api: "bg-blue-50 text-blue-700 border-blue-200",
  manual: "bg-slate-50 text-slate-600 border-slate-200",
};

const STATUS_CONFIG = {
  active: { icon: CheckCircle2, color: "text-emerald-500", label: "Active" },
  error: { icon: AlertCircle, color: "text-red-500", label: "Error" },
  disconnected: { icon: WifiOff, color: "text-muted-foreground", label: "Disconnected" },
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function SoftwareLogo({ software, size = 28 }) {
  const [failed, setFailed] = useState(false);
  const url = SOFTWARE_LOGOS[software];
  const label = SOFTWARE_LABELS[software] || software;
  const initials = label.slice(0, 2).toUpperCase();

  if (url && !failed) {
    return (
      <div className="rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden shrink-0" style={{ width: size, height: size }}>
        <img src={url} alt={label} className="w-full h-full object-contain p-0.5" onError={() => setFailed(true)} />
      </div>
    );
  }
  return (
    <div className="rounded-lg bg-muted flex items-center justify-center shrink-0 text-[9px] font-bold text-muted-foreground" style={{ width: size, height: size }}>
      {initials}
    </div>
  );
}

function ConnectorCard({ connector, onDelete }) {
  const { icon: StatusIcon, color, label: statusLabel } = STATUS_CONFIG[connector.status] || STATUS_CONFIG.active;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${connector.status === "error" ? "border-red-200 bg-red-50/30" : connector.status === "disconnected" ? "border-border bg-muted/20" : "border-border bg-card"}`}>
      <SoftwareLogo software={connector.software} size={32} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-xs font-semibold text-foreground">{connector.account_name}</span>
          {connector.is_accounting_software && (
            <span className="text-[9px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5">Accounting</span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground truncate">{connector.account_identifier}</p>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={`text-[9px] font-medium border rounded px-1.5 py-0.5 ${CONNECTION_COLORS[connector.connection_method]}`}>
            {connector.connection_method}
          </span>
          <div className={`flex items-center gap-1 text-[9px] font-medium ${color}`}>
            <StatusIcon className="w-3 h-3" />
            {statusLabel}
          </div>
          {connector.last_sync && (
            <span className="text-[9px] text-muted-foreground">
              synced {formatDistanceToNow(new Date(connector.last_sync), { addSuffix: true })}
            </span>
          )}
        </div>
        {connector.notes && (
          <p className="text-[10px] text-muted-foreground mt-1 italic">{connector.notes}</p>
        )}
      </div>

      <button
        onClick={() => onDelete(connector.id)}
        className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function AddConnectorForm({ entityId, existingConnectors, onSave, onCancel }) {
  const [form, setForm] = useState({
    software: "bank_account",
    account_name: "",
    account_identifier: "",
    connection_method: "direct",
    is_accounting_software: false,
    status: "active",
    notes: "",
  });

  const hasAccounting = existingConnectors.some(c => c.is_accounting_software);
  const isAccountingSoftware = ["quickbooks", "xero"].includes(form.software);

  const save = () => {
    if (!form.account_name) return;
    onSave({
      ...form,
      id: `c${Date.now()}`,
      entity_id: entityId,
      is_accounting_software: isAccountingSoftware,
      last_sync: null,
    });
  };

  return (
    <div className="border border-primary/20 rounded-xl bg-primary/5 p-4 space-y-3">
      <p className="text-xs font-semibold text-foreground">Add Connector</p>

      {hasAccounting && isAccountingSoftware && (
        <div className="flex items-center gap-2 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
          <AlertCircle className="w-3 h-3 shrink-0" />
          This entity already has an accounting software connected.
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Software</label>
          <select value={form.software} onChange={e => setForm(f => ({ ...f, software: e.target.value }))}
            className="w-full text-xs bg-card border border-border rounded px-2 py-1.5 outline-none">
            {Object.entries(SOFTWARE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Connection Method</label>
          <select value={form.connection_method} onChange={e => setForm(f => ({ ...f, connection_method: e.target.value }))}
            className="w-full text-xs bg-card border border-border rounded px-2 py-1.5 outline-none">
            <option value="direct">Direct</option>
            <option value="plaid">Plaid</option>
            <option value="api">API</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Account Name *</label>
          <input value={form.account_name} onChange={e => setForm(f => ({ ...f, account_name: e.target.value }))}
            placeholder="e.g. Mercury Checking"
            className="w-full text-xs bg-card border border-border rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary/30" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Account ID / Identifier</label>
          <input value={form.account_identifier} onChange={e => setForm(f => ({ ...f, account_identifier: e.target.value }))}
            placeholder="e.g. ••• 1234"
            className="w-full text-xs bg-card border border-border rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary/30" />
        </div>
        <div className="col-span-2">
          <label className="text-[10px] text-muted-foreground block mb-1">Notes</label>
          <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Optional notes..."
            className="w-full text-xs bg-card border border-border rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary/30" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={save} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded">Add Connector</button>
        <button onClick={onCancel} className="text-xs text-muted-foreground px-2">Cancel</button>
      </div>
    </div>
  );
}

function EntityCard({ entity, connectors, onDeleteConnector, onAddConnector, onDeleteEntity }) {
  const [expanded, setExpanded] = useState(true);
  const [addingConnector, setAddingConnector] = useState(false);

  const accounting = connectors.find(c => c.is_accounting_software);
  const banks = connectors.filter(c => c.software === "bank_account");
  const others = connectors.filter(c => !c.is_accounting_software && c.software !== "bank_account");

  const handleAdd = (connector) => {
    onAddConnector(connector);
    setAddingConnector(false);
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Entity header */}
      <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setExpanded(e => !e)}>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">{entity.name}</h3>
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border flex items-center gap-1 ${entity.country === "us" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
              <Globe className="w-2.5 h-2.5" />
              {entity.country === "us" ? "🇺🇸 US" : "🇮🇱 Israel"}
            </span>
            {entity.ein_or_tax_id && (
              <span className="text-[9px] text-muted-foreground">{entity.country === "us" ? "EIN" : "Tax ID"}: {entity.ein_or_tax_id}</span>
            )}
          </div>
          {entity.legal_name && entity.legal_name !== entity.name && (
            <p className="text-[10px] text-muted-foreground">{entity.legal_name}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-muted-foreground">{connectors.length} connector{connectors.length !== 1 ? "s" : ""}</span>
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">

          {/* Accounting Software */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Accounting Software</p>
            {accounting ? (
              <div className="group">
                <ConnectorCard connector={accounting} onDelete={onDeleteConnector} />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                No accounting software connected
              </div>
            )}
          </div>

          {/* Bank Accounts */}
          {banks.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bank Accounts</p>
              <div className="space-y-2">
                {banks.map(c => (
                  <div key={c.id} className="group">
                    <ConnectorCard connector={c} onDelete={onDeleteConnector} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Connections */}
          {others.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Other Connections</p>
              <div className="space-y-2">
                {others.map(c => (
                  <div key={c.id} className="group">
                    <ConnectorCard connector={c} onDelete={onDeleteConnector} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Connector */}
          {addingConnector ? (
            <AddConnectorForm
              entityId={entity.id}
              existingConnectors={connectors}
              onSave={handleAdd}
              onCancel={() => setAddingConnector(false)}
            />
          ) : (
            <button
              onClick={() => setAddingConnector(true)}
              className="flex items-center gap-1.5 text-xs text-primary hover:underline mt-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Connector
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AddEntityForm({ onSave, onCancel }) {
  const [form, setForm] = useState({ name: "", legal_name: "", country: "us", ein_or_tax_id: "", notes: "" });

  const save = () => {
    if (!form.name) return;
    onSave({ ...form, id: `ent${Date.now()}` });
  };

  return (
    <div className="bg-card rounded-xl border border-primary/30 p-4 space-y-3">
      <p className="text-sm font-semibold text-foreground">New Business Entity</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Entity Name *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Acme Corp" className="w-full text-xs bg-background border border-border rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary/30" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Legal Name</label>
          <input value={form.legal_name} onChange={e => setForm(f => ({ ...f, legal_name: e.target.value }))}
            placeholder="Acme Corporation Inc." className="w-full text-xs bg-background border border-border rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary/30" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">Country</label>
          <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
            className="w-full text-xs bg-background border border-border rounded px-2 py-1.5 outline-none">
            <option value="us">🇺🇸 United States</option>
            <option value="israel">🇮🇱 Israel</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground block mb-1">{form.country === "us" ? "EIN" : "Tax ID"}</label>
          <input value={form.ein_or_tax_id} onChange={e => setForm(f => ({ ...f, ein_or_tax_id: e.target.value }))}
            placeholder={form.country === "us" ? "XX-XXXXXXX" : "XXXXXXXXX"}
            className="w-full text-xs bg-background border border-border rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary/30" />
        </div>
        <div className="col-span-2">
          <label className="text-[10px] text-muted-foreground block mb-1">Notes</label>
          <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Optional notes..."
            className="w-full text-xs bg-background border border-border rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary/30" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={save} className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded">Add Entity</button>
        <button onClick={onCancel} className="text-sm text-muted-foreground px-2">Cancel</button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Entities() {
  const [entities, setEntities] = useState(INITIAL_ENTITIES);
  const [connectors, setConnectors] = useState(INITIAL_CONNECTORS);
  const [addingEntity, setAddingEntity] = useState(false);

  const addEntity = (entity) => { setEntities(prev => [...prev, entity]); setAddingEntity(false); };
  const deleteEntity = (id) => { setEntities(prev => prev.filter(e => e.id !== id)); setConnectors(prev => prev.filter(c => c.entity_id !== id)); };
  const addConnector = (connector) => setConnectors(prev => [...prev, connector]);
  const deleteConnector = (id) => setConnectors(prev => prev.filter(c => c.id !== id));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 border-b border-border bg-card shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Business Entities</h1>
          <p className="text-[11px] text-muted-foreground">{entities.length} entit{entities.length !== 1 ? "ies" : "y"} · {connectors.length} connectors</p>
        </div>
        <button
          onClick={() => setAddingEntity(v => !v)}
          className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Entity
        </button>
      </div>

      <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
        {addingEntity && (
          <AddEntityForm onSave={addEntity} onCancel={() => setAddingEntity(false)} />
        )}
        {entities.map(entity => (
          <EntityCard
            key={entity.id}
            entity={entity}
            connectors={connectors.filter(c => c.entity_id === entity.id)}
            onDeleteConnector={deleteConnector}
            onAddConnector={addConnector}
            onDeleteEntity={deleteEntity}
          />
        ))}
        {entities.length === 0 && !addingEntity && (
          <div className="text-center text-sm text-muted-foreground py-16">
            No entities yet. Click "Add Entity" to get started.
          </div>
        )}
      </div>
    </div>
  );
}