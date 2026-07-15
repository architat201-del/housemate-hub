import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { formatDistanceToNow, parseISO } from "date-fns";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  expense: "#c2410c",
  chore: "#15803d",
  rent: "#0369a1",
  general: "#7c3aed",
};

function typeIcon(type: string) {
  const icons: Record<string, string> = {
    expense: "💸",
    chore: "🧹",
    rent: "🏠",
    general: "🔔",
  };
  return icons[type] ?? "🔔";
}

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const fetchUnread = async () => {
    if (!user) return;
    try {
      const data = await apiFetch("/notifications/unread-count");
      setUnread(data.count ?? 0);
    } catch {}
  };

  const fetchAll = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiFetch("/notifications");
      setNotifications(data);
      setUnread(data.filter((n: Notification) => !n.isRead).length);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30_000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (open) fetchAll();
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const markRead = async (id: number) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "POST" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnread((u) => Math.max(0, u - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await apiFetch("/notifications/read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {}
  };

  const remove = async (id: number) => {
    const wasUnread = notifications.find((n) => n.id === id)?.isRead === false;
    try {
      await apiFetch(`/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (wasUnread) setUnread((u) => Math.max(0, u - 1));
    } catch {}
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl transition-colors"
        style={{ color: "#a89583" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#4a352a";
          (e.currentTarget as HTMLElement).style.color = "#e5d5c5";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "#a89583";
        }}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: "#c2410c", fontSize: 10 }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 rounded-2xl shadow-2xl overflow-hidden z-50"
          style={{
            width: 340,
            background: "white",
            border: "1px solid #f0e6d8",
            top: "100%",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "#f0e6d8" }}
          >
            <span className="font-bold text-sm" style={{ color: "#3c2a21" }}>
              Notifications {unread > 0 && <span style={{ color: "#c2410c" }}>({unread})</span>}
            </span>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors"
                  style={{ color: "#c2410c" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#fef2f2")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <Check size={12} /> Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg"
                style={{ color: "#a89583" }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 400 }}>
            {loading && (
              <div className="px-4 py-8 text-center text-sm" style={{ color: "#a89583" }}>
                Loading…
              </div>
            )}
            {!loading && notifications.length === 0 && (
              <div className="px-4 py-10 text-center">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-sm font-medium" style={{ color: "#8c7a6b" }}>
                  You're all caught up!
                </p>
                <p className="text-xs mt-1" style={{ color: "#a89583" }}>
                  Notifications for expenses, chores, and rent will appear here.
                </p>
              </div>
            )}
            {!loading &&
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex gap-3 px-4 py-3 border-b cursor-pointer transition-colors"
                  style={{
                    borderColor: "#f0e6d8",
                    background: n.isRead ? "transparent" : "#fffbf8",
                  }}
                  onClick={() => { if (!n.isRead) markRead(n.id); }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#fdfaf6")}
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = n.isRead ? "transparent" : "#fffbf8")
                  }
                >
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-base"
                    style={{ background: "#f5ede3" }}
                  >
                    {typeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold leading-snug"
                      style={{ color: n.isRead ? "#5e4b3c" : "#3c2a21" }}
                    >
                      {n.title}
                    </p>
                    <p className="text-xs mt-0.5 leading-snug" style={{ color: "#8c7a6b" }}>
                      {n.message}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#a89583" }}>
                      {formatDistanceToNow(parseISO(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {!n.isRead && (
                      <div
                        className="w-2 h-2 rounded-full mt-2"
                        style={{ background: TYPE_COLORS[n.type] ?? "#c2410c" }}
                      />
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#a89583" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#b91c1c")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#a89583")}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
