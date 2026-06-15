import React, { useState } from "react";
import { 
  Home, 
  CreditCard, 
  CheckSquare, 
  PieChart, 
  FileText, 
  Settings,
  Bell,
  Search,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

// Hardcoded data
const rooms = [
  {
    id: "kitchen",
    name: "Kitchen",
    icon: "🍳",
    color: "bg-orange-100 text-orange-600",
    chore: { text: "Kitchen & Dishes — Jordan", status: "done" },
    spend: "$42.75 cleaning supplies",
    badge: { text: "All good", status: "success" }
  },
  {
    id: "bathrooms",
    name: "Bathrooms",
    icon: "🛁",
    color: "bg-blue-100 text-blue-600",
    chore: { text: "Bathrooms — Priya", status: "overdue" },
    cta: "Send reminder →",
    badge: { text: "Needs attention", status: "danger" }
  },
  {
    id: "living",
    name: "Living Room",
    icon: "🛋️",
    color: "bg-green-100 text-green-600",
    chore: { text: "Vacuum — Marcus", status: "pending" },
    spend: "$89 Comcast · $186 groceries",
    badge: { text: "In progress", status: "warning" }
  },
  {
    id: "bedrooms",
    name: "Bedrooms",
    icon: "🛏️",
    color: "bg-indigo-100 text-indigo-600",
    customContent: (
      <div className="text-sm space-y-1 mt-2">
        <div className="flex justify-between items-center text-gray-600"><span className="flex items-center gap-1">Jordan <CheckCircle2 className="w-3 h-3 text-green-500" /></span> <span>$1,600</span></div>
        <div className="flex justify-between items-center text-gray-600"><span className="flex items-center gap-1">Priya <Clock className="w-3 h-3 text-amber-500" /></span> <span>$1,400</span></div>
        <div className="flex justify-between items-center text-gray-600"><span className="flex items-center gap-1">Marcus <Clock className="w-3 h-3 text-amber-500" /></span> <span>$1,200</span></div>
      </div>
    ),
    badge: { text: "2 rents pending", status: "warning" }
  },
  {
    id: "utilities",
    name: "Laundry / Utilities",
    icon: "🧺",
    color: "bg-purple-100 text-purple-600",
    customContent: (
      <div className="text-sm space-y-1 mt-2">
        <div className="flex justify-between text-gray-600"><span>PG&E (split 3 ways)</span> <span>$124.00</span></div>
        <div className="flex justify-between text-gray-600"><span>Comcast (split 3 ways)</span> <span>$89.00</span></div>
      </div>
    ),
    badge: { text: "Split needed", status: "warning" }
  },
  {
    id: "common",
    name: "Common Areas",
    icon: "🏡",
    color: "bg-teal-100 text-teal-600",
    customContent: (
      <div className="text-sm space-y-1 mt-2">
        <div className="text-gray-600">Cleaning supplies: $42.75</div>
        <div className="text-gray-600">Last cleaned: Yesterday</div>
      </div>
    ),
    badge: { text: "All good", status: "success" }
  }
];

export function RoomMap() {
  const [selectedRoom, setSelectedRoom] = useState("kitchen");

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3c2a21] text-[#e8e4e1] flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 font-serif text-2xl tracking-tight text-white mb-10">
            <Home className="w-6 h-6" />
            Roomly
          </div>
          
          <nav className="space-y-1">
            <NavItem icon={<Home className="w-5 h-5" />} label="Dashboard" active />
            <NavItem icon={<CreditCard className="w-5 h-5" />} label="Expenses" />
            <NavItem icon={<CheckSquare className="w-5 h-5" />} label="Chores" />
            <NavItem icon={<PieChart className="w-5 h-5" />} label="Rent Split" />
            <NavItem icon={<FileText className="w-5 h-5" />} label="House Rules" />
          </nav>
        </div>
        <div className="mt-auto p-6">
          <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-start justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-serif">The Castro House</h1>
            <p className="text-gray-500 mt-1">2847 Castro St, Apt 3, San Francisco</p>
          </div>
          <div className="flex gap-3">
            <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Rent due Oct 15
            </div>
            <div className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-200 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              $842.15 unsettled
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {rooms.map((room) => {
              const isSelected = selectedRoom === room.id;
              return (
                <div 
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={cn(
                    "bg-white rounded-xl p-5 cursor-pointer transition-all border-2",
                    isSelected 
                      ? "border-[#c2410c] shadow-md ring-4 ring-[#c2410c]/10" 
                      : "border-transparent shadow-sm hover:shadow-md hover:border-gray-200"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-2xl", room.color)}>
                        {room.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">{room.name}</h3>
                    </div>
                    <Badge status={room.badge.status} text={room.badge.text} />
                  </div>
                  
                  <div className="min-h-[4rem]">
                    {room.chore && (
                      <div className="text-sm text-gray-600 mb-2 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-gray-400" />
                        {room.chore.text} 
                        {room.chore.status === 'done' && " ✅"}
                        {room.chore.status === 'overdue' && " ⚠️ OVERDUE"}
                        {room.chore.status === 'pending' && " ⏳"}
                      </div>
                    )}
                    {room.spend && (
                      <div className="text-sm text-gray-600 mb-2 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        {room.spend}
                      </div>
                    )}
                    {room.customContent}
                    {room.cta && (
                      <button className="mt-3 text-sm font-medium text-[#c2410c] hover:text-[#a0360a] flex items-center gap-1">
                        {room.cta}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Master Detail Panel */}
          {selectedRoom === "kitchen" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#fff8f6] border-b border-[#fceee9] px-6 py-4 flex items-center gap-3">
                <span className="text-2xl">🍳</span>
                <h2 className="text-xl font-semibold text-gray-900">Kitchen Details</h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Chores & Maintenance</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Kitchen & Dishes</p>
                        <p className="text-sm text-gray-500">Jordan completed yesterday</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Take out trash</p>
                        <p className="text-sm text-gray-500">Up next: Priya (due Thursday)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Expenses</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg">🧽</div>
                        <div>
                          <p className="font-medium text-gray-900">Target</p>
                          <p className="text-xs text-gray-500">Cleaning supplies</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">$42.75</p>
                        <p className="text-xs text-green-600">Settled</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">💧</div>
                        <div>
                          <p className="font-medium text-gray-900">Brita Filters</p>
                          <p className="text-xs text-gray-500">Amazon</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">$24.99</p>
                        <p className="text-xs text-amber-600">Pending split</p>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Add Kitchen Expense
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm",
        active 
          ? "bg-white/10 text-white" 
          : "text-[#e8e4e1]/70 hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      {label}
    </a>
  );
}

function Badge({ status, text }: { status: string, text: string }) {
  const styles = {
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
  };
  
  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-medium",
      styles[status as keyof typeof styles]
    )}>
      {text}
    </span>
  );
}
