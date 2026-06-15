import React from "react";
import { 
  Home, 
  ShoppingCart, 
  Zap, 
  Wifi, 
  Sparkles, 
  Plane, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  Receipt,
  Wallet,
  Settings,
  Bell,
  Users,
  CheckCircle2,
  Clock
} from "lucide-react";

export function Envelopes() {
  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3c2a21] text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white shadow-sm">
            R
          </div>
          <span className="text-xl font-bold tracking-tight">Roomly</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/10 text-white font-medium">
            <LayoutDashboard size={18} />
            Budget Envelopes
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Receipt size={18} />
            Transactions
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Wallet size={18} />
            Balances
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Users size={18} />
            Housemates
          </a>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Settings size={18} />
            Settings
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900">October Budget</h1>
            <div className="flex items-center bg-gray-100 rounded-full px-1 py-1">
              <button className="p-1 rounded-full hover:bg-white hover:shadow-sm text-gray-500 transition-all">
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 text-sm font-medium text-gray-700">Oct 2024</span>
              <button className="p-1 rounded-full hover:bg-white hover:shadow-sm text-gray-500 transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center border border-blue-200">
              JK
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8 pb-24">
            
            {/* Total Summary */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Household Spending</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    $4,731.15 <span className="text-lg font-medium text-gray-400">of $5,000 budget</span>
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500 mb-1">Remaining</p>
                  <p className="text-xl font-bold text-green-600">$268.85</p>
                </div>
              </div>
              
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex mb-3">
                <div className="h-full bg-slate-600" style={{ width: '84%' }}></div>
                <div className="h-full bg-green-500" style={{ width: '3.7%' }}></div>
                <div className="h-full bg-amber-500" style={{ width: '2.5%' }}></div>
                <div className="h-full bg-blue-500" style={{ width: '2.8%' }}></div>
                <div className="h-full bg-orange-500" style={{ width: '0.8%' }}></div>
              </div>
              
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                2 envelopes over budget · 94% of total budget spent
              </p>
            </section>

            {/* Envelopes Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* 1. Rent */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden flex flex-col">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Home size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Rent</h3>
                      <p className="text-xs text-gray-500">2 pending</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">$4,200</span>
                    <span className="text-sm text-gray-500"> / $4,200</span>
                  </div>
                </div>
                
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-slate-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-gray-50 text-sm flex gap-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">JK</div>
                    <CheckCircle2 size={12} className="text-green-500" />
                    <span>$1,600</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center">PS</div>
                    <Clock size={12} className="text-amber-500" />
                    <span>$1,400</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold flex items-center justify-center">MW</div>
                    <Clock size={12} className="text-amber-500" />
                    <span>$1,200</span>
                  </div>
                </div>
              </div>

              {/* 2. Groceries */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden flex flex-col">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <ShoppingCart size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Groceries</h3>
                      <p className="text-xs text-green-600 font-medium">Within budget</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">$186.40</span>
                    <span className="text-sm text-gray-500"> / $300</span>
                  </div>
                </div>
                
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '62%' }}></div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-gray-50 text-sm flex items-center gap-2 text-gray-600">
                  <span className="text-gray-400">Paid by:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center">PS</div>
                    <span className="font-medium">Priya ($186.40)</span>
                  </div>
                </div>
              </div>

              {/* 3. Utilities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden flex flex-col">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Utilities</h3>
                      <p className="text-xs text-green-600 font-medium">Within budget</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">$124.00</span>
                    <span className="text-sm text-gray-500"> / $200</span>
                  </div>
                </div>
                
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '62%' }}></div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-gray-50 text-sm flex items-center gap-2 text-gray-600">
                  <span className="text-gray-500 truncate">PG&E electricity</span>
                  <span className="text-gray-300 mx-1">•</span>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">JK</div>
                    <span>Jordan</span>
                  </div>
                </div>
              </div>

              {/* 4. Internet & Subscriptions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden flex flex-col">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Wifi size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Internet & Subs</h3>
                      <p className="text-xs text-orange-500 font-medium">Almost full</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">$139.00</span>
                    <span className="text-sm text-gray-500"> / $150</span>
                  </div>
                </div>
                
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '93%' }}></div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-gray-50 text-sm flex items-center gap-3 text-gray-600 overflow-hidden">
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold flex items-center justify-center">MW</div>
                    <span className="truncate">Comcast $89</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">JK</div>
                    <span className="truncate">Netflix $50</span>
                  </div>
                </div>
              </div>

              {/* 5. Household Supplies */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden flex flex-col">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Household Supplies</h3>
                      <p className="text-xs text-orange-500 font-medium">Almost full</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">$42.75</span>
                    <span className="text-sm text-gray-500"> / $50</span>
                  </div>
                </div>
                
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '86%' }}></div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-gray-50 text-sm flex items-center gap-2 text-gray-600">
                  <span className="text-gray-500 truncate">Cleaning supplies</span>
                  <span className="text-gray-300 mx-1">•</span>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">JK</div>
                    <span>Jordan</span>
                  </div>
                </div>
              </div>

              {/* 6. Other / Misc */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden flex flex-col">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-400"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                      <Plane size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Other / Misc</h3>
                      <p className="text-xs text-gray-500 font-medium">Untouched</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">$0.00</span>
                    <span className="text-sm text-gray-500"> / $100</span>
                  </div>
                </div>
                
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gray-400 rounded-full" style={{ width: '0%' }}></div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-gray-50 text-sm text-gray-400 italic">
                  No transactions this month
                </div>
              </div>

            </section>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-t border-gray-200 p-4 px-8 mt-auto sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                Need to settle: <span className="text-amber-600">$842.15</span> 
              </p>
              <p className="text-sm text-gray-500">in unsettled expenses across 3 members</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">JK</div>
                <span className="font-medium text-green-600">+$286.02</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">PS</div>
                <span className="font-medium text-red-500">-$5.31</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center">MW</div>
                <span className="font-medium text-red-500">-$280.71</span>
              </div>
            </div>

            <button className="bg-[#3c2a21] hover:bg-[#2a1d17] text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap">
              Settle Up
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Envelopes;