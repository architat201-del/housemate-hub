import React from "react";
import {
  AlertTriangle,
  DollarSign,
  Home,
  Check,
  Plus,
  Settings,
  Receipt,
  ListTodo,
  Users,
  BookOpen,
  ArrowRight,
  CircleCheck,
  MoreHorizontal
} from "lucide-react";

export function TodayMode() {
  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ backgroundColor: "#3c2a21" }}>
        <div className="p-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <Home className="w-6 h-6" />
            Roomly
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem icon={<AlertTriangle className="w-4 h-4" />} label="Dashboard" active />
          <NavItem icon={<Receipt className="w-4 h-4" />} label="Expenses" />
          <NavItem icon={<ListTodo className="w-4 h-4" />} label="Chores" />
          <NavItem icon={<Users className="w-4 h-4" />} label="Rent Split" />
          <NavItem icon={<BookOpen className="w-4 h-4" />} label="House Rules" />
        </nav>

        <div className="p-3">
          <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative max-w-4xl">
        <div className="flex-1 overflow-y-auto pb-32">
          {/* Header */}
          <header className="px-10 py-12">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Today</h1>
            <p className="text-slate-500 mt-2 text-lg">Thursday, October 12</p>
          </header>

          <div className="px-10 space-y-16">
            {/* Zone 1: Needs attention */}
            <section>
              <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                Needs attention
              </h2>
              <div className="border-t border-slate-100">
                <ActionRow
                  critical
                  icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
                  title="Priya's Bathrooms chore is 2 days overdue"
                  subtitle="Assigned to Priya • Due Tuesday"
                  action="Send reminder"
                  actionColor="bg-red-50 text-red-700 hover:bg-red-100"
                />
                <ActionRow
                  critical
                  icon={<DollarSign className="w-5 h-5 text-red-500" />}
                  title="$842.15 in unsettled expenses"
                  subtitle="You owe $340.50 • Others owe you $501.65"
                  action="Settle up"
                  actionColor="bg-red-50 text-red-700 hover:bg-red-100"
                />
              </div>
            </section>

            {/* Zone 2: This week */}
            <section>
              <h2 className="text-xl font-semibold text-amber-600 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                This week
              </h2>
              <div className="border-t border-slate-100">
                <ActionRow
                  icon={<Home className="w-5 h-5 text-amber-500" />}
                  title="Rent due in 12 days — $4,200 total"
                  subtitle="Your share: $1,400"
                  action="View breakdown"
                  actionColor="bg-amber-50 text-amber-700 hover:bg-amber-100"
                />
                <ActionRow
                  icon={<ListTodo className="w-5 h-5 text-amber-500" />}
                  title="Marcus: Vacuum common areas"
                  subtitle="Due Friday"
                  action="Mark done"
                  actionColor="bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                />
                <ActionRow
                  icon={<ListTodo className="w-5 h-5 text-amber-500" />}
                  title="Jordan: Clean bathrooms"
                  subtitle="Due Sunday"
                  action="Mark done"
                  actionColor="bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                />
                <ActionRow
                  icon={<DollarSign className="w-5 h-5 text-amber-500" />}
                  title="Priya's rent payment pending — $1,400"
                  subtitle="Awaiting confirmation"
                  action="Send reminder"
                  actionColor="bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                />
              </div>
            </section>

            {/* Zone 3: All good */}
            <section>
              <h2 className="text-xl font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                All good
              </h2>
              <div className="border-t border-slate-100">
                <ResolvedRow
                  icon={<CircleCheck className="w-5 h-5 text-emerald-500" />}
                  text="Jordan paid October rent — $1,600"
                />
                <ResolvedRow
                  icon={<CircleCheck className="w-5 h-5 text-emerald-500" />}
                  text="Kitchen & Dishes completed by Jordan"
                />
                <ResolvedRow
                  icon={<CircleCheck className="w-5 h-5 text-emerald-500" />}
                  text="Priya paid groceries — $186.40"
                />
              </div>
            </section>
          </div>
        </div>

        {/* Quick Add Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 p-2 flex items-center justify-between pointer-events-auto transition-transform hover:-translate-y-1 duration-300">
            <span className="text-slate-500 font-medium pl-4">What happened?</span>
            <div className="flex gap-2">
              <QuickAddBtn icon={<ListTodo className="w-4 h-4" />} label="Chore" />
              <QuickAddBtn icon={<Receipt className="w-4 h-4" />} label="Expense" />
              <QuickAddBtn icon={<DollarSign className="w-4 h-4" />} label="Payment" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? "bg-white/10 text-white" 
          : "text-[#d5ccc3] hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ActionRow({ 
  icon, 
  title, 
  subtitle, 
  action, 
  actionColor, 
  critical = false 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  action: string;
  actionColor: string;
  critical?: boolean;
}) {
  return (
    <div className={`group flex items-center gap-4 py-4 border-b border-slate-100 ${critical ? 'relative' : ''}`}>
      {critical && (
        <div className="absolute left-[-40px] top-0 bottom-0 w-1 bg-red-500 rounded-r-full" />
      )}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${critical ? 'bg-red-50' : 'bg-amber-50'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-slate-900 truncate">{title}</p>
        <p className="text-sm text-slate-500 truncate mt-0.5">{subtitle}</p>
      </div>
      <button className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${actionColor}`}>
        {action}
      </button>
    </div>
  );
}

function ResolvedRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 opacity-60 hover:opacity-100 transition-opacity cursor-default">
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-slate-50">
        {icon}
      </div>
      <p className="flex-1 text-base font-medium text-slate-600 line-through decoration-slate-300">
        {text}
      </p>
    </div>
  );
}

function QuickAddBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
        <Plus className="w-3 h-3 text-slate-600" />
      </div>
      {label}
    </button>
  );
}

export default TodayMode;
