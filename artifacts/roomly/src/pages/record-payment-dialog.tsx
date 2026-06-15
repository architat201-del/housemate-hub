import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRecordPayment, getListPaymentsQueryKey, Member, PaymentInputStatus } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const formSchema = z.object({
  memberId: z.coerce.number().min(1, "Member is required"),
  amount: z.coerce.number().min(0, "Must be >= 0"),
  month: z.string().min(1, "Month is required"),
  status: z.nativeEnum(PaymentInputStatus),
  paidDate: z.string().optional(),
});

export function RecordPaymentDialog({ householdId, members }: { householdId: number, members: Member[] }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { memberId: members?.[0]?.id || 0, amount: 0, month: new Date().toISOString().slice(0, 7), status: 'paid', paidDate: new Date().toISOString().split('T')[0] },
  });

  const recordMutation = useRecordPayment({
    mutation: {
      onSuccess: () => {
        toast.success("Payment recorded");
        queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey(householdId) });
        setOpen(false);
        form.reset();
      },
      onError: () => toast.error("Failed to record payment")
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Record Payment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(data => recordMutation.mutate({ householdId, data: { ...data, dueDate: undefined } }))} className="space-y-4">
            <FormField control={form.control} name="memberId" render={({ field }) => (
              <FormItem>
                <FormLabel>Member</FormLabel>
                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value.toString()}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {members.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amount" render={({ field }) => (
              <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="month" render={({ field }) => (
              <FormItem><FormLabel>Month (YYYY-MM)</FormLabel><FormControl><Input type="month" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="paidDate" render={({ field }) => (
              <FormItem><FormLabel>Paid Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end pt-4"><Button type="submit" disabled={recordMutation.isPending}>Save</Button></div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
