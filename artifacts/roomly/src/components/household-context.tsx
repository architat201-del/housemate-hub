import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "@/context/auth-context";

const HouseholdContext = createContext<number>(1);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const householdId = user?.householdId ?? 1;

  return (
    <HouseholdContext.Provider value={householdId}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  return useContext(HouseholdContext);
}
