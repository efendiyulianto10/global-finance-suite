export const monthlyPerformance = [
  { month: "Jan", revenue: 72, expense: 46 },
  { month: "Feb", revenue: 78, expense: 50 },
  { month: "Mar", revenue: 70, expense: 47 },
  { month: "Apr", revenue: 84, expense: 53 },
  { month: "May", revenue: 89, expense: 56 },
  { month: "Jun", revenue: 94, expense: 58 },
  { month: "Jul", revenue: 91, expense: 61 },
  { month: "Aug", revenue: 97, expense: 59 },
  { month: "Sep", revenue: 100, expense: 64 },
  { month: "Oct", revenue: 93, expense: 61 },
  { month: "Nov", revenue: 106, expense: 66 },
  { month: "Dec", revenue: 112, expense: 69 },
];

export const transactions = [
  { id: "JE-2026-0812", date: "12 Aug 2026", memo: "Enterprise subscription revenue", account: "4000 · Revenue", amount: 128500, status: "Posted" },
  { id: "JE-2026-0811", date: "11 Aug 2026", memo: "AWS infrastructure invoice", account: "6200 · Cloud Services", amount: -18320, status: "Posted" },
  { id: "JE-2026-0810", date: "10 Aug 2026", memo: "Professional services billing", account: "4100 · Services", amount: 48200, status: "Pending" },
  { id: "JE-2026-0809", date: "09 Aug 2026", memo: "Payroll accrual", account: "6100 · Payroll", amount: -76240, status: "Posted" },
  { id: "JE-2026-0808", date: "08 Aug 2026", memo: "Bank interest income", account: "4300 · Other Income", amount: 2840, status: "Posted" },
];

export const invoices = [
  { no: "INV-20482", partner: "Northstar Holdings", due: "18 Aug 2026", amount: 83400, status: "Due soon" },
  { no: "INV-20479", partner: "Atlas Commerce Pte Ltd", due: "21 Aug 2026", amount: 59250, status: "Open" },
  { no: "INV-20471", partner: "Helix Systems GmbH", due: "08 Aug 2026", amount: 31800, status: "Overdue" },
  { no: "INV-20465", partner: "Meridian Ventures", due: "28 Aug 2026", amount: 74500, status: "Open" },
];

export const accounts = [
  { code: "1000", name: "Cash & Cash Equivalents", type: "Asset", balance: 1284500 },
  { code: "1100", name: "Accounts Receivable", type: "Asset", balance: 642300 },
  { code: "1200", name: "Prepaid Expenses", type: "Asset", balance: 89300 },
  { code: "2000", name: "Accounts Payable", type: "Liability", balance: 328600 },
  { code: "2100", name: "Accrued Expenses", type: "Liability", balance: 174200 },
  { code: "3000", name: "Retained Earnings", type: "Equity", balance: 924700 },
  { code: "4000", name: "Revenue", type: "Income", balance: 2984100 },
  { code: "6000", name: "Operating Expenses", type: "Expense", balance: 1759800 },
];
