import React from "react";
import { 
  LayoutDashboard, 
  Receipt, 
  CheckSquare, 
  PieChart, 
  BookOpen, 
  Settings, 
  Building2 
} from "lucide-react";

export function Editorial() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&display=swap');
        .font-serif-display {
          font-family: 'Playfair Display', serif;
        }
        .font-sans-ui {
          font-family: 'Inter', sans-serif;
        }
      `}} />
      <div className="min-h-screen flex bg-white text-black font-sans-ui selection:bg-black selection:text-white">
        {/* Sidebar */}
        <aside className="w-56 border-r border-black/10 flex flex-col justify-between py-8">
          <div>
            <div className="px-8 pb-12">
              <h1 className="text-xl font-bold tracking-tight uppercase">Roomly.</h1>
            </div>
            
            <nav className="flex flex-col gap-1 px-4">
              <NavItem icon={<LayoutDashboard size={18} strokeWidth={1.5} />} label="Dashboard" active />
              <NavItem icon={<Receipt size={18} strokeWidth={1.5} />} label="Expenses" />
              <NavItem icon={<CheckSquare size={18} strokeWidth={1.5} />} label="Chores" />
              <NavItem icon={<PieChart size={18} strokeWidth={1.5} />} label="Rent Split" />
              <NavItem icon={<BookOpen size={18} strokeWidth={1.5} />} label="House Rules" />
              <NavItem icon={<Settings size={18} strokeWidth={1.5} />} label="Settings" />
            </nav>
          </div>
          
          <div className="px-4">
            <NavItem icon={<Building2 size={18} strokeWidth={1.5} />} label="Landlord Portal" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-16 overflow-y-auto">
          <header className="mb-24 flex items-baseline justify-between border-b border-black/10 pb-8">
            <h2 className="text-4xl font-serif-display tracking-tight">Household Summary</h2>
            <div className="text-sm font-medium tracking-widest uppercase text-black/40">October 2023</div>
          </header>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-12 mb-24">
            <MetricCard label="Total Rent" value="$4,200" />
            <MetricCard label="Pending Expenses" value="$842.15" />
            <MetricCard label="Overdue Chores" value="1" highlight />
            <MetricCard label="Members" value="3" />
          </div>

          <div className="grid grid-cols-2 gap-24">
            {/* Rent Status */}
            <section>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-6 border-b border-black/10 pb-4">Rent Status</h3>
              <ul className="flex flex-col">
                <StatusRow name="Jordan" amount="$1,600" status="Paid" isPaid />
                <StatusRow name="Priya" amount="$1,400" status="Pending" />
                <StatusRow name="Marcus" amount="$1,200" status="Pending" />
              </ul>
            </section>

            {/* Recent Expenses */}
            <section>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-6 border-b border-black/10 pb-4">Recent Expenses</h3>
              <ul className="flex flex-col">
                <ExpenseRow merchant="Whole Foods" amount="$186.40" date="Oct 12" />
                <ExpenseRow merchant="PG&E" amount="$124.00" date="Oct 10" />
                <ExpenseRow merchant="Comcast" amount="$89.00" date="Oct 08" />
                <ExpenseRow merchant="Cleaning" amount="$42.75" date="Oct 05" />
              </ul>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${active ? 'text-black' : 'text-black/50 hover:text-black'}`}>
      {icon}
      {label}
    </a>
  );
}

function MetricCard({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className={`font-serif-display text-6xl xl:text-7xl mb-4 tracking-tighter ${highlight ? 'text-red-600' : 'text-black'}`}>
        {value}
      </div>
      <div className="h-px bg-black/10 w-full mb-3" />
      <div className="text-xs font-bold tracking-widest uppercase text-black/60">
        {label}
      </div>
    </div>
  );
}

function StatusRow({ name, amount, status, isPaid = false }: { name: string, amount: string, status: string, isPaid?: boolean }) {
  return (
    <li className="flex justify-between items-center py-4 border-b border-black/5 last:border-0">
      <span className="font-serif-display text-2xl">{name}</span>
      <div className="flex items-center gap-6">
        <span className="font-serif-display text-2xl">{amount}</span>
        <span className={`text-xs font-bold tracking-widest uppercase w-20 text-right ${isPaid ? 'text-green-700' : 'text-red-600'}`}>
          {status}
        </span>
      </div>
    </li>
  );
}

function ExpenseRow({ merchant, amount, date }: { merchant: string, amount: string, date: string }) {
  return (
    <li className="flex justify-between items-center py-4 border-b border-black/5 last:border-0">
      <div className="flex flex-col">
        <span className="font-serif-display text-2xl">{merchant}</span>
        <span className="text-xs font-bold tracking-widest uppercase text-black/40 mt-1">{date}</span>
      </div>
      <span className="font-serif-display text-2xl">{amount}</span>
    </li>
  );
}

export default Editorial;
