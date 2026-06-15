import React from "react";
import { 
  Home, 
  Receipt, 
  ListTodo, 
  Wallet, 
  FileText, 
  Settings, 
  Building2,
  Home as HomeFill 
} from "lucide-react";

export function Playful() {
  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-[240px] bg-violet-800 text-white flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-6 flex-1 flex flex-col">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-yellow-400 text-violet-900 p-2 rounded-xl rotate-[-6deg] shadow-sm">
              <HomeFill size={24} className="fill-current" />
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-1">Roomly</h1>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white text-violet-800 rounded-2xl font-bold transition-transform hover:scale-[1.02]">
              <Home size={20} strokeWidth={2.5} />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-violet-200 hover:text-white hover:bg-violet-700/50 rounded-2xl font-semibold transition-colors">
              <Receipt size={20} />
              Expenses
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-violet-200 hover:text-white hover:bg-violet-700/50 rounded-2xl font-semibold transition-colors">
              <ListTodo size={20} />
              Chores
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-violet-200 hover:text-white hover:bg-violet-700/50 rounded-2xl font-semibold transition-colors">
              <Wallet size={20} />
              Rent Split
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-violet-200 hover:text-white hover:bg-violet-700/50 rounded-2xl font-semibold transition-colors">
              <FileText size={20} />
              House Rules
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-violet-200 hover:text-white hover:bg-violet-700/50 rounded-2xl font-semibold transition-colors">
              <Settings size={20} />
              Settings
            </a>
          </nav>

          {/* Bottom */}
          <div className="mt-auto pt-6">
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-violet-300 hover:text-white bg-violet-900/50 hover:bg-violet-900 rounded-2xl font-semibold transition-colors">
              <Building2 size={20} />
              Landlord Portal
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-10 lg:p-12">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Dashboard</h2>
            <p className="text-lg text-gray-500 font-medium mt-1">Overview of your household.</p>
          </div>

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Rent */}
            <div className="bg-indigo-50 rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 ease-out shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4 block">Total Rent</span>
              <div>
                <div className="text-4xl font-black text-indigo-900 tracking-tight mb-1">$4,200</div>
                <div className="text-sm font-semibold text-indigo-600/70">Due Jun 15</div>
              </div>
            </div>

            {/* Pending Expenses */}
            <div className="bg-amber-100 rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 ease-out shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4 block">Pending Expenses</span>
              <div>
                <div className="text-4xl font-black text-amber-900 tracking-tight mb-1">$842.15</div>
                <div className="text-sm font-semibold text-amber-700/70">Awaiting settlement</div>
              </div>
            </div>

            {/* Overdue Chores */}
            <div className="bg-rose-50 rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 ease-out shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-4 block">Overdue Chores</span>
              <div>
                <div className="text-4xl font-black text-rose-900 tracking-tight mb-1">1</div>
                <div className="text-sm font-semibold text-rose-600/70">Needs attention</div>
              </div>
            </div>

            {/* Members */}
            <div className="bg-emerald-50 rounded-3xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 ease-out shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 block">Members</span>
              <div>
                <div className="text-4xl font-black text-emerald-900 tracking-tight mb-1">3</div>
                <div className="text-sm font-semibold text-emerald-700/70">Active roommates</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
