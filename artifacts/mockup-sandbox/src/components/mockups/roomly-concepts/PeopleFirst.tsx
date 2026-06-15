import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  Settings,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { Separator } from "../../ui/separator";

export function PeopleFirst() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans text-slate-900">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Roomly</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="text-slate-900">Dashboard</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Expenses</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Chores</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Chat</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-slate-500">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-slate-200" />
          <Avatar className="w-8 h-8 border border-slate-200 cursor-pointer">
            <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">JK</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto p-6 md:p-10 gap-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">The Castro House</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Home className="w-4 h-4" /> 4822 18th St, San Francisco, CA
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-slate-500">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium text-sm w-32 text-center">October 2024</span>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-slate-500">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Person Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Jordan Kim */}
          <Card className="rounded-2xl border-0 shadow-sm overflow-hidden flex flex-col">
            <div className="h-1 w-full bg-[#c2410c]" />
            <CardContent className="p-6 flex-1 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-white shadow-sm ring-2 ring-slate-100">
                      <AvatarFallback className="bg-[#fff7ed] text-[#c2410c] text-lg font-semibold">JK</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Jordan Kim</h3>
                    <Badge variant="outline" className="mt-1 bg-slate-50 text-slate-600 font-normal border-slate-200">Admin</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-5 flex-1">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Rent</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">$1,600</span>
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0 flex gap-1 px-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-sm font-medium text-emerald-800">Balance</span>
                  <span className="font-bold text-emerald-700">+$286.02</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Chores this week</h4>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-500 line-through">Kitchen & Dishes</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Activity</h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      Paid $400 for rent
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      Paid $42.75 for cleaning supplies
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 py-2 px-3 rounded-lg font-medium text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  All good this month
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priya Sharma */}
          <Card className="rounded-2xl border-0 shadow-sm overflow-hidden flex flex-col">
            <div className="h-1 w-full bg-[#0369a1]" />
            <CardContent className="p-6 flex-1 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-white shadow-sm ring-2 ring-slate-100">
                      <AvatarFallback className="bg-[#f0f9ff] text-[#0369a1] text-lg font-semibold">PS</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Priya Sharma</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-5 flex-1">
                <div className="flex justify-between items-center bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <span className="text-sm font-medium text-slate-600">Rent</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">$1,400</span>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0 flex gap-1 px-2">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <span className="text-sm font-medium text-amber-800">Balance</span>
                  <span className="font-bold text-amber-700">-$5.31</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Chores this week</h4>
                  <div className="flex items-start gap-3 bg-red-50 p-2.5 rounded-lg border border-red-100">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-red-800 block">Bathrooms</span>
                      <span className="text-xs text-red-600 uppercase font-bold tracking-wider mt-0.5 block">Overdue</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Activity</h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      Paid $186.40 for groceries
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-red-600 bg-red-50 py-2 px-3 rounded-lg font-medium text-sm">
                  <AlertCircle className="w-4 h-4" />
                  1 item needs attention
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marcus Webb */}
          <Card className="rounded-2xl border-0 shadow-sm overflow-hidden flex flex-col">
            <div className="h-1 w-full bg-[#15803d]" />
            <CardContent className="p-6 flex-1 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-white shadow-sm ring-2 ring-slate-100">
                      <AvatarFallback className="bg-[#f0fdf4] text-[#15803d] text-lg font-semibold">MW</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Marcus Webb</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-5 flex-1">
                <div className="flex justify-between items-center bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <span className="text-sm font-medium text-slate-600">Rent</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">$1,200</span>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0 flex gap-1 px-2">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-red-50 p-3 rounded-xl border border-red-100">
                  <span className="text-sm font-medium text-red-800">Balance</span>
                  <span className="font-bold text-red-700">-$280.71</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Chores this week</h4>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm text-slate-700 block">Vacuum common areas</span>
                      <span className="text-xs text-amber-600 font-medium block mt-0.5">Pending</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Activity</h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      Paid $89 for internet
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 py-2 px-3 rounded-lg font-medium text-sm">
                  <Clock className="w-4 h-4" />
                  Rent pending, balance owed
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>

      {/* Bottom Strip */}
      <div className="bg-white border-t border-slate-200 mt-auto sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-slate-600 flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>Total rent $4,200</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span>$842.15 in unsettled expenses</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> 1 overdue chore
            </span>
          </div>
          <Button className="w-full sm:w-auto rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-sm gap-2 px-6">
            <Plus className="w-4 h-4" /> Add Expense
          </Button>
        </div>
      </div>
    </div>
  );
}
