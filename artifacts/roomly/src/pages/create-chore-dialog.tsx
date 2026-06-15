import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateChore,
  getListChoresQueryKey,
  getGetChoreScheduleQueryKey,
  useListMembers,
  getListMembersQueryKey,
  ChoreInputFrequency
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
import { Textarea } from "@/components/ui/textarea";
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
  description: z.string().optional(),
  frequency: z.nativeEnum(ChoreInputFrequency),
  currentAssigneeMemberId: z.coerce.number().min(1, "Please select an assignee"),
  nextDueDate: z.string().min(1, "Due date is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateChoreDialog({ householdId }: { householdId: number }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: members } = useListMembers(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getListMembersQueryKey(householdId)
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      frequency: "weekly",
      currentAssigneeMemberId: 0,
      nextDueDate: new Date().toISOString().split('T')[0],
    },
  });

  const createMutation = useCreateChore({
    mutation: {
      onSuccess: () => {
        toast.success("Chore created successfully.");
        queryClient.invalidateQueries({ queryKey: getListChoresQueryKey(householdId) });
        queryClient.invalidateQueries({ queryKey: getGetChoreScheduleQueryKey(householdId) });
        setOpen(false);
        form.reset();
      },
      onError: () => {
        toast.error("Failed to create chore.");
      }
    }
  });

  function onSubmit(data: FormValues) {
    if (!members) return;
    
    // For simplicity, we'll just set rotation order to all members in order
    const rotationOrder = members.map(m => m.id);
    
    createMutation.mutate({
      householdId,
      data: {
        ...data,
        rotationOrder
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Chore
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Chore</DialogTitle>
          <DialogDescription>
            Create a new chore for the rotation.
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
                    <Input placeholder="Take out trash, Vacuum, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any specific instructions..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChoreInputFrequency).map(freq => (
                          <SelectItem key={freq} value={freq} className="capitalize">
                            {freq}
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
                name="nextDueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="currentAssigneeMemberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Assignee</FormLabel>
                  <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Who does it first?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members?.map(m => (
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

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={createMutation.isPending}>
                Save Chore
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}