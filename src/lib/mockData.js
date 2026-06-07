export const STANDARD_CATEGORIES = [
  "Payroll",
  "Rent & Facilities",
  "Software & Subscriptions",
  "Travel",
  "Meals & Entertainment",
  "Utilities",
  "Professional Services",
  "Marketing & Advertising",
  "Equipment & Hardware",
  "Taxes & Compliance",
  "Insurance",
  "Shipping & Logistics",
  "Client Revenue",
  "Other Income",
  "Other Expense",
];

export const SOURCE_LOGOS = {
  "Chase": "https://logo.clearbit.com/chase.com",
  "Bank of America": "https://logo.clearbit.com/bankofamerica.com",
  "Wells Fargo": "https://logo.clearbit.com/wellsfargo.com",
  "Citibank": "https://logo.clearbit.com/citi.com",
  "Amex": "https://logo.clearbit.com/americanexpress.com",
  "Capital One": "https://logo.clearbit.com/capitalone.com",
  "SVB": "https://logo.clearbit.com/svb.com",
  "Mercury": "https://logo.clearbit.com/mercury.com",
};

export const VENDOR_LOGOS = {
  "Lyft": "https://logo.clearbit.com/lyft.com",
  "Uber": "https://logo.clearbit.com/uber.com",
  "Amazon": "https://logo.clearbit.com/amazon.com",
  "Figma": "https://logo.clearbit.com/figma.com",
  "Slack": "https://logo.clearbit.com/slack.com",
  "Google": "https://logo.clearbit.com/google.com",
  "Microsoft": "https://logo.clearbit.com/microsoft.com",
  "Stripe": "https://logo.clearbit.com/stripe.com",
  "WeWork": "https://logo.clearbit.com/wework.com",
  "Delta": "https://logo.clearbit.com/delta.com",
  "United Airlines": "https://logo.clearbit.com/united.com",
  "Marriott": "https://logo.clearbit.com/marriott.com",
  "Hilton": "https://logo.clearbit.com/hilton.com",
  "Apple": "https://logo.clearbit.com/apple.com",
  "Zoom": "https://logo.clearbit.com/zoom.us",
  "Dropbox": "https://logo.clearbit.com/dropbox.com",
  "Shopify": "https://logo.clearbit.com/shopify.com",
  "Salesforce": "https://logo.clearbit.com/salesforce.com",
  "ADP": "https://logo.clearbit.com/adp.com",
  "Gusto": "https://logo.clearbit.com/gusto.com",
};

export const mockTransactions = [
  { id: "t1", date: "2026-06-06", vendor_name: "Gusto", amount: -12450.00, type: "expense", source_name: "Mercury", source_type: "bank", connection_method: "plaid", category: "Payroll", status: "cleared", is_reimbursement: false },
  { id: "t2", date: "2026-06-05", vendor_name: "WeWork", amount: -8200.00, type: "expense", source_name: "Chase", source_type: "bank", connection_method: "plaid", category: "Rent & Facilities", status: "cleared", is_reimbursement: false },
  { id: "t3", date: "2026-06-05", vendor_name: "Acme Corp", amount: 45000.00, type: "income", source_name: "Mercury", source_type: "bank", connection_method: "direct", category: "Client Revenue", status: "cleared", is_reimbursement: false },
  { id: "t4", date: "2026-06-04", vendor_name: "Figma", amount: -840.00, type: "expense", source_name: "Amex", source_type: "cc", connection_method: "plaid", category: "Software & Subscriptions", status: "cleared", is_reimbursement: false },
  { id: "t5", date: "2026-06-04", vendor_name: "Delta", amount: -2340.00, type: "expense", source_name: "Amex", source_type: "cc", connection_method: "plaid", category: "Travel", status: "cleared", is_reimbursement: true },
  { id: "t6", date: "2026-06-03", vendor_name: "Uber", amount: -89.50, type: "expense", source_name: "Capital One", source_type: "cc", connection_method: "plaid", category: "Travel", status: "cleared", is_reimbursement: false },
  { id: "t7", date: "2026-06-03", vendor_name: "Google Workspace", amount: -1200.00, type: "expense", source_name: "Chase", source_type: "bank", connection_method: "direct", category: "Software & Subscriptions", status: "cleared", is_reimbursement: false },
  { id: "t8", date: "2026-06-02", vendor_name: "TechSolutions LLC", amount: 18500.00, type: "income", source_name: "Mercury", source_type: "bank", connection_method: "plaid", category: "Client Revenue", status: "cleared", is_reimbursement: false },
  { id: "t9", date: "2026-06-02", vendor_name: "Marriott", amount: -1890.00, type: "expense", source_name: "Amex", source_type: "cc", connection_method: "plaid", category: "Travel", status: "pending", is_reimbursement: true },
  { id: "t10", date: "2026-06-01", vendor_name: "Amazon Web Services", amount: -3420.00, type: "expense", source_name: "Chase", source_type: "bank", connection_method: "plaid", category: "Software & Subscriptions", status: "cleared", is_reimbursement: false },
  { id: "t11", date: "2026-05-31", vendor_name: "Zoom", amount: -890.00, type: "expense", source_name: "Amex", source_type: "cc", connection_method: "plaid", category: "Software & Subscriptions", status: "needs_review", is_reimbursement: false },
  { id: "t12", date: "2026-05-31", vendor_name: "Lyft", amount: -45.20, type: "expense", source_name: "Capital One", source_type: "cc", connection_method: "plaid", category: "Travel", status: "needs_review", is_reimbursement: false },
  { id: "t13", date: "2026-05-30", vendor_name: "Salesforce", amount: -5400.00, type: "expense", source_name: "Chase", source_type: "bank", connection_method: "plaid", category: "Software & Subscriptions", status: "cleared", is_reimbursement: false },
  { id: "t14", date: "2026-05-30", vendor_name: "Blue Harbor Consulting", amount: 32000.00, type: "income", source_name: "Mercury", source_type: "bank", connection_method: "plaid", category: "Client Revenue", status: "cleared", is_reimbursement: false },
  { id: "t15", date: "2026-05-29", vendor_name: "ADP", amount: -890.00, type: "expense", source_name: "Mercury", source_type: "bank", connection_method: "direct", category: "Payroll", status: "cleared", is_reimbursement: false },
  { id: "t16", date: "2026-05-29", vendor_name: "ConEdison", amount: -1240.00, type: "expense", source_name: "Chase", source_type: "bank", connection_method: "direct", category: "Utilities", status: "cleared", is_reimbursement: false },
  { id: "t17", date: "2026-05-28", vendor_name: "Microsoft 365", amount: -340.00, type: "expense", source_name: "Amex", source_type: "cc", connection_method: "plaid", category: "Software & Subscriptions", status: "needs_review", is_reimbursement: false },
  { id: "t18", date: "2026-05-28", vendor_name: "United Airlines", amount: -1560.00, type: "expense", source_name: "Amex", source_type: "cc", connection_method: "plaid", category: "Travel", status: "cleared", is_reimbursement: false },
  { id: "t19", date: "2026-05-27", vendor_name: "Dropbox", amount: -200.00, type: "expense", source_name: "Capital One", source_type: "cc", connection_method: "plaid", category: "Software & Subscriptions", status: "cleared", is_reimbursement: false },
  { id: "t20", date: "2026-05-27", vendor_name: "Shopify", amount: -290.00, type: "expense", source_name: "Amex", source_type: "cc", connection_method: "plaid", category: "Software & Subscriptions", status: "cleared", is_reimbursement: false },
];

