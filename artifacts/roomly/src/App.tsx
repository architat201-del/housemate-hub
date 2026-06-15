import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HouseholdProvider } from "@/components/household-context";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Expenses from "@/pages/expenses";
import Chores from "@/pages/chores";
import Rent from "@/pages/rent";
import Rules from "@/pages/rules";
import Landlord from "@/pages/landlord";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Setup from "@/pages/setup";

const queryClient = new QueryClient();

function ProtectedRouter() {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#fdfaf6", fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="text-center space-y-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow mx-auto"
            style={{ background: "#c2410c" }}
          >
            🏠
          </div>
          <p className="text-sm" style={{ color: "#8c7a6b" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (location === "/login" || location === "/register") {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }

  if (!user) return <Redirect to="/login" />;

  if (!user.householdId && location !== "/setup") return <Redirect to="/setup" />;

  if (location === "/setup") {
    return <Route path="/setup" component={Setup} />;
  }

  return (
    <HouseholdProvider>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/expenses" component={Expenses} />
          <Route path="/chores" component={Chores} />
          <Route path="/rent" component={Rent} />
          <Route path="/rules" component={Rules} />
          <Route path="/landlord" component={Landlord} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </HouseholdProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ProtectedRouter />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
