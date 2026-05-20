import { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { PrimaryButton } from "@/components/PrimaryButton";
import { supabase } from "@/utils/supabase";
import { loadProfile } from "@/utils/profileStorage";
import { gameRegistry } from "@/utils/gameRegistry";
import type { ActiveGameSummary } from "@/types/registry";

export default function HubScreen() {
  const router = useRouter();
  const profile = loadProfile();
  const [activeGames, setActiveGames] = useState<ActiveGameSummary[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveGames = useCallback(async () => {
    if (!profile.playerId) return;
    setLoadingGames(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from("game_players")
        .select(
          "game_id, games(id, invite_code, status, current_round_number, round_count)",
        )
        .eq("profile_id", profile.playerId)
        .not("games.status", "eq", "finished")
        .order("joined_at", { ascending: false });

      if (dbError) throw dbError;

      const summaries: ActiveGameSummary[] = ((data ?? []) as any[])
        .filter((row: any) => row.games)
        .map((row: any) => ({
          gameId: row.games.id,
          inviteCode: row.games.invite_code,
          status: row.games.status,
          currentRoundNumber: row.games.current_round_number,
          roundCount: row.games.round_count,
          playerCount: 0,
        }));

      setActiveGames(summaries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load games");
    } finally {
      setLoadingGames(false);
    }
  }, [profile.playerId]);

  useEffect(() => {
    void fetchActiveGames();
  }, [fetchActiveGames]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={fetchActiveGames}
            refreshing={loadingGames}
            tintColor="#f97316"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
          <Text style={styles.eyebrow}>WORLD TRAIL</Text>
          <Text style={styles.greeting}>
            Welcome back,{" "}
            <Text style={styles.nameHighlight}>{profile.displayName}</Text>
          </Text>
          <Text style={styles.subtitle}>
            Explore the world through games. Drop into Street View, pin locations, and compete.
          </Text>
        </Animated.View>

        {loadingGames ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#f97316" size="small" />
          </View>
        ) : activeGames.length > 0 ? (
          <Animated.View entering={FadeInDown.delay(150).duration(500)}>
            <View style={styles.sectionHeader}>
              <Feather name="play-circle" size={18} color="#22c55e" />
              <Text style={styles.sectionTitle}>Active Games</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activeScroll}
            >
              {activeGames.map((game, i) => {
                const gameDef = gameRegistry.find(
                  (g) => g.route.includes("geoguessr"),
                );
                return (
                  <Animated.View
                    key={game.gameId}
                    entering={FadeIn.delay(i * 100).duration(400)}
                  >
                    <PrimaryButton
                      label={`${gameDef?.name ?? "Game"} — R${game.currentRoundNumber}/${game.roundCount}`}
                      onPress={() => router.push("/games/geoguessr/play" as any)}
                      tone={game.status === "waiting" ? "secondary" : "primary"}
                    />
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(250).duration(500)}>
          <View style={styles.sectionHeader}>
            <Feather name="grid" size={18} color="#f97316" />
            <Text style={styles.sectionTitle}>Games</Text>
          </View>

          <View style={styles.gameGrid}>
            {gameRegistry
              .filter((g) => g.enabled)
              .map((game, i) => (
                <Animated.View
                  key={game.id}
                  entering={FadeInDown.delay(300 + i * 150).duration(500)}
                  style={styles.gameCard}
                >
                  <View
                    style={[
                      styles.gameIconBox,
                      { backgroundColor: `${game.color}1a` },
                    ]}
                  >
                    <Feather name={game.icon as any} size={28} color={game.color} />
                  </View>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <Text style={styles.gameDesc}>{game.description}</Text>
                  <View style={styles.gameMeta}>
                    <View style={styles.metaTag}>
                      <Feather name="users" size={12} color="#94a3b8" />
                      <Text style={styles.metaText}>
                        {game.minPlayers}-{game.maxPlayers}p
                      </Text>
                    </View>
                  </View>
                  <PrimaryButton
                    label="Play"
                    onPress={() => router.push(game.route as any)}
                  />
                </Animated.View>
              ))}
          </View>
        </Animated.View>

        {error ? (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={14} color="#fca5a5" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  content: { gap: 20, padding: 18, paddingBottom: 40 },
  hero: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 28,
    borderWidth: 1,
    gap: 8,
    padding: 22,
  },
  eyebrow: {
    color: "#f97316",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  greeting: { color: "#f8fafc", fontSize: 24, fontWeight: "900" },
  nameHighlight: { color: "#f97316" },
  subtitle: { color: "#94a3b8", fontSize: 14, lineHeight: 21 },
  loadingBox: { alignItems: "center", paddingVertical: 20 },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: { color: "#f8fafc", fontSize: 17, fontWeight: "800" },
  activeScroll: {
    gap: 10,
    paddingBottom: 4,
  },
  gameGrid: { gap: 14 },
  gameCard: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 18,
  },
  gameIconBox: {
    alignItems: "center",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  gameName: { color: "#f8fafc", fontSize: 20, fontWeight: "800" },
  gameDesc: { color: "#94a3b8", fontSize: 14, lineHeight: 20 },
  gameMeta: { flexDirection: "row", gap: 8 },
  metaTag: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 10,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  metaText: { color: "#94a3b8", fontSize: 12, fontWeight: "600" },
  errorBox: {
    alignItems: "center",
    backgroundColor: "rgba(252,165,165,0.1)",
    borderRadius: 14,
    flexDirection: "row",
    gap: 8,
    padding: 12,
  },
  errorText: { color: "#fca5a5", flex: 1, fontSize: 13 },
});