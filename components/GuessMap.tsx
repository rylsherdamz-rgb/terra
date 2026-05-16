import GameMapView from "@/components/MapView";
import type { GuessLocation } from "@/types/geogame";

type GuessMapProps = {
  actualGuess: GuessLocation | null;
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
