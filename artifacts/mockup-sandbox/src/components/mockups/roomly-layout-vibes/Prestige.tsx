import React from "react";
import {
  Home,
  Receipt,
  ListTodo,
  Wallet,
  FileText,
  Settings,
  Building2,
  LayoutGrid
} from "lucide-react";

export function Prestige() {
  return (
    <div className="min-h-screen flex w-full bg-[#faf8f5] font-sans">
      {/* Sidebar */}
      <div className="w-[240px] bg-[#1e293b] flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="h-20 flex items-center px-8 border-b border-white/5">
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-[#b45309]" />
              <span className="text-white text-lg font-light tracking-[0.2em] uppercase">
                Roomly
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-8 flex flex-col gap-1 px-4">
            <button className="flex items-center gap-3 px-4 py-2.5 text-white bg-transparent border-l-2 border-[#b45309] transition-colors">
              <Home className="w-4 h-4 opacity-70" />
              <span className="text-sm font-medium tracking-wide">Dashboard</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white border-l-2 border-transparent transition-colors">
              <Receipt className="w-4 h-4 opacity-70" />
              <span className="text-sm font-medium tracking-wide">Expenses</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white border-l-2 border-transparent transition-colors">
              <ListTodo className="w-4 h-4 opacity-70" />
              <span className="text-sm font-medium tracking-wide">Chores</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white border-l-2 border-transparent transition-colors">
              <Wallet className="w-4 h-4 opacity-70" />
              <span className="text-sm font-medium tracking-wide">Rent Split</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white border-l-2 border-transparent transition-colors">
              <FileText className="w-4 h-4 opacity-70" />
              <span className="text-sm font-medium tracking-wide">House Rules</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white border-l-2 border-transparent transition-colors mt-4">
              <Settings className="w-4 h-4 opacity-70" />
              <span className="text-sm font-medium tracking-wide">Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-4 mb-4">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white border-l-2 border-transparent transition-colors">
            <Building2 className="w-4 h-4 opacity-70" />
            <span className="text-sm font-medium tracking-wide">Landlord Portal</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="space-y-2">
            <h1 className="font-['Playfair_Display'] text-stone-900 text-3xl tracking-tight">
              Dashboard
            </h1>
            <p className="text-stone-400 text-sm italic">
              Overview of your household.
            </p>
          </header>

          <div className="grid grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg p-6 border border-[#e8e4df] shadow-sm flex flex-col gap-4">
              <span className="text-stone-400 text-xs font-medium tracking-widest uppercase">
                Total Rent
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-stone-900 text-3xl font-semibold tracking-tight">
                  $4,200
                </span>
                <span className="text-stone-400 text-xs">
                  Due Jun 15
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg p-6 border border-[#e8e4df] shadow-sm flex flex-col gap-4">
              <span className="text-stone-400 text-xs font-medium tracking-widest uppercase">
                Pending Expenses
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-stone-900 text-3xl font-semibold tracking-tight">
                  $842.15
                </span>
                <span className="text-stone-400 text-xs">
                  Awaiting settlement
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg p-6 border border-[#e8e4df] shadow-sm flex flex-col gap-4">
              <span className="text-stone-400 text-xs font-medium tracking-widest uppercase">
                Overdue Chores
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-stone-900 text-3xl font-semibold tracking-tight">
                  1
                </span>
                <span className="text-stone-400 text-xs">
                  Needs attention
                </span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-lg p-6 border border-[#e8e4df] shadow-sm flex flex-col gap-4">
              <span className="text-stone-400 text-xs font-medium tracking-widest uppercase">
                Members
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-stone-900 text-3xl font-semibold tracking-tight">
                  3
                </span>
                <span className="text-stone-400 text-xs">
                  Active roommates
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
