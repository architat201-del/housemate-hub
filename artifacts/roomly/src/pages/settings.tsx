import { useHousehold } from "@/components/household-context";
import {
  useGetHousehold,
  getGetHouseholdQueryKey,
  useUpdateHousehold,
  useListMembers,
  getListMembersQueryKey,
  useRemoveMember
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Trash2, Save, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { AddMemberDialog } from "./add-member-dialog";

const householdSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  totalRent: z.coerce.number().min(0, "Rent must be >= 0"),
  leaseStart: z.string().optional(),
  leaseEnd: z.string().optional(),
  landlordName: z.string().optional(),
  landlordEmail: z.string().optional(),
});

function InviteCodeCard({ inviteCode }: { inviteCode?: string }) {
  const [copied, setCopied] = useState(false);
  if (!inviteCode) return null;
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Code</CardTitle>
        <CardDescription>Share this code so housemates can join your household.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div
            className="flex-1 font-mono text-2xl font-bold tracking-widest text-center py-4 rounded-xl"
            style={{ background: "#f5ede3", color: "#3c2a21", letterSpacing: "0.3em" }}
          >
            {inviteCode}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="h-14 w-14 flex-shrink-0"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Anyone with this code can join via the "Join household" screen after signing up.
        </p>
      </CardContent>
    </Card>
  );
}

export default function Settings() {
  const householdId = useHousehold();
  const queryClient = useQueryClient();

  const { data: household, isLoading: loadingHousehold } = useGetHousehold(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getGetHouseholdQueryKey(householdId)
    }
  });

  const { data: members, isLoading: loadingMembers } = useListMembers(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getListMembersQueryKey(householdId)
    }
  });

  const updateHouseholdMutation = useUpdateHousehold({
    mutation: {
      onSuccess: () => {
        toast.success("Settings saved");
        queryClient.invalidateQueries({ queryKey: getGetHouseholdQueryKey(householdId) });
      },
      onError: () => toast.error("Failed to save settings")
    }
  });

  const removeMemberMutation = useRemoveMember({
    mutation: {
      onSuccess: () => {
        toast.success("Member removed");
        queryClient.invalidateQueries({ queryKey: getListMembersQueryKey(householdId) });
      },
      onError: () => toast.error("Failed to remove member")
    }
  });

  const form = useForm<z.infer<typeof householdSchema>>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      name: "",
      address: "",
      totalRent: 0,
      leaseStart: "",
      leaseEnd: "",
      landlordName: "",
      landlordEmail: ""
    }
  });

  useEffect(() => {
    if (household) {
      form.reset({
        name: household.name,
        address: household.address,
        totalRent: household.totalRent,
        leaseStart: household.leaseStart ? household.leaseStart.split('T')[0] : "",
        leaseEnd: household.leaseEnd ? household.leaseEnd.split('T')[0] : "",
        landlordName: household.landlordName || "",
        landlordEmail: household.landlordEmail || ""
      });
    }
  }, [household, form]);

  const onSubmit = (data: z.infer<typeof householdSchema>) => {
    updateHouseholdMutation.mutate({ householdId, data });
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage household details and members.</p>
      </div>

      <div className="grid gap-8">
        <InviteCodeCard inviteCode={(household as any)?.inviteCode} />

        <Card>
          <CardHeader>
            <CardTitle>Household Details</CardTitle>
            <CardDescription>General information about your home.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingHousehold ? <Skeleton className="h-[400px]" /> : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Household Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="totalRent" render={({ field }) => (
                      <FormItem><FormLabel>Total Rent</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="leaseStart" render={({ field }) => (
                      <FormItem><FormLabel>Lease Start</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="leaseEnd" render={({ field }) => (
                      <FormItem><FormLabel>Lease End</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="landlordName" render={({ field }) => (
                      <FormItem><FormLabel>Landlord Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="landlordEmail" render={({ field }) => (
                      <FormItem><FormLabel>Landlord Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={updateHouseholdMutation.isPending}>
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>People living in this household.</CardDescription>
            </div>
            <AddMemberDialog householdId={householdId} />
          </CardHeader>
          <CardContent>
            {loadingMembers ? <Skeleton className="h-32" /> : members && members.length > 0 ? (
              <div className="space-y-4">
                {members.map(member => (
                  <div key={member.id} className="flex justify-between items-center p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: member.avatarColor || '#333' }}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeMemberMutation.mutate({ memberId: member.id })}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No members found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
