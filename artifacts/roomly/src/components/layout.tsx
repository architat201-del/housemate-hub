import { Link, useLocation } from "wouter";
import {
  Home,
  Receipt,
  Sparkles,
  Wallet,
  ScrollText,
  Settings,
  Building2,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/chores", label: "Chores", icon: Sparkles },
  { href: "/rent", label: "Rent Split", icon: Wallet },
  { href: "/rules", label: "House Rules", icon: ScrollText },
];

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={
        isActive
          ? { background: "#533b2f", color: "#fdfaf6" }
          : { color: "#a89583" }
      }
      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer"
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "#4a352a";
          (e.currentTarget as HTMLElement).style.color = "#e5d5c5";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "#a89583";
        }
      }}
    >
      {children}
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  if (location.startsWith("/landlord")) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif", background: "#fdfaf6" }}
    >
      <aside
        className="w-[220px] flex-shrink-0 flex flex-col shadow-xl z-10"
        style={{ background: "#3c2a21", color: "#e5d5c5" }}
      >
        <div className="p-6">
          <div
            className="flex items-center gap-3 font-bold text-xl mb-8"
            style={{ color: "#f9dec9" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-inner"
              style={{ background: "#c2410c" }}
            >
              <Home size={18} style={{ color: "#fdfaf6" }} />
            </div>
            Roomly
          </div>

          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.href} href={item.href} isActive={location === item.href}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-1.5">
          <NavLink href="/settings" isActive={location === "/settings"}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <NavLink href="/landlord" isActive={location.startsWith("/landlord")}>
            <Building2 size={18} />
            <span>Landlord Portal</span>
          </NavLink>
        </div>
      </aside>

      <main
        className="flex-1 overflow-auto"
        style={{ background: "#fdfaf6", fontFamily: "'DM Sans', sans-serif" }}
      >
        {children}
      </main>
    </div>
  );
}
