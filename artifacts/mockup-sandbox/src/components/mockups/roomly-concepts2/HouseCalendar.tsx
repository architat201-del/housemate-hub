import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Home, Calendar, Users, DollarSign, Settings, Bell, CheckCircle2, AlertCircle, Clock, Search, LogOut, ChevronDown } from "lucide-react";

type EventType = "rent" | "expense" | "chore" | "payment" | "info";
type EventStatus = "done" | "pending" | "overdue" | "upcoming" | "info";

interface CalendarEvent {
  id: string;
  day: number;
  title: string;
  type: EventType;
  status: EventStatus;
  assignee?: string;
  amount?: number;
  icon?: React.ReactNode;
}

export function HouseCalendar() {
  const [view, setView] = useState<"Month" | "Week">("Month");

  const events: CalendarEvent[] = [
    { id: "e1", day: 1, title: "Rent due", type: "rent", status: "pending", amount: 2600, icon: <Home className="w-3 h-3" /> },
    { id: "e2", day: 2, title: "Comcast $89", type: "expense", status: "info", assignee: "Marcus", icon: <DollarSign className="w-3 h-3" /> },
    { id: "e3", day: 3, title: "Kitchen rotation", type: "chore", status: "done", assignee: "Jordan" },
    { id: "e4", day: 5, title: "Bathrooms rotation", type: "chore", status: "overdue", assignee: "Priya" },
    { id: "e5", day: 7, title: "Trash rotation", type: "chore", status: "done", assignee: "Marcus" },
    { id: "e6", day: 8, title: "Jordan paid rent", type: "payment", status: "done", amount: 1600 },
    { id: "e7", day: 9, title: "Groceries $186.40", type: "expense", status: "done", assignee: "Priya" },
    { id: "e8", day: 10, title: "Vacuum", type: "chore", status: "pending", assignee: "Marcus" },
    { id: "e9", day: 15, title: "Rent DEADLINE", type: "rent", status: "overdue", amount: 2600 },
    { id: "e10", day: 17, title: "Kitchen rotation", type: "chore", status: "upcoming", assignee: "Priya" },
    { id: "e11", day: 22, title: "Est. PG&E due", type: "expense", status: "upcoming" },
    { id: "e12", day: 28, title: "Bathrooms next", type: "chore", status: "info", assignee: "Marcus" },
  ];

  const daysInMonth = 31;
  const startDayOfWeek = 2; // Oct 1 2024 is a Tuesday (0=Sun, 1=Mon, 2=Tue)
  const today = 10;

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case "done": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "overdue": return "bg-red-100 text-red-800 border-red-200 font-medium";
      case "info": return "bg-blue-100 text-blue-800 border-blue-200";
      case "upcoming": return "bg-gray-100 text-gray-600 border-gray-200 border-dashed border bg-white";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: EventStatus, type: EventType) => {
    if (type === "rent") return <Home className="w-3 h-3 mr-1" />;
    if (type === "expense" || type === "payment") return <DollarSign className="w-3 h-3 mr-1" />;
    if (status === "done") return <CheckCircle2 className="w-3 h-3 mr-1" />;
    if (status === "overdue") return <AlertCircle className="w-3 h-3 mr-1" />;
    return <Clock className="w-3 h-3 mr-1" />;
  };

  const renderCells = () => {
    const cells = [];
    
    // Empty cells before start of month
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(<div key={`empty-${i}`} className="bg-gray-50/50 border-r border-b border-gray-100 h-32 md:h-40"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter(e => e.day === day);
      const isToday = day === today;
      const dayOfWeek = (startDayOfWeek + day - 1) % 7;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      cells.push(
        <div 
          key={`day-${day}`} 
          className={`
            border-r border-b border-gray-100 h-32 md:h-40 p-1 flex flex-col transition-colors
            ${isWeekend && !isToday ? 'bg-gray-50/30' : 'bg-white'}
            ${isToday ? 'ring-2 ring-inset ring-blue-400 bg-blue-50/10' : ''}
          `}
        >
          <div className="flex justify-between items-start mb-1 px-1 pt-1">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center' : 'text-gray-700'}`}>
              {day}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1 no-scrollbar px-1 pb-1">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                className={`text-xs px-2 py-1 rounded truncate flex items-center ${getStatusColor(event.status)}`}
                title={event.title}
              >
                {getStatusIcon(event.status, event.type)}
                <span className="truncate">{event.title}</span>
                {event.assignee && (
                  <span className="ml-1 opacity-75 truncate">— {event.assignee}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Fill remaining grid to complete full weeks
    const totalCells = startDayOfWeek + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 0; i < remainingCells; i++) {
      cells.push(<div key={`empty-end-${i}`} className="bg-gray-50/50 border-r border-b border-gray-100 h-32 md:h-40"></div>);
    }

    return cells;
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col hidden md:flex" style={{ backgroundColor: '#3c2a21' }}>
        <div className="p-6">
          <div className="flex items-center gap-2 text-white font-semibold text-xl tracking-tight mb-8">
            <Home className="w-6 h-6 text-amber-400" />
            <span>Roomly</span>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/10 text-white font-medium">
              <Calendar className="w-5 h-5 text-amber-400" />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium">
              <Users className="w-5 h-5" />
              Housemates
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium">
              <DollarSign className="w-5 h-5" />
              Finances
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Chores
            </a>
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t border-white/10">
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-gray-800">
                <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-semibold px-4 min-w-[200px] text-center">October 2024</h1>
                <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                1 overdue
              </div>
              <div className="flex items-center bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                <Home className="w-4 h-4 mr-2 text-amber-600" />
                Rent due Oct 15
              </div>
              <div className="flex items-center bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                3 chores this week
              </div>
            </div>

            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-inner">
              <button 
                onClick={() => setView("Month")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === "Month" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Month
              </button>
              <button 
                onClick={() => setView("Week")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === "Week" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Week
              </button>
            </div>
          </div>
        </header>

        {/* Calendar Grid */}
        <div className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/80 sticky top-0 z-10 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center py-3">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          
          <div className="grid grid-cols-7 flex-1 border-l border-t border-gray-100">
            {renderCells()}
          </div>
        </div>

        {/* Upcoming Strip */}
        <div className="bg-white border-t border-gray-200 px-8 py-4 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Upcoming
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-3 shadow-sm">
              <div className="bg-amber-100 text-amber-700 p-2 rounded-md font-bold text-center leading-none">
                <div className="text-xs uppercase">Oct</div>
                <div className="text-lg">15</div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Rent deadline</h4>
                <p className="text-sm text-gray-600 mt-0.5">$2,600 still pending</p>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-3 shadow-sm">
              <div className="bg-gray-200 text-gray-700 p-2 rounded-md font-bold text-center leading-none">
                <div className="text-xs uppercase">Oct</div>
                <div className="text-lg">17</div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Kitchen rotation</h4>
                <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-1">
                  <span className="text-gray-400">→</span> Priya
                </p>
              </div>
            </div>

            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-3 shadow-sm">
              <div className="bg-gray-200 text-gray-700 p-2 rounded-md font-bold text-center leading-none">
                <div className="text-xs uppercase">Oct</div>
                <div className="text-lg">28</div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Bathrooms rotation</h4>
                <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-1">
                  <span className="text-gray-400">→</span> Marcus
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
