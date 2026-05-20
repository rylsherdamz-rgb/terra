import type { GameDefinition } from "@/types/registry";
import type { GeoPlayer } from "./types";

const geoguessrDefinition: GameDefinition = {
  id: "geoguessr",
  name: "GeoGuessr Duel",
  description:
    "Drop into Street View anywhere on Earth. Explore, read signs, study the landscape — then pin your location. Closest guess wins.",
  icon: "globe",
  route: "/games/geoguessr/lobby",
  minPlayers: 1,
  maxPlayers: 2,
  enabled: true,
  color: "#f97316",
};

export { geoguessrDefinition };
export type { GeoPlayer }; 
export { useGeoGame } from "./useGeoGame";