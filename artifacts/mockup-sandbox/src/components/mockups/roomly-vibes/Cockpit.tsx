import React from "react";
import { 
  Home, 
  CreditCard, 
  ClipboardList, 
  SplitSquareHorizontal, 
  BookOpen, 
  Settings, 
  Building,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";

export function Cockpit() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#111622] border-r border-slate-800/50 flex flex-col justify-between shrink-0 h-screen">
        <div>
          <div className="p-4 flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="font-bold text-slate-100 tracking-tight text-sm uppercase">Roomly_OS</span>
          </div>
          
          <nav className="flex flex-col gap-0.5 px-2">
            {[
              { icon: Home, label: "Dashboard", active: true },
              { icon: CreditCard, label: "Expenses" },
              { icon: ClipboardList, label: "Chores" },
              { icon: SplitSquareHorizontal, label: "Rent Split" },
              { icon: BookOpen, label: "House Rules" },
              { icon: Settings, label: "Settings" }
            ].map((item, i) => (
              <a 
                key={i} 
                href="#" 
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  item.active 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                }`}
              >
                <item.icon className={`w-4 h-4 ${item.active ? "text-cyan-400" : "text-slate-500"}`} />
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="p-2 border-t border-slate-800/50">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent transition-colors">
            <Building className="w-4 h-4 text-slate-500" />
            Landlord Portal
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto p-6">
        <header className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100 tracking-tight mb-1">System Overview</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-mono">STATUS: Nominal // LAST SYNC: 12:44 PM</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded border border-slate-700 transition-colors">
              Export Data
            </button>
            <button className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-xs text-white rounded border border-cyan-500 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              + New Entry
            </button>
          </div>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111622] p-4 rounded-lg border border-slate-800/50 flex flex-col justify-between">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              Total Rent
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            </span>
            <span className="font-mono text-3xl font-light text-slate-100">$4,200</span>
          </div>
          
          <div className="bg-[#111622] p-4 rounded-lg border border-amber-900/30 flex flex-col justify-between">
            <span className="text-xs text-amber-500/70 uppercase tracking-wider mb-2 flex items-center justify-between">
              Pending Exp
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></span>
            </span>
            <span className="font-mono text-3xl font-light text-amber-400">$842.15</span>
          </div>

          <div className="bg-[#111622] p-4 rounded-lg border border-red-900/30 flex flex-col justify-between">
            <span className="text-xs text-red-500/70 uppercase tracking-wider mb-2 flex items-center justify-between">
              Overdue Chores
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)] animate-pulse"></span>
            </span>
            <span className="font-mono text-3xl font-light text-red-400">1</span>
          </div>

          <div className="bg-[#111622] p-4 rounded-lg border border-slate-800/50 flex flex-col justify-between">
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              Active Members
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]"></span>
            </span>
            <div className="flex items-end justify-between">
              <span className="font-mono text-3xl font-light text-slate-100">3</span>
              <div className="flex -space-x-1.5 mb-1">
                {["J", "P", "M"].map((initial, i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[9px] font-medium text-slate-300">
                    {initial}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="col-span-8 flex flex-col gap-6">
            
            {/* Rent Status */}
            <div className="bg-[#111622] border border-slate-800/50 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-slate-800/50 flex justify-between items-center bg-[#151b29]">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rent Payment Status</h3>
                <span className="text-[10px] font-mono text-slate-500">DUE: 1ST OF MONTH</span>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Jordan</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <div className="h-1 bg-slate-800 rounded overflow-hidden">
                    <div className="h-full bg-green-500 w-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">PAID $1,400</span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Priya</span>
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="h-1 bg-slate-800 rounded overflow-hidden">
                    <div className="h-full bg-amber-500 w-[10%]"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">PENDING $1,400</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Marcus</span>
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="h-1 bg-slate-800 rounded overflow-hidden">
                    <div className="h-full bg-amber-500 w-[10%]"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">PENDING $1,400</span>
                </div>
              </div>
            </div>

            {/* Recent Expenses Table */}
            <div className="bg-[#111622] border border-slate-800/50 rounded-lg overflow-hidden flex-1 flex flex-col">
              <div className="p-3 border-b border-slate-800/50 flex justify-between items-center bg-[#151b29]">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Ledger Activity</h3>
                <button className="text-[10px] text-cyan-500 hover:text-cyan-400 font-mono">VIEW_ALL</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-slate-500 uppercase tracking-wider font-mono border-b border-slate-800/50">
                    <tr>
                      <th className="px-4 py-2 font-normal">Date</th>
                      <th className="px-4 py-2 font-normal">Description</th>
                      <th className="px-4 py-2 font-normal">Paid By</th>
                      <th className="px-4 py-2 text-right font-normal">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-[13px] divide-y divide-slate-800/50">
                    {[
                      { date: "10/24", desc: "Whole Foods", user: "Jordan", amount: "186.40" },
                      { date: "10/22", desc: "PG&E electricity", user: "Priya", amount: "124.00" },
                      { date: "10/21", desc: "Comcast internet", user: "Marcus", amount: "89.00" },
                      { date: "10/18", desc: "Cleaning supplies", user: "Jordan", amount: "42.75" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-slate-500">{row.date}</td>
                        <td className="px-4 py-3 text-slate-300 font-sans text-sm">{row.desc}</td>
                        <td className="px-4 py-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                            {row.user}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-300">${row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="col-span-4 flex flex-col gap-6">
            
            {/* Member Balances */}
            <div className="bg-[#111622] border border-slate-800/50 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-slate-800/50 bg-[#151b29]">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settlement Balances</h3>
              </div>
              <div className="p-4 flex flex-col gap-4">
                {[
                  { name: "Jordan", bal: "+$286.02", positive: true },
                  { name: "Priya", bal: "-$5.31", positive: false },
                  { name: "Marcus", bal: "-$280.71", positive: false },
                ].map((user, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-800/50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-300 border border-slate-700">
                        {user.name[0]}
                      </div>
                      <span className="text-sm text-slate-300">{user.name}</span>
                    </div>
                    <span className={`font-mono text-sm ${user.positive ? "text-green-400" : "text-red-400"}`}>
                      {user.bal}
                    </span>
                  </div>
                ))}
                
                <button className="w-full mt-2 py-2 border border-slate-700 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors uppercase tracking-wider">
                  Settle Up
                </button>
              </div>
            </div>

            {/* Mini Chore List */}
            <div className="bg-[#111622] border border-slate-800/50 rounded-lg overflow-hidden flex-1">
              <div className="p-3 border-b border-slate-800/50 bg-[#151b29] flex justify-between items-center">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Chores</h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-400 border border-red-500/30">1 OVERDUE</span>
              </div>
              <div className="p-0">
                {[
                  { title: "Take out trash", assignee: "Priya", status: "overdue" },
                  { title: "Clean kitchen", assignee: "Jordan", status: "pending" },
                  { title: "Vacuum common areas", assignee: "Marcus", status: "pending" },
                ].map((chore, i) => (
                  <div key={i} className="p-3 border-b border-slate-800/50 last:border-0 flex items-center gap-3 hover:bg-slate-800/20 transition-colors cursor-pointer group">
                    <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                      chore.status === 'overdue' ? 'border-red-500/50 bg-red-500/10' : 'border-slate-600 group-hover:border-slate-400'
                    }`}>
                      {chore.status === 'overdue' && <AlertCircle className="w-2 h-2 text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${chore.status === 'overdue' ? 'text-red-400' : 'text-slate-300'}`}>
                        {chore.title}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase">
                        Assignee: {chore.assignee}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

export default Cockpit;