import React from "react";
import { 
  Home, 
  CreditCard, 
  CheckSquare, 
  PieChart, 
  FileText, 
  Settings,
  TrendingUp,
  Award,
  Zap,
  ShieldCheck,
  Flame,
  Clock
} from "lucide-react";

const ProgressRing = ({ 
  radius = 120, 
  stroke = 12, 
  progress = 82, 
  colorClass = "text-amber-400", 
  children 
}: { 
  radius?: number, 
  stroke?: number, 
  progress?: number, 
  colorClass?: string, 
  children?: React.ReactNode 
}) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90 drop-shadow-xl"
      >
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease-out" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={colorClass}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
};

export function HouseScore() {
  return (
    <div className="min-h-screen flex bg-[#0B0F19] text-slate-200 font-sans selection:bg-amber-500/30">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800/50 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Home className="w-5 h-5 text-white" />
            </div>
            Roomly
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <PieChart className="w-5 h-5" />
            Health Score
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
            <CreditCard className="w-5 h-5" />
            Expenses
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
            <CheckSquare className="w-5 h-5" />
            Chores
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
            <PieChart className="w-5 h-5" />
            Rent Split
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
            <FileText className="w-5 h-5" />
            House Rules
          </a>
        </nav>
        
        <div className="p-4 mt-auto">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-4xl mx-auto px-8 py-12">
          
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-2">Household Health</h1>
            
            <div className="flex justify-center mb-4 relative">
              {/* Subtle ambient glow behind the main ring */}
              <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-3xl transform scale-150 pointer-events-none"></div>
              
              <ProgressRing radius={140} stroke={16} progress={82} colorClass="text-gradient-to-b text-amber-400">
                <span className="text-6xl font-black text-white tracking-tighter tabular-nums drop-shadow-md">82</span>
                <span className="text-slate-400 font-medium text-lg mt-1 tracking-widest uppercase text-xs">/ 100</span>
              </ProgressRing>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              Up 4 pts from last month
            </div>
          </header>

          {/* Sub-scores */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-[#1e2130]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl">
              <h3 className="text-slate-400 font-medium text-sm mb-4">Rent</h3>
              <ProgressRing radius={45} stroke={8} progress={95} colorClass="text-emerald-400">
                <span className="text-xl font-bold text-white tabular-nums">95</span>
              </ProgressRing>
              <p className="text-emerald-400 text-sm mt-4 font-medium flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4" />
                Paid on time
              </p>
            </div>
            
            <div className="bg-[#1e2130]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl">
              <h3 className="text-slate-400 font-medium text-sm mb-4">Chores</h3>
              <ProgressRing radius={45} stroke={8} progress={72} colorClass="text-amber-500">
                <span className="text-xl font-bold text-white tabular-nums">72</span>
              </ProgressRing>
              <p className="text-amber-500 text-sm mt-4 font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                1 overdue
              </p>
            </div>
            
            <div className="bg-[#1e2130]/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl">
              <h3 className="text-slate-400 font-medium text-sm mb-4">Expenses</h3>
              <ProgressRing radius={45} stroke={8} progress={78} colorClass="text-lime-400">
                <span className="text-xl font-bold text-white tabular-nums">78</span>
              </ProgressRing>
              <p className="text-lime-400 text-sm mt-4 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Mostly settled
              </p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Housemate Scores
            </h2>
            
            <div className="space-y-3">
              {/* Rank 1 */}
              <div className="group bg-[#1e2130]/40 hover:bg-[#1e2130]/80 border border-white/5 rounded-2xl p-4 flex items-center gap-4 transition-all hover:scale-[1.01]">
                <div className="text-2xl w-8 text-center drop-shadow-md">🥇</div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-orange-900/50 border-2 border-orange-500 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Jordan&backgroundColor=ea580c`} alt="Jordan" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0B0F19] rounded-full flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-white font-bold text-lg">Jordan Kim</h3>
                    <span className="text-orange-400 font-bold tabular-nums">94 <span className="text-orange-400/50 text-sm">pts</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded">
                      <Flame className="w-3 h-3" /> 3 streak
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400">Paid rent ✓</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400">Chores ✓</span>
                  </div>
                </div>
              </div>

              {/* Rank 2 */}
              <div className="group bg-[#1e2130]/40 hover:bg-[#1e2130]/80 border border-white/5 rounded-2xl p-4 flex items-center gap-4 transition-all hover:scale-[1.01]">
                <div className="text-2xl w-8 text-center drop-shadow-md grayscale hover:grayscale-0 transition-all opacity-80">🥈</div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/50 border-2 border-emerald-500 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Marcus&backgroundColor=10b981`} alt="Marcus" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-white font-bold text-lg">Marcus Webb</h3>
                    <span className="text-emerald-400 font-bold tabular-nums">81 <span className="text-emerald-400/50 text-sm">pts</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-amber-500">Rent pending</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-emerald-400">Chores ✓</span>
                  </div>
                </div>
              </div>

              {/* Rank 3 */}
              <div className="group bg-[#1e2130]/40 hover:bg-[#1e2130]/80 border border-white/5 rounded-2xl p-4 flex items-center gap-4 transition-all hover:scale-[1.01]">
                <div className="text-2xl w-8 text-center drop-shadow-md grayscale hover:grayscale-0 transition-all opacity-60">🥉</div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-blue-900/50 border-2 border-blue-500 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Priya&backgroundColor=3b82f6`} alt="Priya" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-white font-bold text-lg">Priya Sharma</h3>
                    <span className="text-blue-400 font-bold tabular-nums">71 <span className="text-blue-400/50 text-sm">pts</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-amber-500">Rent pending</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-red-400">1 overdue chore</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Unlocked Achievements</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-3 bg-gradient-to-br from-orange-500/20 to-red-500/5 border border-orange-500/20 rounded-xl p-3 px-4 shadow-[0_0_20px_rgba(249,115,22,0.05)]">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">14-day streak</h4>
                  <p className="text-orange-200/60 text-xs">All chores completed</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/5 border border-emerald-500/20 rounded-xl p-3 px-4 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">On-time rent</h4>
                  <p className="text-emerald-200/60 text-xs">3 months straight</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/5 border border-blue-500/20 rounded-xl p-3 px-4 shadow-[0_0_20px_rgba(59,130,246,0.05)]">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Fast Settler</h4>
                  <p className="text-blue-200/60 text-xs">Expenses &lt;24hrs (5x)</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default HouseScore;
