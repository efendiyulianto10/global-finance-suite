"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CircleDollarSign,
  CreditCard,
  FileBarChart,
  FileText,
  Landmark,
  LayoutDashboard,
  Menu,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { useMemo, useState } from "react";
import { accounts, invoices, monthlyPerformance, transactions } from "@/lib/demo-data";

type Section =
  | "Dashboard"
  | "General Ledger"
  | "Chart of Accounts"
  | "Receivables"
  | "Payables"
  | "Banking"
  | "Budgeting"
  | "Reports"
  | "Consolidation"
  | "Audit & Controls"
  | "Settings";

const nav: { group: string; items: { label: Section; icon: React.ComponentType<{ size?: number }> }[] }[] = [
  {
    group: "Workspace",
    items: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "General Ledger", icon: BookOpen },
      { label: "Chart of Accounts", icon: FileText },
    ],
  },
  {
    group: "Operations",
    items: [
      { label: "Receivables", icon: ReceiptText },
      { label: "Payables", icon: CreditCard },
      { label: "Banking", icon: Landmark },
      { label: "Budgeting", icon: BarChart3 },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { label: "Reports", icon: FileBarChart },
      { label: "Consolidation", icon: Building2 },
      { label: "Audit & Controls", icon: ShieldCheck },
      { label: "Settings", icon: Settings },
    ],
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

function Badge({ status }: { status: string }) {
  const type = status === "Posted" ? "success" : status === "Overdue" ? "danger" : status === "Pending" || status === "Due soon" ? "warning" : "info";
  return <span className={`badge ${type}`}>{status}</span>;
}

function Kpi({ label, value, change, up, icon: Icon }: { label: string; value: string; change: string; up: boolean; icon: React.ComponentType<{ size?: number }> }) {
  return (
    <div className="card kpi">
      <div className="kpi-top">
        <div className="kpi-label">{label}</div>
        <div className="kpi-icon"><Icon size={18} /></div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-bottom">
        <span className={up ? "trend-up" : "trend-down"}>{up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {change}</span>
        <span>vs prior period</span>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Finance Executive Dashboard</h1>
          <p className="page-subtitle">Global consolidated view · FY2026 · USD reporting currency</p>
        </div>
        <div className="button-row">
          <button className="btn"><FileBarChart size={15} /> Export report</button>
          <button className="btn primary"><Plus size={15} /> New journal</button>
        </div>
      </div>

      <div className="kpi-grid">
        <Kpi label="Revenue YTD" value="$2.98M" change="12.8%" up icon={CircleDollarSign} />
        <Kpi label="EBITDA" value="$824.3K" change="8.4%" up icon={Activity} />
        <Kpi label="Cash Position" value="$1.28M" change="4.6%" up icon={WalletCards} />
        <Kpi label="Operating Expense" value="$1.76M" change="3.2%" up={false} icon={CreditCard} />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Revenue vs Operating Expense</div>
              <div className="card-note">Monthly trend · management view</div>
            </div>
            <button className="btn">FY2026</button>
          </div>
          <div className="chart-area">
            <div className="chart-legend">
              <span><i className="legend-dot blue" />Revenue</span>
              <span><i className="legend-dot green" />Expense</span>
            </div>
            <div className="bar-chart">
              {monthlyPerformance.map((x) => (
                <div className="bar-group" key={x.month}>
                  <div className="bar revenue" style={{ height: `${x.revenue}%` }} title={`${x.month} revenue`} />
                  <div className="bar expense" style={{ height: `${x.expense}%` }} title={`${x.month} expense`} />
                </div>
              ))}
            </div>
            <div className="month-labels">{monthlyPerformance.map((x) => <span key={x.month}>{x.month}</span>)}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Financial Health</div>
              <div className="card-note">Liquidity, collections and close readiness</div>
            </div>
          </div>
          <div className="health-list">
            <div className="health-item"><div className="health-top"><span className="health-name">Current ratio</span><span className="health-value">2.14x</span></div><div className="progress"><span style={{ width: "82%" }} /></div></div>
            <div className="health-item"><div className="health-top"><span className="health-name">AR collected on time</span><span className="health-value">88%</span></div><div className="progress"><span style={{ width: "88%" }} /></div></div>
            <div className="health-item"><div className="health-top"><span className="health-name">Budget utilization</span><span className="health-value">64%</span></div><div className="progress"><span style={{ width: "64%" }} /></div></div>
            <div className="health-item"><div className="health-top"><span className="health-name">Month-end close</span><span className="health-value">76%</span></div><div className="progress"><span style={{ width: "76%" }} /></div></div>
          </div>
          <div className="metric-row">
            <div className="metric-mini"><div className="label">DSO</div><div className="value">31.4d</div></div>
            <div className="metric-mini"><div className="label">DPO</div><div className="value">42.8d</div></div>
            <div className="metric-mini"><div className="label">Runway</div><div className="value">18.2m</div></div>
          </div>
        </div>
      </div>

      <div className="card table-card">
        <div className="card-head">
          <div><div className="card-title">Recent Journal Activity</div><div className="card-note">Latest postings across all entities</div></div>
          <button className="btn">View all</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Journal</th><th>Date</th><th>Description</th><th>Account</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {transactions.map((t) => <tr key={t.id}><td><strong>{t.id}</strong></td><td>{t.date}</td><td>{t.memo}</td><td>{t.account}</td><td className="amount">{money(t.amount)}</td><td><Badge status={t.status} /></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Ledger() {
  return (
    <>
      <div className="page-head"><div><h1 className="page-title">General Ledger</h1><p className="page-subtitle">Double-entry journal management, posting controls, reversals and period close.</p></div><div className="button-row"><button className="btn">Import</button><button className="btn primary"><Plus size={15}/> Create journal</button></div></div>
      <div className="card">
        <div className="card-head"><div><div className="card-title">Journal Register</div><div className="card-note">All entities · FY2026</div></div></div>
        <div className="form-row"><div className="field"><label>Entity</label><select><option>All entities</option><option>Global HQ</option><option>Singapore Pte Ltd</option></select></div><div className="field"><label>Period</label><select><option>Aug 2026</option></select></div><div className="field"><label>Status</label><select><option>All statuses</option><option>Draft</option><option>Posted</option></select></div><div className="field"><label>Search</label><input placeholder="Journal no. or memo"/></div></div>
        <div className="table-wrap"><table><thead><tr><th>Journal</th><th>Date</th><th>Memo</th><th>Primary account</th><th>Net amount</th><th>Status</th></tr></thead><tbody>{transactions.map((t)=><tr key={t.id}><td><strong>{t.id}</strong></td><td>{t.date}</td><td>{t.memo}</td><td>{t.account}</td><td className="amount">{money(t.amount)}</td><td><Badge status={t.status}/></td></tr>)}</tbody></table></div>
      </div>
    </>
  );
}

function ChartAccounts() {
  return (
    <>
      <div className="page-head"><div><h1 className="page-title">Chart of Accounts</h1><p className="page-subtitle">Global standardized account structure with local mapping support.</p></div><button className="btn primary"><Plus size={15}/> Add account</button></div>
      <div className="card table-card" style={{ marginTop: 0 }}><div className="table-wrap"><table><thead><tr><th>Code</th><th>Account name</th><th>Type</th><th>Balance</th><th>Currency</th><th>Status</th></tr></thead><tbody>{accounts.map((a)=><tr key={a.code}><td><strong>{a.code}</strong></td><td>{a.name}</td><td>{a.type}</td><td className="amount">{money(a.balance)}</td><td>USD</td><td><Badge status="Posted"/></td></tr>)}</tbody></table></div></div>
    </>
  );
}

function Receivables({ payable = false }: { payable?: boolean }) {
  const title = payable ? "Accounts Payable" : "Accounts Receivable";
  return (
    <>
      <div className="page-head"><div><h1 className="page-title">{title}</h1><p className="page-subtitle">{payable ? "Vendor bills, payment runs, approval workflow and payable aging." : "Customer invoices, credit control, collection workflow and receivable aging."}</p></div><button className="btn primary"><Plus size={15}/> {payable ? "New bill" : "New invoice"}</button></div>
      <div className="kpi-grid">
        <Kpi label={payable ? "Open Payables" : "Open Receivables"} value={payable ? "$328.6K" : "$642.3K"} change="6.1%" up={!payable} icon={ReceiptText}/>
        <Kpi label={payable ? "Due This Week" : "Due This Week"} value={payable ? "$91.8K" : "$142.6K"} change="2.4%" up={false} icon={Activity}/>
        <Kpi label={payable ? "Avg. DPO" : "Avg. DSO"} value={payable ? "42.8d" : "31.4d"} change="1.8d" up={!payable} icon={BarChart3}/>
        <Kpi label={payable ? "Scheduled Payments" : "Overdue"} value={payable ? "$118.2K" : "$31.8K"} change="3.6%" up={!payable} icon={CircleDollarSign}/>
      </div>
      <div className="card table-card"><div className="card-head"><div><div className="card-title">{payable ? "Vendor Bills" : "Customer Invoices"}</div><div className="card-note">Aging and settlement status</div></div></div><div className="table-wrap"><table><thead><tr><th>Document</th><th>{payable ? "Vendor" : "Customer"}</th><th>Due date</th><th>Amount</th><th>Status</th></tr></thead><tbody>{invoices.map((i)=><tr key={i.no}><td><strong>{payable ? i.no.replace("INV", "BILL") : i.no}</strong></td><td>{i.partner}</td><td>{i.due}</td><td className="amount">{money(payable ? Math.round(i.amount * .72) : i.amount)}</td><td><Badge status={i.status}/></td></tr>)}</tbody></table></div></div>
    </>
  );
}

const modules: Record<string, { icon: React.ComponentType<{ size?: number }>; title: string; desc: string }[]> = {
  Banking: [
    { icon: Landmark, title: "Bank Accounts", desc: "Multi-bank cash position, ledger linkage, statement balance and authorized signatories." },
    { icon: Activity, title: "Bank Reconciliation", desc: "Match bank statement lines against journals, invoices, fees and transfers." },
    { icon: WalletCards, title: "Cash Forecast", desc: "Rolling liquidity forecast using receivables, payables and planned cash flows." },
  ],
  Budgeting: [
    { icon: BarChart3, title: "Operating Budget", desc: "Department and cost-center planning with version control and approval workflow." },
    { icon: FileBarChart, title: "Forecast Scenarios", desc: "Base, upside and downside scenarios with driver-based projections." },
    { icon: Users, title: "Budget Owners", desc: "Assign accountable owners, approval limits and monthly variance commentary." },
  ],
  Reports: [
    { icon: FileBarChart, title: "Financial Statements", desc: "Profit & Loss, Balance Sheet, Cash Flow and Statement of Changes in Equity." },
    { icon: Activity, title: "Management Reporting", desc: "KPIs, profitability, cost center performance, working capital and variance analysis." },
    { icon: FileText, title: "Tax & Compliance", desc: "Tax-ready exports, local statutory mapping and audit support schedules." },
  ],
  Consolidation: [
    { icon: Building2, title: "Entity Consolidation", desc: "Multi-entity roll-up with reporting currency conversion and ownership structure." },
    { icon: ArrowDownRight, title: "Intercompany Elimination", desc: "Identify, reconcile and eliminate intercompany balances and transactions." },
    { icon: CircleDollarSign, title: "FX Translation", desc: "Period-end translation using closing, average and historical rate rules." },
  ],
  "Audit & Controls": [
    { icon: ShieldCheck, title: "Approval Matrix", desc: "Maker-checker controls, thresholds, segregation of duties and delegated authority." },
    { icon: FileText, title: "Audit Trail", desc: "Immutable record of who created, approved, posted, edited or reversed finance records." },
    { icon: Activity, title: "Close Checklist", desc: "Structured month-end and year-end close tasks with owners and evidence." },
  ],
  Settings: [
    { icon: Building2, title: "Companies & Entities", desc: "Legal entity configuration, tax IDs, base currency, fiscal calendar and local books." },
    { icon: Users, title: "Users & Roles", desc: "Role-based permissions for CFO, controller, accountant, AP, AR, auditor and approver." },
    { icon: Settings, title: "Accounting Policies", desc: "Numbering, posting periods, FX rules, approval limits and integration preferences." },
  ],
};

function GenericModule({ section }: { section: Section }) {
  const items = modules[section] ?? [];
  return (
    <>
      <div className="page-head"><div><h1 className="page-title">{section}</h1><p className="page-subtitle">Enterprise controls and workflows designed for a multi-entity finance organization.</p></div><button className="btn primary"><Plus size={15}/> New</button></div>
      <div className="module-grid">{items.map(({icon: Icon, title, desc}) => <div className="card module-card" key={title}><div className="module-icon"><Icon size={19}/></div><div className="module-title">{title}</div><div className="module-desc">{desc}</div><div className="module-footer">Open workspace →</div></div>)}</div>
    </>
  );
}

export function FinanceApp() {
  const [section, setSection] = useState<Section>("Dashboard");
  const [query, setQuery] = useState("");
  const filteredNav = useMemo(() => nav.map(g => ({...g, items: g.items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))})), [query]);

  const body = section === "Dashboard" ? <Dashboard /> : section === "General Ledger" ? <Ledger /> : section === "Chart of Accounts" ? <ChartAccounts /> : section === "Receivables" ? <Receivables /> : section === "Payables" ? <Receivables payable /> : <GenericModule section={section} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">GF</div><div><div className="brand-title">Global Finance</div><div className="brand-subtitle">Enterprise Accounting Suite</div></div></div>
        <div>
          {filteredNav.map((group) => <div key={group.group}><div className="nav-section-label">{group.group}</div><nav className="nav">{group.items.map(({label, icon: Icon}) => <button key={label} className={`nav-button ${section===label ? "active" : ""}`} onClick={()=>setSection(label)}><Icon size={18}/><span>{label}</span></button>)}</nav></div>)}
        </div>
        <div className="sidebar-footer"><div className="company-card"><div className="company-name">Aurelius Global Holdings</div><div className="company-meta">6 entities · 4 currencies · FY2026</div></div></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div style={{display:"flex",alignItems:"center",gap:10}}><button className="icon-button mobile-menu"><Menu size={18}/></button><div className="searchbox"><Search size={16}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search modules, reports, accounts…" /></div></div>
          <div className="top-actions"><button className="icon-button"><Bell size={17}/></button><div className="avatar">CF</div><div className="user-copy"><div className="user-name">Clara Fernandez</div><div className="user-role">Group CFO</div></div></div>
        </header>
        <div className="content">{body}</div>
      </main>
    </div>
  );
}
