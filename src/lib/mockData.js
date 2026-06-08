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
  "Chase": "https://img.logo.dev/chase.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Bank of America": "https://img.logo.dev/bankofamerica.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Wells Fargo": "https://img.logo.dev/wellsfargo.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Citibank": "https://img.logo.dev/citi.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Amex": "https://img.logo.dev/americanexpress.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Capital One": "https://img.logo.dev/capitalone.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "SVB": "https://img.logo.dev/svb.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Mercury": "https://img.logo.dev/mercury.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
};

export const VENDOR_LOGOS = {
  "Lyft": "https://img.logo.dev/lyft.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Uber": "https://img.logo.dev/uber.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Amazon": "https://img.logo.dev/amazon.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Amazon Web Services": "https://img.logo.dev/aws.amazon.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Figma": "https://img.logo.dev/figma.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Slack": "https://img.logo.dev/slack.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Google": "https://img.logo.dev/google.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Google Workspace": "https://img.logo.dev/workspace.google.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Microsoft": "https://img.logo.dev/microsoft.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Microsoft 365": "https://img.logo.dev/microsoft.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Stripe": "https://img.logo.dev/stripe.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "WeWork": "https://img.logo.dev/wework.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Delta": "https://img.logo.dev/delta.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "United Airlines": "https://img.logo.dev/united.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Marriott": "https://img.logo.dev/marriott.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Hilton": "https://img.logo.dev/hilton.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Apple": "https://img.logo.dev/apple.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Zoom": "https://img.logo.dev/zoom.us?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Dropbox": "https://img.logo.dev/dropbox.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Shopify": "https://img.logo.dev/shopify.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Salesforce": "https://img.logo.dev/salesforce.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "ADP": "https://img.logo.dev/adp.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "Gusto": "https://img.logo.dev/gusto.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
  "ConEdison": "https://img.logo.dev/coned.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
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

export const mockBankAccounts = [
  {
    id: "bank1",
    institution: "Mercury",
    logo: "https://img.logo.dev/mercury.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
    subAccounts: [
      { id: "bank1a", label: "Checking", balance: 322968 },
      { id: "bank1b", label: "Savings", balance: 50000 },
    ],
  },
  {
    id: "bank2",
    institution: "Chase",
    logo: "https://img.logo.dev/chase.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64",
    subAccounts: [
      { id: "bank2a", label: "Checking", balance: 48200 },
    ],
  },
];

export const mockCreditCards = [
  { id: "cc1", name: "Amex Business Platinum", institution: "Amex", last_four: "3456", balance_owed: 28650, credit_limit: 100000, payment_due_date: "2026-06-17", expected_payment_amount: 28650, logo: "https://img.logo.dev/americanexpress.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64" },
  { id: "cc2", name: "Capital One Spark", institution: "Capital One", last_four: "7890", balance_owed: 4320, credit_limit: 25000, payment_due_date: "2026-06-22", expected_payment_amount: 4320, logo: "https://img.logo.dev/capitalone.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64" },
  { id: "cc3", name: "Chase Ink Business", institution: "Chase", last_four: "1234", balance_owed: 12890, credit_limit: 50000, payment_due_date: "2026-06-28", expected_payment_amount: 12890, logo: "https://img.logo.dev/chase.com?token=pk_SbZDKbFgQaeSWBDdqPJMOA&size=64" },
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