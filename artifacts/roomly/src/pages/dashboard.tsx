import { useHousehold } from "@/components/household-context";
import { useAuth } from "@/context/auth-context";
import {
  useGetHouseholdDashboard,
  getGetHouseholdDashboardQueryKey,
  useGetHousehold,
  getGetHouseholdQueryKey,
  useListMembers,
  getListMembersQueryKey,
  useListExpenses,
  getListExpensesQueryKey,
  useListChores,
  getListChoresQueryKey,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import {
  IndianRupee,
  Receipt,
  AlertCircle,
  Users,
  CheckCircle2,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { formatINR } from "@/lib/currency";

const FALLBACK_COLORS = [
  "#c2410c",
  "#0369a1",
  "#15803d",
  "#7c3aed",
  "#b45309",
  "#be185d",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getMemberColor(
  avatarColor: string | null | undefined,
  index: number
): string {
  return avatarColor || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}


function formatExpenseDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return format(date, "MMM d");
  } catch {
    return dateStr;
  }
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const householdId = useHousehold();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const { data: household, isLoading: loadingHousehold } = useGetHousehold(
    householdId,
    { query: { enabled: !!householdId, queryKey: getGetHouseholdQueryKey(householdId) } }
  );

  const { data: dashboard, isLoading: loadingDashboard } =
    useGetHouseholdDashboard(householdId, {
      query: { enabled: !!householdId, queryKey: getGetHouseholdDashboardQueryKey(householdId) },
    });

  const { data: members = [], isLoading: loadingMembers } = useListMembers(
    householdId,
    { query: { enabled: !!householdId, queryKey: getListMembersQueryKey(householdId) } }
  );

  const { data: expenses = [], isLoading: loadingExpenses } = useListExpenses(
    householdId,
    { query: { enabled: !!householdId, queryKey: getListExpensesQueryKey(householdId) } }
  );

  const { data: chores = [], isLoading: loadingChores } = useListChores(
    householdId,
    { query: { enabled: !!householdId, queryKey: getListChoresQueryKey(householdId) } }
  );

  const memberMap = new Map(members.map((m, i) => [m.id, { ...m, index: i }]));

  const recentExpenses = expenses.slice(0, 4);
  const displayChores = chores.slice(0, 3);

  const isLoading =
    loadingHousehold ||
    loadingDashboard ||
    loadingMembers ||
    loadingExpenses ||
    loadingChores;

  if (isLoading) {
    return (
      <div
        className="p-8 lg:p-12 space-y-8"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-56" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-[20px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-[24px]" />
            <Skeleton className="h-48 rounded-[24px]" />
          </div>
          <Skeleton className="h-96 rounded-[24px]" />
        </div>
      </div>
    );
  }

  const overdueCount = dashboard?.overdueChores ?? 0;
  const firstOverdueChoreTitle = displayChores[0]?.title ?? "";

  return (
    <div
      className="h-full overflow-y-auto p-8 lg:p-12"
      style={{ fontFamily: "'DM Sans', sans-serif", color: "#4a3f35" }}
    >
      {/* Header */}
      <header className="flex justify-between items-end mb-10">
        <div>
          <p
            className="text-2xl font-bold mb-1"
            style={{ color: "#3c2a21" }}
          >
            {getGreeting()}, {firstName} 👋
          </p>
          <p
            className="text-base font-medium mb-3"
            style={{ color: "#8c7a6b" }}
          >
            Here's what's happening in your household today.
          </p>
          <h2
            className="text-lg font-semibold"
            style={{ color: "#a89583" }}
          >
            {household?.name ?? "Your Household"}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/expenses"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-colors shadow-sm text-sm"
            style={{
              background: "#f4ece3",
              color: "#5e4b3c",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#eadecc")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#f4ece3")
            }
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </a>
          {members[0] && (
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shadow-md font-bold text-sm text-white"
              style={{ background: getMemberColor(members[0].avatarColor, 0) }}
            >
              {getInitials(members[0].name)}
            </div>
          )}
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Rent"
          value={formatINR(dashboard?.totalRent ?? 0)}
          subtitle={
            dashboard?.rentDueDate
              ? `Due ${format(parseISO(dashboard.rentDueDate), "MMM d")}`
              : "Due date not set"
          }
          icon={<IndianRupee size={20} style={{ color: "#d97706" }} />}
          bgColor="#fff9f0"
        />
        <StatCard
          title="Pending Expenses"
          value={formatINR(dashboard?.pendingExpenseTotal ?? 0)}
          subtitle="Awaiting settlement"
          icon={<Receipt size={20} style={{ color: "#c2410c" }} />}
          bgColor="#fff5f0"
        />
        <StatCard
          title="Overdue Chores"
          value={String(overdueCount)}
          subtitle={overdueCount > 0 ? firstOverdueChoreTitle : "All caught up"}
          icon={<AlertCircle size={20} style={{ color: overdueCount > 0 ? "#b91c1c" : "#15803d" }} />}
          bgColor={overdueCount > 0 ? "#fef2f2" : "#f0fdf4"}
        />
        <StatCard
          title="Members"
          value={String(dashboard?.memberCount ?? members.length)}
          subtitle="All active"
          icon={<Users size={20} style={{ color: "#15803d" }} />}
          bgColor="#f0fdf4"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Chores + Members */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chore Board */}
          <section
            className="bg-white rounded-[24px] p-8 shadow-sm"
            style={{ border: "1px solid #f0e6d8" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl font-bold"
                style={{ color: "#3c2a21" }}
              >
                This Week's Chores
              </h2>
              <a
                href="/chores"
                className="font-medium text-sm hover:underline"
                style={{ color: "#c2410c" }}
              >
                View Schedule
              </a>
            </div>

            {displayChores.length === 0 ? (
              <p className="text-sm py-4" style={{ color: "#8c7a6b" }}>
                No chores this week. Enjoy the clean house!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayChores.map((chore, i) => {
                  const assignee = memberMap.get(chore.currentAssigneeMemberId);
                  const isOverdue = i === 0 && overdueCount > 0;
                  return (
                    <ChoreCard
                      key={chore.id}
                      title={chore.title}
                      assigneeName={assignee?.name ?? "Unassigned"}
                      assigneeColor={getMemberColor(assignee?.avatarColor, assignee?.index ?? i)}
                      assigneeInitials={assignee ? getInitials(assignee.name) : "?"}
                      status={isOverdue ? "overdue" : "pending"}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* Housemates */}
          <section
            className="bg-white rounded-[24px] p-8 shadow-sm"
            style={{ border: "1px solid #f0e6d8" }}
          >
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: "#3c2a21" }}
            >
              Housemates
            </h2>
            <div className="flex gap-6 flex-wrap">
              {members.map((member, i) => (
                <MemberAvatar
                  key={member.id}
                  name={member.name}
                  role={member.role === "admin" ? "Admin" : "Member"}
                  initials={getInitials(member.name)}
                  color={getMemberColor(member.avatarColor, i)}
                  active={i === 0}
                />
              ))}
              <div className="flex flex-col items-center gap-3">
                <a
                  href="/settings"
                  className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-colors"
                  style={{
                    borderColor: "#d5c5b5",
                    color: "#a89583",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#c2410c";
                    (e.currentTarget as HTMLElement).style.color = "#c2410c";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#d5c5b5";
                    (e.currentTarget as HTMLElement).style.color = "#a89583";
                  }}
                >
                  <Plus size={24} />
                </a>
                <span
                  className="font-medium text-sm"
                  style={{ color: "#8c7a6b" }}
                >
                  Invite
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Recent Expenses */}
        <div>
          <section
            className="rounded-[24px] p-8 shadow-sm h-full"
            style={{
              background: "#fff9f0",
              border: "1px solid #f5ead7",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl font-bold"
                style={{ color: "#3c2a21" }}
              >
                Recent Expenses
              </h2>
              <button
                className="p-2 rounded-full transition-colors"
                style={{ color: "#8c7a6b" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "#f0e3d1")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {recentExpenses.length === 0 ? (
                <p className="text-sm py-4" style={{ color: "#8c7a6b" }}>
                  No expenses yet. Add one above!
                </p>
              ) : (
                recentExpenses.map((expense) => {
                  const payer = memberMap.get(expense.paidByMemberId);
                  const payerIndex = payer?.index ?? 0;
                  return (
                    <ExpenseItem
                      key={expense.id}
                      title={expense.title}
                      date={formatExpenseDate(expense.date)}
                      amount={formatINR(expense.amount)}
                      paidByName={payer?.name?.split(" ")[0] ?? "Someone"}
                      paidByInitials={payer ? getInitials(payer.name) : "?"}
                      paidByColor={getMemberColor(payer?.avatarColor, payerIndex)}
                    />
                  );
                })
              )}
            </div>

            <a
              href="/expenses"
              className="block w-full mt-8 py-3 rounded-xl text-center font-medium transition-colors text-sm"
              style={{
                border: "1px solid #e8d6c1",
                color: "#a07c5a",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#f5ead7")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "transparent")
              }
            >
              View All Expenses
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  bgColor,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
}) {
  return (
    <div
      className="p-8 rounded-[20px] border border-white shadow-sm flex flex-col"
      style={{ background: bgColor }}
    >
      <div className="flex justify-between items-start mb-5">
        <h3 className="font-medium text-sm" style={{ color: "#8c7a6b" }}>
          {title}
        </h3>
        <div className="p-2 bg-white rounded-xl shadow-sm">
          {icon}
        </div>
      </div>
      <div className="mt-auto">
        <div
          className="text-4xl font-bold mb-1.5"
          style={{ color: "#3c2a21" }}
        >
          {value}
        </div>
        <div className="text-sm font-medium" style={{ color: "#a89583" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function ChoreCard({
  title,
  assigneeName,
  assigneeColor,
  assigneeInitials,
  status,
}: {
  title: string;
  assigneeName: string;
  assigneeColor: string;
  assigneeInitials: string;
  status: "completed" | "pending" | "overdue";
}) {
  const isOverdue = status === "overdue";
  const isCompleted = status === "completed";

  return (
    <div
      className="p-5 rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow"
      style={{
        background: isOverdue ? "#fef2f2" : "#faf7f2",
        border: `1px solid ${isOverdue ? "#fca5a5" : "#ebdcc9"}`,
      }}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3" style={{ color: "#15803d" }}>
          <CheckCircle2
            size={20}
            className="fill-[#15803d] text-white"
          />
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-sm"
          style={{ background: assigneeColor }}
        >
          {assigneeInitials}
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: "#8c7a6b" }}>
            Assigned to
          </p>
          <p className="text-sm font-bold" style={{ color: "#3c2a21" }}>
            {assigneeName}
          </p>
        </div>
      </div>

      <h4
        className="font-bold text-lg mb-1"
        style={{
          color: isCompleted ? "#8c7a6b" : "#3c2a21",
          textDecoration: isCompleted ? "line-through" : "none",
        }}
      >
        {title}
      </h4>

      {isOverdue && (
        <p
          className="text-xs font-bold uppercase tracking-wider mt-2"
          style={{ color: "#b91c1c" }}
        >
          Overdue
        </p>
      )}
    </div>
  );
}

function MemberAvatar({
  name,
  role,
  initials,
  color,
  active = false,
}: {
  name: string;
  role: string;
  initials: string;
  color: string;
  active?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className="w-16 h-16 rounded-full text-white flex items-center justify-center text-xl font-bold shadow-md"
          style={{ background: color }}
        >
          {initials}
        </div>
        {active && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
            style={{ background: "#22c55e" }}
          />
        )}
      </div>
      <div className="text-center">
        <p className="font-bold text-sm" style={{ color: "#3c2a21" }}>
          {name}
        </p>
        <p className="text-xs font-medium" style={{ color: "#8c7a6b" }}>
          {role}
        </p>
      </div>
    </div>
  );
}

function ExpenseItem({
  title,
  date,
  amount,
  paidByName,
  paidByInitials,
  paidByColor,
}: {
  title: string;
  date: string;
  amount: string;
  paidByName: string;
  paidByInitials: string;
  paidByColor: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0"
        style={{ background: paidByColor }}
      >
        {paidByInitials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate" style={{ color: "#3c2a21" }}>
          {title}
        </p>
        <p className="text-sm" style={{ color: "#8c7a6b" }}>
          Paid by {paidByName} · {date}
        </p>
      </div>
      <div className="font-bold text-lg" style={{ color: "#3c2a21" }}>
        {amount}
      </div>
    </div>
  );
}
