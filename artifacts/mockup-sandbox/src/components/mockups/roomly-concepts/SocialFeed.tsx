import React, { useState } from "react";
import { 
  Home, 
  ReceiptText, 
  Sparkles, 
  Users, 
  Settings, 
  MessageSquare,
  AlertCircle,
  Clock,
  Send
} from "lucide-react";

export function SocialFeed() {
  const [note, setNote] = useState("");

  const feedItems = [
    {
      id: 1,
      type: 'expense',
      icon: '🧾',
      member: 'Priya',
      initials: 'PS',
      color: 'bg-blue-600',
      actionText: 'paid $186.40 for groceries',
      time: 'Today 9:41am',
      button: 'Mark as split',
      isOverdue: false
    },
    {
      id: 2,
      type: 'chore',
      icon: '✅',
      member: 'Jordan',
      initials: 'JK',
      color: 'bg-[#c2410c]',
      actionText: 'completed Kitchen & Dishes',
      time: 'Yesterday',
      button: 'Nice work!',
      isOverdue: false
    },
    {
      id: 3,
      type: 'expense',
      icon: '💸',
      member: 'Marcus',
      initials: 'MW',
      color: 'bg-green-600',
      actionText: 'paid $89 for Comcast internet',
      time: 'Oct 2',
      button: 'Mark as split',
      isOverdue: false
    },
    {
      id: 4,
      type: 'alert',
      icon: '⚠️',
      member: 'Priya',
      initials: 'PS',
      color: 'bg-blue-600',
      actionText: "'s Bathrooms chore is overdue",
      time: '2 days',
      button: 'Send reminder',
      isOverdue: true
    },
    {
      id: 5,
      type: 'system',
      icon: '🏠',
      member: 'System',
      initials: 'R',
      color: 'bg-stone-800',
      actionText: 'Rent is due in 12 days — $4,200 total',
      time: 'Oct 1',
      button: 'View breakdown',
      isOverdue: false
    },
    {
      id: 6,
      type: 'payment',
      icon: '💰',
      member: 'Jordan',
      initials: 'JK',
      color: 'bg-[#c2410c]',
      actionText: 'paid $400 for October rent',
      time: 'Sep 28',
      button: '✓ Confirmed',
      isOverdue: false,
      buttonDisabled: true
    },
    {
      id: 7,
      type: 'expense',
      icon: '🧹',
      member: 'Jordan',
      initials: 'JK',
      color: 'bg-[#c2410c]',
      actionText: 'Cleaning supplies purchased — $42.75',
      time: 'Sep 28 • Paid by Jordan',
      button: 'View',
      isOverdue: false
    },
    {
      id: 8,
      type: 'milestone',
      icon: '🎉',
      member: 'System',
      initials: 'R',
      color: 'bg-stone-800',
      actionText: 'The Castro House has been 30 days streak of no overdue chores!',
      time: 'Sep 15',
      button: 'Celebrate',
      isOverdue: false
    }
  ];

  return (
    <div className="min-h-screen flex bg-[#fdfaf6] text-stone-900 font-sans">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#3c2a21] text-stone-300 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-2 text-[#fdfaf6] font-semibold text-lg tracking-tight mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#c2410c] flex items-center justify-center text-white">
              R
            </div>
            Roomly
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-[#fdfaf6] bg-white/10 rounded-md font-medium transition-colors">
              <MessageSquare className="w-4 h-4" />
              Activity
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 hover:text-[#fdfaf6] hover:bg-white/5 rounded-md font-medium transition-colors">
              <ReceiptText className="w-4 h-4" />
              Expenses
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 hover:text-[#fdfaf6] hover:bg-white/5 rounded-md font-medium transition-colors">
              <Sparkles className="w-4 h-4" />
              Chores
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 hover:text-[#fdfaf6] hover:bg-white/5 rounded-md font-medium transition-colors">
              <Home className="w-4 h-4" />
              Rent Split
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 hover:text-[#fdfaf6] hover:bg-white/5 rounded-md font-medium transition-colors">
              <Users className="w-4 h-4" />
              House Rules
            </a>
          </nav>
        </div>
        
        <div className="mt-auto p-6">
          <a href="#" className="flex items-center gap-3 px-3 py-2 hover:text-[#fdfaf6] hover:bg-white/5 rounded-md font-medium transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar - Urgent Items */}
        <header className="px-6 py-4 border-b border-stone-200 bg-white/50 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-sm font-medium border border-red-100">
            <AlertCircle className="w-4 h-4" />
            1 overdue chore
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium border border-amber-100">
            <Clock className="w-4 h-4" />
            Rent due in 12 days
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 text-sm font-medium border border-stone-200">
            <ReceiptText className="w-4 h-4" />
            3 unsettled expenses
          </div>
        </header>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-6">
            <div className="flex flex-col">
              {feedItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`group flex items-start gap-4 px-6 py-4 border-b border-stone-100 transition-colors ${
                    item.isOverdue ? 'bg-rose-50/50' : 'hover:bg-white/50'
                  }`}
                >
                  <div className="relative pt-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm ${item.color}`}>
                      {item.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-100 text-xs">
                      {item.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-stone-900">
                        {item.type !== 'system' && item.type !== 'milestone' ? item.member : ''}
                      </span>
                      <span className="text-stone-700">
                        {item.actionText}
                      </span>
                    </div>
                    <div className="text-sm text-stone-500 mt-0.5">
                      {item.time}
                    </div>
                  </div>
                  
                  <div className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button 
                      className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                        item.buttonDisabled 
                          ? 'text-stone-400 cursor-default' 
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                      disabled={item.buttonDisabled}
                    >
                      {item.button}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="py-8 text-center text-stone-400 text-sm">
              End of activity
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="p-4 border-t border-stone-200 bg-white">
          <div className="max-w-3xl mx-auto flex gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c2410c] flex items-center justify-center text-white font-medium flex-shrink-0">
              ME
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Note to housemates..."
                className="w-full pl-4 pr-12 py-2.5 rounded-full border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#c2410c] focus:border-transparent bg-[#fdfaf6]"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#c2410c] text-white hover:bg-[#a0360a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
