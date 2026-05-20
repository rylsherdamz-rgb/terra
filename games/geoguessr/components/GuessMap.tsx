import GameMapView from "./MapView";
import type { GuessLocation } from "@/games/geoguessr/types";

type GuessMapProps = {
  actualGuess: (GuessLocation & { city?: string; country?: string }) | null;
  editable: boolean;
  onSelectGuess: (guess: GuessLocation) => void;
  selectedGuess: GuessLocation | null;
};

export function GuessMap({
  actualGuess,
  editable,
  onSelectGuess,
  selectedGuess,
}: GuessMapProps) {
  return (
    <GameMapView
      actualGuess={actualGuess}
      editable={editable}
      onSelectGuess={onSelectGuess}
      selectedGuess={selectedGuess}
    />
  );
}