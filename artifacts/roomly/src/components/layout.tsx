import { useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import {
  Home,
  Receipt,
  Sparkles,
  Wallet,
  ScrollText,
  Settings,
  Building2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

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
  onNavigate,
  children,
}: {
  href: string;
  isActive: boolean;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
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

function LogoutButton({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();
  return (
    <button
      onClick={() => { onNavigate?.(); logout(); }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium w-full transition-colors"
      style={{ color: "#a89583" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "#4a352a";
        (e.currentTarget as HTMLElement).style.color = "#e5d5c5";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
        (e.currentTarget as HTMLElement).style.color = "#a89583";
      }}
    >
      <LogOut size={18} />
      <span>Sign out</span>
    </button>
  );
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const [location] = useLocation();
  return (
    <>
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
              <NavLink
                key={item.href}
                href={item.href}
                isActive={location === item.href}
                onNavigate={onNavigate}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-1.5">
        <NavLink
          href="/settings"
          isActive={location === "/settings"}
          onNavigate={onNavigate}
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
        <NavLink
          href="/landlord"
          isActive={location.startsWith("/landlord")}
          onNavigate={onNavigate}
        >
          <Building2 size={18} />
          <span>Landlord Portal</span>
        </NavLink>
        <LogoutButton onNavigate={onNavigate} />
      </div>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeSidebar = useCallback(() => setMobileOpen(false), []);

  if (location.startsWith("/landlord")) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif", background: "#fdfaf6" }}
    >
      {/* ── Desktop sidebar (unchanged) ── */}
      <aside
        className="hidden md:flex w-[220px] flex-shrink-0 flex-col shadow-xl z-10"
        style={{ background: "#3c2a21", color: "#e5d5c5" }}
      >
        <SidebarContent onNavigate={() => {}} />
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={closeSidebar}
        />
      )}

      {/* ── Mobile sidebar (slides in from left) ── */}
      <aside
        className="fixed top-0 left-0 h-full z-30 flex flex-col shadow-2xl md:hidden"
        style={{
          background: "#3c2a21",
          color: "#e5d5c5",
          width: 220,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Close button */}
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 p-1.5 rounded-lg"
          style={{ color: "#a89583" }}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        <SidebarContent onNavigate={closeSidebar} />
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar with hamburger */}
        <header
          className="md:hidden flex items-center px-4 h-14 flex-shrink-0 shadow-sm z-10"
          style={{ background: "#3c2a21" }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg mr-3"
            style={{ color: "#f9dec9" }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div
            className="flex items-center gap-2 font-bold text-lg"
            style={{ color: "#f9dec9" }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#c2410c" }}
            >
              <Home size={15} style={{ color: "#fdfaf6" }} />
            </div>
            Roomly
          </div>
        </header>

        <main
          className="flex-1 overflow-auto"
          style={{ background: "#fdfaf6", fontFamily: "'DM Sans', sans-serif" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
