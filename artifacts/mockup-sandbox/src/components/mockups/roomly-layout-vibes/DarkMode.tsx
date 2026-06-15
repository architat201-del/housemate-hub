import React from 'react';
import {
  Home,
  Receipt,
  ListTodo,
  Wallet,
  FileText,
  Settings,
  Building2,
} from 'lucide-react';

export function DarkMode() {
  return (
    <div
      className="min-h-screen flex text-slate-200 font-sans selection:bg-indigo-500/30"
      style={{ backgroundColor: '#0f1117' }}
    >
      {/* Sidebar */}
      <aside
        className="w-[240px] flex-shrink-0 flex flex-col border-r border-white/5"
        style={{ backgroundColor: '#111827' }}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6">
          <span className="text-xl font-bold tracking-tight text-indigo-400">
            Roomly
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: 'rgba(79, 70, 229, 0.15)',
              color: '#818cf8',
            }}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </a>
          {[
            { icon: Receipt, label: 'Expenses' },
            { icon: ListTodo, label: 'Chores' },
            { icon: Wallet, label: 'Rent Split' },
            { icon: FileText, label: 'House Rules' },
            { icon: Settings, label: 'Settings' },
          ].map((item, i) => (
            <a
              key={i}
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Bottom Link */}
        <div className="p-4 border-t border-white/5">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <Building2 className="w-5 h-5" />
            <span className="font-medium text-sm">Landlord Portal</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Overview of your household.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="TOTAL RENT"
              value="$4,200"
              subtext="Due Jun 15"
            />
            <StatCard
              label="PENDING EXPENSES"
              value="$842.15"
              subtext="Awaiting settlement"
            />
            <StatCard
              label="OVERDUE CHORES"
              value="1"
              subtext="Needs attention"
            />
            <StatCard
              label="MEMBERS"
              value="3"
              subtext="Active roommates"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div
      className="p-6 rounded-xl border border-white/5 shadow-sm transition-all hover:bg-white/[0.02]"
      style={{
        backgroundColor: '#1c1f2e',
        boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </h3>
      <div className="text-3xl font-bold text-white mb-1 tracking-tight">
        {value}
      </div>
      <p className="text-xs text-slate-500">{subtext}</p>
    </div>
  );
}
