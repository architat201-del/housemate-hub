import { createContext, useContext, ReactNode } from "react";

const HouseholdContext = createContext<number>(1);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  return (
    <HouseholdContext.Provider value={1}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  return useContext(HouseholdContext);
}
