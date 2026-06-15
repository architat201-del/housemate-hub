import { Link, useLocation } from "wouter";
import { 
  Home, 
  Receipt, 
  ListTodo, 
  Wallet, 
  FileText, 
  Settings, 
  Building2 
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/chores", label: "Chores", icon: ListTodo },
  { href: "/rent", label: "Rent Split", icon: Wallet },
  { href: "/rules", label: "House Rules", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  if (location.startsWith("/landlord")) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-64 border-r bg-sidebar flex-shrink-0 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground">
            Roomly
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Link
            href="/landlord"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors"
          >
            <Building2 className="w-4 h-4" />
            Landlord Portal
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
