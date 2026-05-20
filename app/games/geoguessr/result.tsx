import { useMemo, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Scoreboard } from "@/games/geoguessr/components/Scoreboard";
import { useGeoGameContext } from "@/games/geoguessr/GeoGameContext";
import { formatPoints } from "@/utils/geography";

export default function GeoGuessrResult() {
  const router = useRouter();
  const { activeGame, player } = useGeoGameContext();

  useEffect(() => {
    if (!activeGame) {
      router.replace("/games/geoguessr/lobby" as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGame]);

  const winner = useMemo(() => {
    if (!activeGame?.players?.length) return null;
    return activeGame.players[0];
  }, [activeGame?.players]);

  const playerRank = useMemo(() => {
    if (!activeGame?.players) return null;
    const idx = activeGame.players.findIndex((p) => p.profileId === player.id);
    return idx >= 0 ? idx + 1 : null;
  }, [activeGame?.players, player.id]);

  const playerScore = useMemo(() => {
    if (!activeGame?.players) return 0;
    const me = activeGame.players.find((p) => p.profileId === player.id);
    return me?.totalScore ?? 0;
  }, [activeGame?.players, player.id]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
          <View style={styles.trophyIcon}>
            <Feather name="award" size={40} color="#f97316" />
          </View>
          <Text style={styles.eyebrow}>GAME OVER</Text>
          <Text style={styles.title}>
            {activeGame?.isSolo
              ? "Solo run complete"
              : winner?.profileId === player.id
                ? "You won!"
                : `${winner?.displayName ?? "Opponent"} wins!`}
          </Text>
          {activeGame?.isSolo ? (
            <Text style={styles.scoreBig}>{formatPoints(playerScore)}</Text>
          ) : (
            <Text style={styles.subtitle}>
              {winner?.profileId === player.id
                ? "Outstanding geography skills!"
                : "Better luck next time — keep exploring!"}
            </Text>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="bar-chart-2" size={18} color="#f97316" />
            <Text style={styles.sectionTitle}>Final Standings</Text>
          </View>
          <Scoreboard
            players={activeGame?.players ?? []}
            revealLocation={true}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Feather name="target" size={20} color="#22c55e" />
            <Text style={styles.statValue}>{formatPoints(playerScore)}</Text>
            <Text style={styles.statLabel}>Your Score</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="hash" size={20} color="#2563eb" />
            <Text style={styles.statValue}>
              #{playerRank ?? "-"}
            </Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
          <View style={styles.statCard}>
            <Feather name="radio" size={20} color="#f97316" />
            <Text style={styles.statValue}>
              {activeGame?.roundCount ?? 5}
            </Text>
            <Text style={styles.statLabel}>Rounds</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.actionCard}>
          <PrimaryButton
            label="Play again"
            onPress={() => router.replace("/games/geoguessr/lobby" as any)}
          />
          <PrimaryButton
            label="Back to hub"
            onPress={() => router.replace("/hub" as any)}
            tone="secondary"
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  content: { gap: 16, padding: 18, paddingBottom: 40 },
  hero: {
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 28,
    borderWidth: 1,
    gap: 10,
    padding: 28,
  },
  trophyIcon: {
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.15)",
    borderRadius: 50,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  eyebrow: {
    color: "#f97316",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: { color: "#f8fafc", fontSize: 28, fontWeight: "900", textAlign: "center" },
  subtitle: { color: "#94a3b8", fontSize: 15, textAlign: "center" },
  scoreBig: { color: "#f97316", fontSize: 52, fontWeight: "900" },
  card: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    padding: 18,
  },
  cardHeader: { alignItems: "center", flexDirection: "row", gap: 10 },
  sectionTitle: { color: "#f8fafc", fontSize: 17, fontWeight: "800" },
  statsGrid: { flexDirection: "row", gap: 10 },
  statCard: {
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    gap: 6,
    padding: 16,
  },
  statValue: { color: "#f8fafc", fontSize: 22, fontWeight: "900" },
  statLabel: { color: "#94a3b8", fontSize: 12, fontWeight: "600", textTransform: "uppercase" },
  actionCard: { gap: 10 },
});