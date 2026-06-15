import React, { useState } from "react";
import {
  Home,
  LayoutDashboard,
  Wallet,
  CheckSquare,
  Users,
  Settings,
  ArrowRight,
  Send,
  AlertCircle,
  Clock,
  Home as HomeIcon,
  MessageSquare,
  DollarSign
} from "lucide-react";

export function HouseAI() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen flex w-full bg-white font-sans text-gray-900">
      {/* Sidebar */}
      <div className="w-[240px] flex-shrink-0 flex flex-col" style={{ backgroundColor: "#3c2a21" }}>
        <div className="p-6 flex items-center gap-3 text-white">
          <div className="w-8 h-8 rounded-lg bg-[#cc7a59] flex items-center justify-center">
            <HomeIcon size={18} />
          </div>
          <span className="font-semibold text-lg tracking-tight">Roomly</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem icon={<MessageSquare size={18} />} label="House AI" active />
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem icon={<Wallet size={18} />} label="Expenses" />
          <NavItem icon={<CheckSquare size={18} />} label="Chores" />
          <NavItem icon={<Users size={18} />} label="Roommates" />
        </nav>

        <div className="p-4">
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-w-0">
        
        {/* Left Column: Chat Thread */}
        <div className="flex-1 flex flex-col relative max-w-[65%] border-r border-gray-100">
          
          <div className="flex-1 overflow-y-auto p-6 pb-40 space-y-8">
            
            {/* Maple Message 1 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white" style={{ backgroundColor: "#cc7a59" }}>
                <HomeIcon size={20} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="bg-[#fdf8f3] text-gray-800 p-4 rounded-2xl rounded-tl-none inline-block max-w-[90%] shadow-sm">
                  <p className="text-[15px] leading-relaxed">
                    Good morning, Jordan! Here's what's happening at The Castro House today.
                  </p>
                </div>
                
                {/* Rich Card */}
                <div className="bg-white border border-[#ebdccc] rounded-xl p-5 shadow-sm max-w-[90%] space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-amber-500"><AlertCircle size={18} /></div>
                      <div>
                        <p className="text-[14px] font-medium text-gray-900">Priya's bathroom chore is 2 days overdue</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-red-500"><DollarSign size={18} /></div>
                      <div>
                        <p className="text-[14px] font-medium text-gray-900">$842.15 in expenses need to be settled</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-blue-500"><Home size={18} /></div>
                      <div>
                        <p className="text-[14px] font-medium text-gray-900">Rent due in 12 days <span className="text-gray-500 font-normal">($2,600 still needed)</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button className="text-[13px] font-medium text-[#cc7a59] flex items-center gap-1 hover:text-[#b86948] transition-colors">
                      Settle expenses <ArrowRight size={14} />
                    </button>
                    <button className="text-[13px] font-medium text-gray-500 flex items-center gap-1 hover:text-gray-700 transition-colors ml-2">
                      Remind Priya <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Message 1 */}
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-200 text-gray-600 font-medium text-sm">
                JO
              </div>
              <div className="flex-1 flex flex-col items-end">
                <div className="text-white p-4 rounded-2xl rounded-tr-none inline-block max-w-[85%] shadow-sm" style={{ backgroundColor: "#3c2a21" }}>
                  <p className="text-[15px] leading-relaxed">
                    How much does Marcus owe?
                  </p>
                </div>
              </div>
            </div>

            {/* Maple Message 2 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white" style={{ backgroundColor: "#cc7a59" }}>
                <HomeIcon size={20} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="bg-[#fdf8f3] text-gray-800 p-4 rounded-2xl rounded-tl-none inline-block max-w-[90%] shadow-sm">
                  <p className="text-[15px] leading-relaxed">
                    Marcus owes <strong>$280.71</strong> total.
                  </p>
                </div>
                
                {/* Rich Card */}
                <div className="bg-white border border-[#ebdccc] rounded-xl p-5 shadow-sm max-w-[90%] space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-gray-600">Whole Foods split</span>
                      <span className="font-medium text-gray-900">$62.13 <span className="text-gray-400 font-normal ml-1">to Priya</span></span>
                    </div>
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-gray-600">Cleaning supplies</span>
                      <span className="font-medium text-gray-900">$14.25 <span className="text-gray-400 font-normal ml-1">to Jordan</span></span>
                    </div>
                    <div className="flex justify-between items-center text-[14px]">
                      <span className="text-gray-600">October rent</span>
                      <span className="font-medium text-gray-900">$1,200 <span className="text-gray-400 font-normal ml-1">unpaid</span></span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <button className="text-[13px] font-medium text-[#cc7a59] flex items-center gap-1 hover:text-[#b86948] transition-colors">
                      Send Marcus a reminder <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Message 2 */}
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-200 text-gray-600 font-medium text-sm">
                JO
              </div>
              <div className="flex-1 flex flex-col items-end">
                <div className="text-white p-4 rounded-2xl rounded-tr-none inline-block max-w-[85%] shadow-sm" style={{ backgroundColor: "#3c2a21" }}>
                  <p className="text-[15px] leading-relaxed">
                    Who did the kitchen last?
                  </p>
                </div>
              </div>
            </div>

            {/* Maple Message 3 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white" style={{ backgroundColor: "#cc7a59" }}>
                <HomeIcon size={20} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="bg-[#fdf8f3] text-gray-800 p-4 rounded-2xl rounded-tl-none inline-block max-w-[90%] shadow-sm">
                  <p className="text-[15px] leading-relaxed">
                    Jordan completed Kitchen & Dishes yesterday at 10:23am. Next rotation: Priya on October 17th.
                  </p>
                </div>
                
                <div className="bg-white border border-[#ebdccc] rounded-xl py-3 px-4 shadow-sm inline-block max-w-[90%]">
                  <button className="text-[13px] font-medium text-[#cc7a59] flex items-center gap-1 hover:text-[#b86948] transition-colors">
                    View full chore schedule <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Composer Box */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-white/0 pt-10 pb-6 px-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <SuggestionChip text="Who owes what?" />
              <SuggestionChip text="When is rent due?" />
              <SuggestionChip text="Mark chore done" />
              <SuggestionChip text="Add expense" />
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Maple anything..." 
                className="w-full bg-white border border-gray-200 rounded-full py-4 pl-6 pr-14 text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#cc7a59]/20 focus:border-[#cc7a59]"
              />
              <button className="absolute right-2 top-2 bottom-2 w-10 bg-[#cc7a59] text-white rounded-full flex items-center justify-center hover:bg-[#b86948] transition-colors">
                <Send size={18} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Context Panel */}
        <div className="w-[35%] bg-[#f8f8f8] border-l border-gray-100 p-8 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">House status</h2>
            <p className="text-sm text-gray-500 mt-1">Live context for The Castro House</p>
          </div>

          <div className="space-y-4 mb-10">
            {/* Rent Card */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Home size={16} className="text-gray-400" />
                  <span className="font-semibold text-gray-900">Rent</span>
                </div>
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">Oct 15</span>
              </div>
              <div className="mb-2 flex justify-between items-baseline">
                <span className="text-2xl font-bold text-gray-900">$4,200</span>
                <span className="text-sm text-gray-500">total</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div className="bg-amber-400 h-2 rounded-full" style={{ width: '38%' }}></div>
              </div>
              <p className="text-xs text-gray-500">$1,600 paid • $2,600 remaining</p>
            </div>

            {/* Expenses Card */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-gray-400" />
                  <span className="font-semibold text-gray-900">Expenses</span>
                </div>
                <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-1 rounded-md border border-red-200">4 unsettled</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold text-gray-900">$842.15</span>
                <span className="text-sm text-red-500 font-medium">pending</span>
              </div>
            </div>

            {/* Chores Card */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare size={16} className="text-gray-400" />
                  <span className="font-semibold text-gray-900">Chores</span>
                </div>
                <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-md border border-amber-200">1 overdue</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold text-gray-900">4</span>
                <span className="text-sm text-gray-500 font-medium">active tasks</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Members</h3>
            <div className="space-y-3">
              <MemberItem initials="JK" name="Jordan K." status="green" statusText="All caught up" />
              <MemberItem initials="PS" name="Priya S." status="amber" statusText="1 chore overdue" />
              <MemberItem initials="MW" name="Marcus W." status="gray" statusText="Rent pending" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-[14px] font-medium ${
      active 
        ? "bg-white/10 text-white" 
        : "text-white/60 hover:text-white hover:bg-white/5"
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SuggestionChip({ text }: { text: string }) {
  return (
    <button className="bg-white border border-[#ebdccc] hover:bg-[#fdf8f3] text-gray-700 text-[13px] px-3 py-1.5 rounded-full transition-colors whitespace-nowrap shadow-sm font-medium">
      {text}
    </button>
  );
}

function MemberItem({ initials, name, status, statusText }: { initials: string, name: string, status: 'green' | 'amber' | 'gray', statusText: string }) {
  const statusColors = {
    green: "bg-green-500",
    amber: "bg-amber-500",
    gray: "bg-gray-300"
  };

  return (
    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm">
          {initials}
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[status]}`}></div>
      </div>
      <div>
        <div className="text-[14px] font-semibold text-gray-900">{name}</div>
        <div className="text-[12px] text-gray-500">{statusText}</div>
      </div>
    </div>
  );
}
