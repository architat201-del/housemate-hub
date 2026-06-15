import { useHousehold } from "@/components/household-context";
import {
  useListChores,
  getListChoresQueryKey,
  useGetChoreSchedule,
  getGetChoreScheduleQueryKey,
  useCompleteChore,
  ChoreScheduleItem
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ListTodo, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { CreateChoreDialog } from "./create-chore-dialog";

export default function Chores() {
  const householdId = useHousehold();
  const queryClient = useQueryClient();

  const { data: chores, isLoading: loadingChores } = useListChores(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getListChoresQueryKey(householdId)
    }
  });

  const { data: schedule, isLoading: loadingSchedule } = useGetChoreSchedule(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getGetChoreScheduleQueryKey(householdId)
    }
  });

  const completeMutation = useCompleteChore({
    mutation: {
      onSuccess: () => {
        toast.success("Chore completed! Great job.");
        queryClient.invalidateQueries({ queryKey: getListChoresQueryKey(householdId) });
        queryClient.invalidateQueries({ queryKey: getGetChoreScheduleQueryKey(householdId) });
      },
      onError: () => {
        toast.error("Failed to mark chore as complete.");
      }
    }
  });

  const handleComplete = (choreId: number, memberId: number) => {
    completeMutation.mutate({
      choreId,
      data: {
        completedByMemberId: memberId,
      }
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Chores</h1>
          <p className="text-muted-foreground mt-1">Manage the household rotation.</p>
        </div>
        <CreateChoreDialog householdId={householdId} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Upcoming Schedule</h2>
          {loadingSchedule ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : schedule && schedule.length > 0 ? (
            <div className="space-y-4">
              {schedule.map((item: ChoreScheduleItem, i: number) => {
                const isOverdue = new Date(item.dueDate) < new Date();
                return (
                  <Card key={`${item.choreId}-${i}`} className={isOverdue ? "border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/10" : ""}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isOverdue ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-primary/10 text-primary'}`}>
                          <ListTodo className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{item.choreTitle}</h3>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <span className="font-medium">{item.assigneeName}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className={`text-muted-foreground ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                              Due {format(new Date(item.dueDate), "MMM d")}
                            </span>
                            {isOverdue && <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant={isOverdue ? "default" : "outline"}
                        className={isOverdue ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                        disabled={completeMutation.isPending}
                        onClick={() => handleComplete(item.choreId, item.assigneeMemberId)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Done
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
             <Card>
               <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                 <ListTodo className="w-12 h-12 mb-4 opacity-20" />
                 <p>No upcoming chores.</p>
               </CardContent>
             </Card>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">All Chores</h2>
          {loadingChores ? (
            <Skeleton className="h-64" />
          ) : chores && chores.length > 0 ? (
            <div className="space-y-4">
              {chores.map((chore) => (
                <Card key={chore.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{chore.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{chore.description}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize">{chore.frequency}</Badge>
                    </div>
                    <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                      <div>
                        Next up: <span className="font-medium text-foreground">
                           {/* Assuming we have members mapping to show name, but we only have ID here right now.
                               For full functionality, we should fetch members and display the currentAssigneeName */}
                           Member {chore.currentAssigneeMemberId}
                        </span>
                      </div>
                      {chore.lastCompletedAt && (
                        <div>Last done: {format(new Date(chore.lastCompletedAt), "MMM d")}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                <ListTodo className="w-12 h-12 mb-4 opacity-20" />
                <p>No chores created yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
