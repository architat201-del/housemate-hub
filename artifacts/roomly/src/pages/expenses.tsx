import { useState, useMemo } from "react";
import { useHousehold } from "@/components/household-context";
import {
  useListExpenses,
  getListExpensesQueryKey,
  useGetExpenseSummary,
  getGetExpenseSummaryQueryKey,
  useGetMemberBalances,
  getGetMemberBalancesQueryKey,
  useListMembers,
  getListMembersQueryKey,
  useSettleExpense,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Receipt } from "lucide-react";
import { formatINR } from "@/lib/currency";
import { toast } from "sonner";
import { CreateExpenseDialog } from "./create-expense-dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  groceries:  "#4F46E5",
  utilities:  "#0891B2",
  internet:   "#7C3AED",
  streaming:  "#DB2777",
  household:  "#D97706",
  transport:  "#16A34A",
  other:      "#6B7280",
};

const CATEGORY_LABELS: Record<string, string> = {
  groceries: "Groceries",
  utilities: "Utilities",
  internet: "Internet",
  streaming: "Streaming",
  household: "Household",
  transport: "Transport",
  other: "Other",
};

export default function Expenses() {
  const householdId = useHousehold();
  const queryClient = useQueryClient();

  const { data: expenses, isLoading: loadingExpenses } = useListExpenses(householdId, {
    query: { enabled: !!householdId, queryKey: getListExpensesQueryKey(householdId) }
  });

  const { data: summary, isLoading: loadingSummary } = useGetExpenseSummary(householdId, {
    query: { enabled: !!householdId, queryKey: getGetExpenseSummaryQueryKey(householdId) }
  });

  const { data: balances, isLoading: loadingBalances } = useGetMemberBalances(householdId, {
    query: { enabled: !!householdId, queryKey: getGetMemberBalancesQueryKey(householdId) }
  });

  const { data: members } = useListMembers(householdId, {
    query: { enabled: !!householdId, queryKey: getListMembersQueryKey(householdId) }
  });

  const settleExpenseMutation = useSettleExpense({
    mutation: {
      onSuccess: () => {
        toast.success("Expense marked as settled.");
        queryClient.invalidateQueries({ queryKey: getListExpensesQueryKey(householdId) });
        queryClient.invalidateQueries({ queryKey: getGetMemberBalancesQueryKey(householdId) });
        queryClient.invalidateQueries({ queryKey: getGetExpenseSummaryQueryKey(householdId) });
      },
      onError: () => toast.error("Failed to settle expense."),
    }
  });

  const getMemberName = (id: number) => members?.find(m => m.id === id)?.name ?? "Unknown";

  // ── Monthly trend (derived client-side from expenses list) ────────────────
  const monthlyTrend = useMemo(() => {
    if (!expenses?.length) return [];
    const byMonth: Record<string, number> = {};
    for (const e of expenses) {
      const key = e.date.slice(0, 7); // "YYYY-MM"
      byMonth[key] = (byMonth[key] ?? 0) + e.amount;
    }
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, total]) => ({
        month: format(parseISO(`${month}-01`), "MMM ''yy"),
        total: Math.round(total * 100) / 100,
      }));
  }, [expenses]);

  const trendConfig: ChartConfig = {
    total: { label: "Total Spending", color: "#4F46E5" },
  };

  // ── Pie chart data from category summary ──────────────────────────────────
  const pieData = useMemo(
    () =>
      (summary ?? []).map(item => ({
        name: CATEGORY_LABELS[item.category] ?? item.category,
        value: item.total,
        color: CATEGORY_COLORS[item.category] ?? "#6B7280",
        category: item.category,
      })),
    [summary]
  );

  // ── Category bar chart config ─────────────────────────────────────────────
  const categoryBarData = useMemo(
    () =>
      (summary ?? []).map(item => ({
        category: CATEGORY_LABELS[item.category] ?? item.category,
        total: item.total,
        count: item.count,
        color: CATEGORY_COLORS[item.category] ?? "#6B7280",
      })),
    [summary]
  );

  const totalSpend = useMemo(
    () => (summary ?? []).reduce((s, i) => s + i.total, 0),
    [summary]
  );

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-1">Shared costs, balances, and spending trends.</p>
        </div>
        <CreateExpenseDialog householdId={householdId} members={members ?? []} />
      </div>

      {/* ── Who Owes What ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Who Owes What</CardTitle>
          <CardDescription>Net balances across all unsettled expenses</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingBalances ? (
            <Skeleton className="h-24" />
          ) : balances && balances.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {balances.map(balance => (
                <div key={balance.memberId} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: balance.avatarColor ?? "#333" }}
                    >
                      {balance.memberName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{balance.memberName}</div>
                      <div className="text-xs text-muted-foreground">
                        Owes {formatINR(balance.totalOwes)} · Owed {formatINR(balance.totalOwed)}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold tabular-nums ${balance.netBalance >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {balance.netBalance >= 0 ? "+" : ""}{formatINR(Math.abs(balance.netBalance))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">All settled up.</div>
          )}
        </CardContent>
      </Card>

      {/* ── Charts row ────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* Monthly Trend — spans 3 cols */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Spending Trend</CardTitle>
            <CardDescription>Total shared expenses over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingExpenses ? (
              <Skeleton className="h-52" />
            ) : monthlyTrend.length > 0 ? (
              <ChartContainer config={trendConfig} className="h-52 w-full">
                <BarChart data={monthlyTrend} barCategoryGap="30%">
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
                    width={52}
                  />
                  <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [formatINR(Number(value)), "Spending"]}
                      />
                    }
                  />
                  <Bar dataKey="total" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
                No expense data yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart — spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Spending by Category</CardTitle>
            <CardDescription>
              {totalSpend > 0 ? `${formatINR(totalSpend)} total across ${pieData.length} categories` : "All time"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {loadingSummary ? (
              <Skeleton className="h-48 w-48 rounded-full" />
            ) : pieData.length > 0 ? (
              <>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={78}
                        paddingAngle={2}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.category} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0];
                          return (
                            <div className="rounded-lg border bg-background px-3 py-2 shadow text-sm">
                              <div className="font-medium">{d.name}</div>
                              <div className="text-muted-foreground">{formatINR(Number(d.value))}</div>
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="mt-2 w-full grid grid-cols-2 gap-x-4 gap-y-1">
                  {pieData.map((d) => (
                    <div key={d.category} className="flex items-center gap-1.5 text-xs">
                      <span className="inline-block w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground truncate">{d.name}</span>
                      <span className="ml-auto font-medium tabular-nums">{totalSpend > 0 ? `${Math.round((d.value / totalSpend) * 100)}%` : ""}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-44 flex items-center justify-center text-muted-foreground text-sm">
                No spending yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Category Bar Breakdown ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category Breakdown</CardTitle>
          <CardDescription>Total spent per category across all expenses</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSummary ? (
            <Skeleton className="h-48" />
          ) : categoryBarData.length > 0 ? (
            <div className="space-y-3">
              {categoryBarData.map((item) => {
                const pct = totalSpend > 0 ? (item.total / totalSpend) * 100 : 0;
                return (
                  <div key={item.category} className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[item.category.toLowerCase()] ?? "#6B7280" }}
                        />
                        <span className="font-medium truncate">{item.category}</span>
                        <span className="text-muted-foreground text-xs ml-auto">{item.count} expense{item.count !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: CATEGORY_COLORS[item.category.toLowerCase()] ?? "#6B7280",
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums">{formatINR(item.total)}</div>
                      <div className="text-xs text-muted-foreground">{pct.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No categories yet.</div>
          )}
        </CardContent>
      </Card>

      {/* ── Expense Table ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingExpenses ? (
            <Skeleton className="h-64" />
          ) : expenses && expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Paid By</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                      {format(parseISO(expense.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">{expense.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="inline-block w-2 h-2 rounded-sm"
                          style={{ backgroundColor: CATEGORY_COLORS[expense.category] ?? "#6B7280" }}
                        />
                        <span className="capitalize text-sm">{expense.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{getMemberName(expense.paidByMemberId)}</TableCell>
                    <TableCell className="text-right font-bold tabular-nums">{formatINR(expense.amount)}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={expense.settled
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "text-muted-foreground"}
                      >
                        {expense.settled ? "Settled" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {!expense.settled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => settleExpenseMutation.mutate({ expenseId: expense.id })}
                          disabled={settleExpenseMutation.isPending}
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Settle
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 flex flex-col items-center">
              <Receipt className="w-12 h-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium">No expenses yet</h3>
              <p className="text-muted-foreground text-sm mt-1">Log your first shared expense to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
