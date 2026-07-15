import { useState } from "react";
import { useHousehold } from "@/components/household-context";
import {
  useListRooms,
  getListRoomsQueryKey,
  useListMembers,
  getListMembersQueryKey,
  useListPayments,
  getListPaymentsQueryKey,
  useDeleteRoom
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Wallet } from "lucide-react";
import { formatINR } from "@/lib/currency";
import { toast } from "sonner";
import { CreateRoomDialog } from "./create-room-dialog";
import { RecordPaymentDialog } from "./record-payment-dialog";

export default function Rent() {
  const householdId = useHousehold();
  const queryClient = useQueryClient();

  const { data: rooms, isLoading: loadingRooms } = useListRooms(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getListRoomsQueryKey(householdId)
    }
  });

  const { data: members, isLoading: loadingMembers } = useListMembers(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getListMembersQueryKey(householdId)
    }
  });

  const { data: payments, isLoading: loadingPayments } = useListPayments(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getListPaymentsQueryKey(householdId)
    }
  });

  const deleteRoomMutation = useDeleteRoom({
    mutation: {
      onSuccess: () => {
        toast.success("Room deleted");
        queryClient.invalidateQueries({ queryKey: getListRoomsQueryKey(householdId) });
      },
      onError: () => toast.error("Failed to delete room")
    }
  });

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Rent & Rooms</h1>
          <p className="text-muted-foreground mt-1">Manage room assignments and rent payments.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Rooms</CardTitle>
            <CreateRoomDialog householdId={householdId} />
          </CardHeader>
          <CardContent>
            {loadingRooms ? <Skeleton className="h-32" /> : rooms && rooms.length > 0 ? (
              <div className="space-y-4">
                {rooms.map(room => (
                  <div key={room.id} className="flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <div className="font-semibold">{room.name}</div>
                      <div className="text-sm text-muted-foreground">{room.description}</div>
                      <div className="text-sm font-medium mt-1">{formatINR(room.monthlyRent)}/mo</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteRoomMutation.mutate({ roomId: room.id })}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No rooms defined.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Member Rent Shares</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMembers ? <Skeleton className="h-32" /> : members && members.length > 0 ? (
              <div className="space-y-4">
                {members.map(member => (
                  <div key={member.id} className="flex justify-between items-center p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: member.avatarColor || '#333' }}>
                        {member.name.charAt(0)}
                      </div>
                      <div className="font-medium">{member.name}</div>
                    </div>
                    <div className="font-semibold text-lg">{formatINR(member.rentShare)}/mo</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No members found.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Payment History</CardTitle>
          <RecordPaymentDialog householdId={householdId} members={members || []} />
        </CardHeader>
        <CardContent>
          {loadingPayments ? <Skeleton className="h-64" /> : payments && payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.month}</TableCell>
                    <TableCell>{payment.memberName}</TableCell>
                    <TableCell>{formatINR(payment.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        payment.status === 'paid' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        payment.status === 'late' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.paidDate ? format(new Date(payment.paidDate), "MMM d, yyyy") : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 flex flex-col items-center">
              <Wallet className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No payments recorded.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