export const mockReimbursements = [
  { id: "r1", transaction_id: "t5", transaction_vendor: "Delta", transaction_amount: -2340.00, transaction_date: "2026-06-04", owed_by: "Acme Corp", expected_date: "2026-06-20", status: "pending", notes: "Business trip for Acme project" },
  { id: "r2", transaction_id: "t9", transaction_vendor: "Marriott", transaction_amount: -1890.00, transaction_date: "2026-06-02", owed_by: "TechSolutions LLC", expected_date: "2026-06-15", status: "pending", notes: "Client site visit accommodation" },
];

export const mockCreditCards = [
  { id: "cc1", name: "Amex Business Platinum", last_four: "3456", balance_owed: 28650, credit_limit: 100000, payment_due_date: "2026-06-17", expected_payment_amount: 28650, color: "#2563eb" },
  { id: "cc2", name: "Capital One Spark", last_four: "7890", balance_owed: 4320, credit_limit: 25000, payment_due_date: "2026-06-22", expected_payment_amount: 4320, color: "#dc2626" },
  { id: "cc3", name: "Chase Ink Business", last_four: "1234", balance_owed: 12890, credit_limit: 50000, payment_due_date: "2026-06-28", expected_payment_amount: 12890, color: "#0f766e" },
];

export const mockExpectedTransactions = [
  { id: "e1", description: "Office Rent - July", amount: -8200, edate: "2026-07-01", payment_method: "bank", payment_source: "Mercury", recurring: "monthly", status: "pending", category: "Rent & Facilities" },
  { id: "e2", description: "Payroll Run", amount: -24900, edate: "2026-06-15", payment_method: "bank", payment_source: "Mercury", recurring: "monthly", status: "pending", category: "Payroll" },
  { id: "e3", description: "Acme Corp Invoice #2041", amount: 45000, edate: "2026-06-20", payment_method: "bank", payment_source: "Mercury", recurring: "one-time", status: "pending", category: "Client Revenue" },
  { id: "e4", description: "Amex Bill Payment", amount: -28650, edate: "2026-06-17", payment_method: "bank", payment_source: "Mercury", recurring: "monthly", status: "pending", category: "Other Expense" },
  { id: "e5", description: "Capital One Payment", amount: -4320, edate: "2026-06-22", payment_method: "bank", payment_source: "Mercury", recurring: "monthly", status: "pending", category: "Other Expense" },
  { id: "e6", description: "AWS Monthly", amount: -3420, edate: "2026-07-01", payment_method: "bank", payment_source: "Chase", recurring: "monthly", status: "pending", category: "Software & Subscriptions" },
  { id: "e7", description: "Blue Harbor Retainer", amount: 12000, edate: "2026-07-05", payment_method: "bank", payment_source: "Mercury", recurring: "monthly", status: "pending", category: "Client Revenue" },
  { id: "e8", description: "Salesforce Annual", amount: -5400, edate: "2026-06-30", payment_method: "bank", payment_source: "Chase", recurring: "one-time", status: "pending", category: "Software & Subscriptions" },
  { id: "e9", description: "Freelance Designer", amount: -4500, edate: "2026-06-18", payment_method: "bank", payment_source: "Mercury", recurring: "one-time", status: "pending", category: "Professional Services" },
  { id: "e10", description: "TechSolutions Invoice", amount: 18500, edate: "2026-06-25", payment_method: "bank", payment_source: "Mercury", recurring: "one-time", status: "pending", category: "Client Revenue" },
];