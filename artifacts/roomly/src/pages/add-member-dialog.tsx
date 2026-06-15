import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAddMember, getListMembersQueryKey, MemberInputRole } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.nativeEnum(MemberInputRole),
  rentShare: z.coerce.number().min(0, "Must be >= 0"),
  moveInDate: z.string().min(1, "Move in date is required"),
  avatarColor: z.string().optional()
});

export function AddMemberDialog({ householdId }: { householdId: number }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", role: "member", rentShare: 0, moveInDate: new Date().toISOString().split('T')[0], avatarColor: "#3b82f6" },
  });

  const addMutation = useAddMember({
    mutation: {
      onSuccess: () => {
        toast.success("Member added");
        queryClient.invalidateQueries({ queryKey: getListMembersQueryKey(householdId) });
        setOpen(false);
        form.reset();
      },
      onError: () => toast.error("Failed to add member")
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><UserPlus className="w-4 h-4 mr-2" /> Add Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(data => addMutation.mutate({ householdId, data }))} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="rentShare" render={({ field }) => (
                <FormItem><FormLabel>Rent Share</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="moveInDate" render={({ field }) => (
                <FormItem><FormLabel>Move-in Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="avatarColor" render={({ field }) => (
                <FormItem><FormLabel>Avatar Color</FormLabel><FormControl><Input type="color" {...field} className="h-10 px-1 py-1" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="flex justify-end pt-4"><Button type="submit" disabled={addMutation.isPending}>Save</Button></div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
