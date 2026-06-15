import { useHousehold } from "@/components/household-context";
import { 
  useGetHouseholdDashboard, 
  getGetHouseholdDashboardQueryKey 
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Dashboard() {
  const householdId = useHousehold();
  
  const { data: dashboard, isLoading } = useGetHouseholdDashboard(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getGetHouseholdDashboardQueryKey(householdId)
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your household.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboard.totalRent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Due {dashboard.rentDueDate ? format(new Date(dashboard.rentDueDate), "MMM d") : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboard.pendingExpenseTotal}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting settlement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Chores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.overdueChores}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Needs attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.memberCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active roommates
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional dashboard sections like recent expenses, upcoming chores could go here */}
    </div>
  );
}
