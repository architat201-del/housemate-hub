import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateExpense,
  getListExpensesQueryKey,
  getGetExpenseSummaryQueryKey,
  getGetMemberBalancesQueryKey,
  Member,
  ExpenseInputCategory,
  ExpenseInputSplitType
} from "@workspace/api-client-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  category: z.nativeEnum(ExpenseInputCategory),
  paidByMemberId: z.coerce.number().min(1, "Please select who paid"),
  splitType: z.nativeEnum(ExpenseInputSplitType),
  date: z.string().min(1, "Date is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateExpenseDialog({ householdId, members }: { householdId: number, members: Member[] }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: 0,
      category: "other",
      paidByMemberId: members?.[0]?.id || 0,
      splitType: "equal",
      date: new Date().toISOString().split('T')[0],
    },
  });

  const createMutation = useCreateExpense({
    mutation: {
      onSuccess: () => {
        toast.success("Expense created successfully.");
        queryClient.invalidateQueries({ queryKey: getListExpensesQueryKey(householdId) });
        queryClient.invalidateQueries({ queryKey: getGetExpenseSummaryQueryKey(householdId) });
        queryClient.invalidateQueries({ queryKey: getGetMemberBalancesQueryKey(householdId) });
        setOpen(false);
        form.reset();
      },
      onError: () => {
        toast.error("Failed to create expense.");
      }
    }
  });

  function onSubmit(data: FormValues) {
    createMutation.mutate({
      householdId,
      data: {
        ...data,
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Record a new shared expense for the household.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Groceries, Internet, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ExpenseInputCategory).map(cat => (
                          <SelectItem key={cat} value={cat} className="capitalize">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paidByMemberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid By</FormLabel>
                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Who paid?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map(m => (
                          <SelectItem key={m.id} value={m.id.toString()}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="splitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="How to split?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="equal">Equally among all members</SelectItem>
                      <SelectItem value="custom" disabled>Custom split (Coming soon)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={createMutation.isPending}>
                Save Expense
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}