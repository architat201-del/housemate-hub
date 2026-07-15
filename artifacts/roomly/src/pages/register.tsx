import { useState, FormEvent } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/auth-context";

export default function Register() {
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      setLocation("/setup");
    } catch (err: any) {
      setError(err.message ?? "Registration failed");
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
            Create your account
          </h1>
          <p className="text-sm mb-6" style={{ color: "#8c7a6b" }}>
            Set up your household in minutes
          </p>

          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: "#fef2f2", color: "#b91c1c", border: "1px solid #fca5a5" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#5e4b3c" }}>
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jordan Kim"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#c2410c")}
                onBlur={(e) => (e.target.style.borderColor = "#e8d9c8")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#5e4b3c" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#c2410c")}
                onBlur={(e) => (e.target.style.borderColor = "#e8d9c8")}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#5e4b3c" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
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
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: "#8c7a6b" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold hover:underline"
              style={{ color: "#c2410c" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
