import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";

type Tab = "create" | "join";

export default function Setup() {
  const { refreshUser } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create form
  const [householdName, setHouseholdName] = useState("");
  const [address, setAddress] = useState("");

  // Join form
  const [inviteCode, setInviteCode] = useState("");

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/households", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: householdName, address, totalRent: 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create household");
      await refreshUser();
      setLocation("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/households/join", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to join household");
      await refreshUser();
      setLocation("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    border: "1.5px solid #e8d9c8",
    background: "#fdfaf6",
    color: "#3c2a21",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#fdfaf6", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow"
            style={{ background: "#c2410c" }}
          >
            🏠
          </div>
          <span className="text-2xl font-bold" style={{ color: "#3c2a21" }}>
            Roomly
          </span>
        </div>

        <div
          className="bg-white rounded-3xl shadow-sm p-8"
          style={{ border: "1px solid #f0e6d8" }}
        >
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#3c2a21" }}>
            Set up your household
          </h1>
          <p className="text-sm mb-6" style={{ color: "#8c7a6b" }}>
            Create a new one or join with an invite code
          </p>

          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ background: "#f5ede3" }}
          >
            {(["create", "join"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={
                  tab === t
                    ? { background: "white", color: "#3c2a21", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                    : { color: "#8c7a6b" }
                }
              >
                {t === "create" ? "Create household" : "Join with code"}
              </button>
            ))}
          </div>

          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fca5a5" }}
            >
              {error}
            </div>
          )}

          {tab === "create" ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#5e4b3c" }}>
                  Household name
                </label>
                <input
                  type="text"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  required
                  placeholder="The Castro House"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#c2410c")}
                  onBlur={(e) => (e.target.style.borderColor = "#e8d9c8")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#5e4b3c" }}>
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="2847 Castro St, Apt 3, San Francisco"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#c2410c")}
                  onBlur={(e) => (e.target.style.borderColor = "#e8d9c8")}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-opacity"
                style={{ background: "#c2410c", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Creating…" : "Create household"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "#5e4b3c" }}>
                  Invite code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  required
                  placeholder="e.g. A1B2C3D4"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all font-mono tracking-widest"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#c2410c")}
                  onBlur={(e) => (e.target.style.borderColor = "#e8d9c8")}
                />
                <p className="text-xs mt-1.5" style={{ color: "#a89583" }}>
                  Ask a housemate for your household's invite code
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-opacity"
                style={{ background: "#c2410c", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Joining…" : "Join household"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
