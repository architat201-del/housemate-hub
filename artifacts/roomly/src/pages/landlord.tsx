import {
  useListLandlordHouseholds,
  getListLandlordHouseholdsQueryKey,
  useGetPaymentStats,
  getGetPaymentStatsQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Landlord() {
  const { data: households, isLoading: loadingHouseholds } = useListLandlordHouseholds({
    query: { queryKey: getListLandlordHouseholdsQueryKey() }
  });

  const { data: stats, isLoading: loadingStats } = useGetPaymentStats(1, {
    query: { queryKey: getGetPaymentStatsQueryKey(1) } // Hardcoding 1 for MVP stats view
  });

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Landlord Portal</h1>
        <p className="text-muted-foreground mt-1">Manage your properties and monitor payments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Properties</CardTitle>
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{households?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Payment Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.onTimeRate ? `${stats.onTimeRate}%` : "N/A"}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tenants</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {households?.reduce((acc, h) => acc + h.memberCount, 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Properties Overview</h2>
      
      {loadingHouseholds ? (
        <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-48" /><Skeleton className="h-48" /></div>
      ) : households && households.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {households.map(household => (
            <Card key={household.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{household.name}</CardTitle>
                    <CardDescription className="mt-1">{household.address}</CardDescription>
                  </div>
                  <Badge variant={
                    household.currentMonthStatus === 'all_paid' ? "default" : 
                    household.currentMonthStatus === 'partial' ? "secondary" : "destructive"
                  } className={
                    household.currentMonthStatus === 'all_paid' ? "bg-emerald-500" : ""
                  }>
                    {household.currentMonthStatus === 'all_paid' ? "All Paid" : 
                     household.currentMonthStatus === 'partial' ? "Partial" : "Unpaid"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Total Rent</span>
                    <span className="font-semibold">${household.totalRent}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Tenants</span>
                    <span className="font-semibold">{household.memberCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">On-Time Rate</span>
                    <span className="font-semibold">{household.onTimeRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">No properties found.</div>
      )}
    </div>
  );
}
