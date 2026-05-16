import { StyleSheet, Text, View } from "react-native";
import type { GeoPlayerSummary } from "@/types/geogame";

type ScoreboardProps = {
  players: GeoPlayerSummary[];
  revealLocation: boolean;
};

export function Scoreboard({ players, revealLocation }: ScoreboardProps) {
  return (
    <View style={styles.board}>
      {players.map((player) => (
        <View key={player.profileId} style={styles.row}>
          <View style={styles.identity}>
            <Text style={styles.name}>{player.displayName}</Text>
            <Text style={styles.subtle}>
              {player.hasGuessed
                ? revealLocation
                  ? `${player.latestPoints.toLocaleString()} pts`
                  : "Locked in"
                : "Thinking"}
            </Text>
          </View>
          <Text style={styles.score}>{player.totalScore.toLocaleString()}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: "#020617",
    borderRadius: 18,
    gap: 10,
    padding: 12,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  identity: {
    gap: 2,
  },
  name: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "700",
  },
  subtle: {
    color: "#94a3b8",
    fontSize: 12,
  },
  score: {
    color: "#f97316",
    fontSize: 18,
    fontWeight: "900",
  },
});
