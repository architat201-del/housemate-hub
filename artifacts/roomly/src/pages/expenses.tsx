import { useState } from "react";
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
  Expense
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Receipt } from "lucide-react";
import { toast } from "sonner";
import { CreateExpenseDialog } from "./create-expense-dialog";

export default function Expenses() {
  const householdId = useHousehold();
  const queryClient = useQueryClient();

  const { data: expenses, isLoading: loadingExpenses } = useListExpenses(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getListExpensesQueryKey(householdId)
    }
  });

  const { data: summary, isLoading: loadingSummary } = useGetExpenseSummary(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getGetExpenseSummaryQueryKey(householdId)
    }
  });

  const { data: balances, isLoading: loadingBalances } = useGetMemberBalances(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getGetMemberBalancesQueryKey(householdId)
    }
  });

  const { data: members, isLoading: loadingMembers } = useListMembers(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getListMembersQueryKey(householdId)
    }
  });

  const settleExpenseMutation = useSettleExpense({
    mutation: {
      onSuccess: () => {
        toast.success("Expense marked as settled.");
        queryClient.invalidateQueries({ queryKey: getListExpensesQueryKey(householdId) });
        queryClient.invalidateQueries({ queryKey: getGetMemberBalancesQueryKey(householdId) });
      },
      onError: () => {
        toast.error("Failed to settle expense.");
      }
    }
  });

  const handleSettle = (expenseId: number) => {
    settleExpenseMutation.mutate({ expenseId });
  };

  const getMemberName = (id: number) => members?.find(m => m.id === id)?.name || "Unknown";

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-1">Manage shared expenses and balances.</p>
        </div>
        <CreateExpenseDialog householdId={householdId} members={members || []} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Who Owes What</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBalances ? (
              <Skeleton className="h-24" />
            ) : balances && balances.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {balances.map(balance => (
                  <div key={balance.memberId} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: balance.avatarColor || '#333' }}
                      >
                        {balance.memberName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{balance.memberName}</div>
                        <div className="text-xs text-muted-foreground">
                          Owes: ${balance.totalOwes} • Owed: ${balance.totalOwed}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${balance.netBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {balance.netBalance >= 0 ? "+" : ""}${balance.netBalance}
                      </div>
                      <div className="text-xs text-muted-foreground">Net</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No balances found.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSummary ? (
              <Skeleton className="h-48" />
            ) : summary && summary.length > 0 ? (
              <div className="space-y-4">
                {summary.map(item => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="capitalize font-medium text-sm">{item.category}</div>
                    <div className="text-sm text-muted-foreground">${item.total} ({item.count})</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No categories yet.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Expenses</CardTitle>
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
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="whitespace-nowrap">{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                    <TableCell className="font-medium">{expense.title}</TableCell>
                    <TableCell className="capitalize">{expense.category}</TableCell>
                    <TableCell>{getMemberName(expense.paidByMemberId)}</TableCell>
                    <TableCell className="text-right font-medium">${expense.amount}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={expense.settled ? "secondary" : "outline"} className={expense.settled ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : ""}>
                        {expense.settled ? "Settled" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {!expense.settled && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSettle(expense.id)}
                          disabled={settleExpenseMutation.isPending}
                        >
                          <Check className="w-4 h-4 mr-1" />
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
              <Receipt className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No expenses yet</h3>
              <p className="text-muted-foreground">Add your first shared expense above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
