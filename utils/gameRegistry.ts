import type { GameDefinition } from "@/types/registry";

export const gameRegistry: GameDefinition[] = [
  {
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
  },
];

export function getGameDefinition(id: string): GameDefinition | undefined {
  return gameRegistry.find((g) => g.id === id);
}