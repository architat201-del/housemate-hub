import React from 'react';
import { 
  Home, 
  Receipt, 
  Sparkles, 
  PieChart, 
  ScrollText, 
  Settings, 
  Building,
  DollarSign,
  AlertCircle,
  Users,
  CheckCircle2,
  Calendar,
  MoreHorizontal,
  Plus
} from 'lucide-react';

export function WarmHome() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
      `}</style>
      <div className="min-h-screen flex font-['DM_Sans',sans-serif] bg-[#fdfaf6] text-[#4a3f35]">
        
        {/* Sidebar */}
        <aside className="w-[220px] bg-[#3c2a21] text-[#e5d5c5] flex flex-col shadow-xl z-10 shrink-0">
          <div className="p-6">
            <div className="flex items-center gap-3 text-[#f9dec9] font-bold text-xl mb-8">
              <div className="w-8 h-8 rounded-lg bg-[#c2410c] flex items-center justify-center shadow-inner">
                <Home size={18} className="text-[#fdfaf6]" />
              </div>
              Roomly
            </div>

            <nav className="space-y-1.5">
              <NavItem icon={<Home size={18} />} label="Dashboard" active />
              <NavItem icon={<Receipt size={18} />} label="Expenses" />
              <NavItem icon={<Sparkles size={18} />} label="Chores" />
              <NavItem icon={<PieChart size={18} />} label="Rent Split" />
              <NavItem icon={<ScrollText size={18} />} label="House Rules" />
            </nav>
          </div>

          <div className="mt-auto p-6 space-y-1.5">
            <NavItem icon={<Settings size={18} />} label="Settings" />
            <NavItem icon={<Building size={18} />} label="Landlord Portal" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-y-auto p-8 lg:p-12">
          <header className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[#8c7a6b] font-medium mb-1">Welcome home</p>
              <h1 className="text-3xl font-bold text-[#3c2a21] tracking-tight">The Maple House</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-[#f4ece3] hover:bg-[#eadecc] text-[#5e4b3c] px-4 py-2.5 rounded-full font-medium transition-colors shadow-sm">
                <Plus size={18} />
                <span>Add Expense</span>
              </button>
              <button className="w-11 h-11 rounded-full bg-[#c2410c] text-white flex items-center justify-center shadow-md hover:bg-[#a3360a] transition-colors">
                <span className="font-bold">JK</span>
              </button>
            </div>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard 
              title="Total Rent" 
              value="$4,200" 
              subtitle="Due in 12 days"
              icon={<DollarSign size={20} className="text-[#d97706]" />} 
              bgColor="bg-[#fff9f0]"
            />
            <StatCard 
              title="Pending Expenses" 
              value="$842.15" 
              subtitle="Your share: $280.71"
              icon={<Receipt size={20} className="text-[#c2410c]" />} 
              bgColor="bg-[#fff5f0]"
            />
            <StatCard 
              title="Overdue Chores" 
              value="1" 
              subtitle="Kitchen deep clean"
              icon={<AlertCircle size={20} className="text-[#b91c1c]" />} 
              bgColor="bg-[#fef2f2]"
            />
            <StatCard 
              title="Members" 
              value="3" 
              subtitle="All active"
              icon={<Users size={20} className="text-[#15803d]" />} 
              bgColor="bg-[#f0fdf4]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Chores & Members */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Chore Board */}
              <section className="bg-white rounded-[24px] p-8 shadow-sm border border-[#f0e6d8]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#3c2a21]">This Week's Chores</h2>
                  <button className="text-[#c2410c] font-medium text-sm hover:underline">View Schedule</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ChoreCard 
                    title="Kitchen & Dishes"
                    assignee="Jordan Kim"
                    assigneeColor="bg-[#c2410c]"
                    assigneeInitials="JK"
                    status="completed"
                  />
                  <ChoreCard 
                    title="Bathrooms"
                    assignee="Priya Sharma"
                    assigneeColor="bg-[#0369a1]"
                    assigneeInitials="PS"
                    status="overdue"
                  />
                  <ChoreCard 
                    title="Trash & Recycling"
                    assignee="Marcus Webb"
                    assigneeColor="bg-[#15803d]"
                    assigneeInitials="MW"
                    status="pending"
                  />
                </div>
              </section>

              {/* Members */}
              <section className="bg-white rounded-[24px] p-8 shadow-sm border border-[#f0e6d8]">
                <h2 className="text-xl font-bold text-[#3c2a21] mb-6">Housemates</h2>
                <div className="flex gap-6">
                  <MemberAvatar name="Jordan Kim" role="Admin" initials="JK" color="bg-[#c2410c]" active />
                  <MemberAvatar name="Priya Sharma" role="Member" initials="PS" color="bg-[#0369a1]" />
                  <MemberAvatar name="Marcus Webb" role="Member" initials="MW" color="bg-[#15803d]" />
                  <div className="flex flex-col items-center gap-3">
                    <button className="w-16 h-16 rounded-full border-2 border-dashed border-[#d5c5b5] flex items-center justify-center text-[#a89583] hover:border-[#c2410c] hover:text-[#c2410c] transition-colors">
                      <Plus size={24} />
                    </button>
                    <span className="font-medium text-sm text-[#8c7a6b]">Invite</span>
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column: Recent Expenses */}
            <div className="space-y-8">
              <section className="bg-[#fff9f0] rounded-[24px] p-8 shadow-sm border border-[#f5ead7] h-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#3c2a21]">Recent Expenses</h2>
                  <button className="p-2 hover:bg-[#f0e3d1] rounded-full transition-colors text-[#8c7a6b]">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <ExpenseItem 
                    title="Whole Foods" 
                    date="Today" 
                    amount="$186.40"
                    paidBy="Priya"
                    paidByInitials="PS"
                    paidByColor="bg-[#0369a1]"
                  />
                  <ExpenseItem 
                    title="PG&E Electricity" 
                    date="Yesterday" 
                    amount="$124.00"
                    paidBy="Jordan"
                    paidByInitials="JK"
                    paidByColor="bg-[#c2410c]"
                  />
                  <ExpenseItem 
                    title="Comcast Internet" 
                    date="Oct 2" 
                    amount="$89.00"
                    paidBy="Marcus"
                    paidByInitials="MW"
                    paidByColor="bg-[#15803d]"
                  />
                  <ExpenseItem 
                    title="Cleaning supplies" 
                    date="Sep 28" 
                    amount="$42.75"
                    paidBy="Jordan"
                    paidByInitials="JK"
                    paidByColor="bg-[#c2410c]"
                  />
                </div>
                
                <button className="w-full mt-8 py-3 rounded-xl border border-[#e8d6c1] text-[#a07c5a] font-medium hover:bg-[#f5ead7] transition-colors text-sm">
                  View All Expenses
                </button>
              </section>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
        active 
          ? 'bg-[#533b2f] text-[#fdfaf6] shadow-sm' 
          : 'text-[#a89583] hover:bg-[#4a352a] hover:text-[#e5d5c5]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function StatCard({ title, value, subtitle, icon, bgColor }: { title: string, value: string, subtitle: string, icon: React.ReactNode, bgColor: string }) {
  return (
    <div className={`p-6 rounded-[20px] ${bgColor} border border-white shadow-sm flex flex-col`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[#8c7a6b] font-medium text-sm">{title}</h3>
        <div className="p-2 bg-white rounded-xl shadow-sm">
          {icon}
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-bold text-[#3c2a21] mb-1">{value}</div>
        <div className="text-sm font-medium text-[#a89583]">{subtitle}</div>
      </div>
    </div>
  );
}

function ChoreCard({ title, assignee, assigneeColor, assigneeInitials, status }: { title: string, assignee: string, assigneeColor: string, assigneeInitials: string, status: 'completed' | 'pending' | 'overdue' }) {
  const isOverdue = status === 'overdue';
  const isCompleted = status === 'completed';
  
  return (
    <div className={`p-5 rounded-2xl border ${isOverdue ? 'bg-[#fef2f2] border-[#fca5a5]' : 'bg-[#faf7f2] border-[#ebdcc9]'} relative overflow-hidden group hover:shadow-md transition-shadow`}>
      {isCompleted && (
        <div className="absolute top-3 right-3 text-[#15803d]">
          <CheckCircle2 size={20} className="fill-[#15803d] text-white" />
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-full ${assigneeColor} text-white flex items-center justify-center text-xs font-bold shadow-sm`}>
          {assigneeInitials}
        </div>
        <div>
          <p className="text-xs font-medium text-[#8c7a6b]">Assigned to</p>
          <p className="text-sm font-bold text-[#3c2a21]">{assignee}</p>
        </div>
      </div>
      
      <h4 className={`font-bold text-lg mb-1 ${isCompleted ? 'text-[#8c7a6b] line-through' : 'text-[#3c2a21]'}`}>
        {title}
      </h4>
      
      {isOverdue && (
        <p className="text-xs font-bold text-[#b91c1c] uppercase tracking-wider mt-2">Overdue</p>
      )}
    </div>
  );
}

function MemberAvatar({ name, role, initials, color, active = false }: { name: string, role: string, initials: string, color: string, active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className={`w-16 h-16 rounded-full ${color} text-white flex items-center justify-center text-xl font-bold shadow-md`}>
          {initials}
        </div>
        {active && (
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      <div className="text-center">
        <p className="font-bold text-[#3c2a21] text-sm">{name}</p>
        <p className="text-xs font-medium text-[#8c7a6b]">{role}</p>
      </div>
    </div>
  );
}

function ExpenseItem({ title, date, amount, paidBy, paidByInitials, paidByColor }: { title: string, date: string, amount: string, paidBy: string, paidByInitials: string, paidByColor: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className={`w-10 h-10 rounded-full ${paidByColor} text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0`}>
        {paidByInitials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#3c2a21] truncate">{title}</p>
        <p className="text-sm text-[#8c7a6b]">Paid by {paidBy} • {date}</p>
      </div>
      <div className="font-bold text-lg text-[#3c2a21]">
        {amount}
      </div>
    </div>
  );
}
