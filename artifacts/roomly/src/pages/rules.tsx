import { useState, useEffect } from "react";
import { useHousehold } from "@/components/household-context";
import {
  useGetHouseRules,
  getGetHouseRulesQueryKey,
  useUpdateHouseRules,
  useSignHouseRules,
  useListMembers,
  getListMembersQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { Pen, CheckCircle, FileSignature } from "lucide-react";

export default function Rules() {
  const householdId = useHousehold();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");

  const { data: rules, isLoading: loadingRules } = useGetHouseRules(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getGetHouseRulesQueryKey(householdId)
    }
  });

  const { data: members, isLoading: loadingMembers } = useListMembers(householdId, {
    query: {
      enabled: !!householdId,
      queryKey: getListMembersQueryKey(householdId)
    }
  });

  useEffect(() => {
    if (rules && !isEditing) {
      setContent(rules.content);
    }
  }, [rules, isEditing]);

  const updateMutation = useUpdateHouseRules({
    mutation: {
      onSuccess: () => {
        toast.success("Rules updated successfully");
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: getGetHouseRulesQueryKey(householdId) });
      },
      onError: () => toast.error("Failed to update rules")
    }
  });

  const signMutation = useSignHouseRules({
    mutation: {
      onSuccess: () => {
        toast.success("Rules signed");
        queryClient.invalidateQueries({ queryKey: getGetHouseRulesQueryKey(householdId) });
      },
      onError: () => toast.error("Failed to sign rules")
    }
  });

  const handleSave = () => {
    updateMutation.mutate({ householdId, data: { content } });
  };

  const handleSign = (memberId: number) => {
    signMutation.mutate({ householdId, data: { memberId } });
  };

  const signaturesMap = new Map((rules?.signatures || []).map(s => [s.memberId, s.signedAt]));

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">House Rules</h1>
          <p className="text-muted-foreground mt-1">Our shared agreements and living standards.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Agreement Content</CardTitle>
                <CardDescription>
                  {rules ? `Version ${rules.version} • Last updated ${format(new Date(rules.updatedAt), "MMM d, yyyy")}` : "Loading..."}
                </CardDescription>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Pen className="w-4 h-4 mr-2" /> Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {loadingRules ? (
                <Skeleton className="h-[400px]" />
              ) : isEditing ? (
                <div className="space-y-4">
                  <Textarea 
                    className="min-h-[400px] font-mono text-sm" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => { setIsEditing(false); setContent(rules?.content || ""); }}>Cancel</Button>
                    <Button onClick={handleSave} disabled={updateMutation.isPending}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
                  {rules?.content || "No rules defined yet. Click edit to add some."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signatures</CardTitle>
              <CardDescription>All members must agree to the current version.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingMembers ? <Skeleton className="h-48" /> : (
                <div className="space-y-4">
                  {members?.map(member => {
                    const signedAt = signaturesMap.get(member.id);
                    return (
                      <div key={member.id} className="flex flex-col p-3 border rounded-md gap-2">
                        <div className="flex items-center gap-2 font-medium">
                          {member.name}
                        </div>
                        {signedAt ? (
                          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Signed {format(new Date(signedAt), "MMM d, yyyy")}
                          </div>
                        ) : (
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-xs text-muted-foreground">Not signed</div>
                            <Button size="sm" variant="secondary" onClick={() => handleSign(member.id)} disabled={signMutation.isPending}>
                              <FileSignature className="w-3 h-3 mr-1" /> Sign
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
