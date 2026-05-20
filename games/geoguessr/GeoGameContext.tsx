import { createContext, useContext, type ReactNode } from "react";
import { useGeoGame } from "./useGeoGame";

type GeoGameContextValue = ReturnType<typeof useGeoGame>;

const GeoGameContext = createContext<GeoGameContextValue | null>(null);

export function GeoGameProvider({ children }: { children: ReactNode }) {
  const game = useGeoGame();

  return (
    <GeoGameContext.Provider value={game}>{children}</GeoGameContext.Provider>
  );
}

export function useGeoGameContext(): GeoGameContextValue {
  const ctx = useContext(GeoGameContext);
  if (!ctx) {
    throw new Error("useGeoGameContext must be used within a GeoGameProvider");
  }
  return ctx;
}