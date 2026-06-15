import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateRoom, getListRoomsQueryKey } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  monthlyRent: z.coerce.number().min(0, "Must be >= 0"),
  description: z.string().optional(),
});

export function CreateRoomDialog({ householdId }: { householdId: number }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", monthlyRent: 0, description: "" },
  });

  const createMutation = useCreateRoom({
    mutation: {
      onSuccess: () => {
        toast.success("Room added");
        queryClient.invalidateQueries({ queryKey: getListRoomsQueryKey(householdId) });
        setOpen(false);
        form.reset();
      },
      onError: () => toast.error("Failed to add room")
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Room</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(data => createMutation.mutate({ householdId, data }))} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Room Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="monthlyRent" render={({ field }) => (
              <FormItem><FormLabel>Monthly Rent</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end pt-4"><Button type="submit" disabled={createMutation.isPending}>Save</Button></div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
