import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { PrimaryButton } from "@/components/PrimaryButton";
import { loadProfile, saveProfile, type StoredProfile } from "@/utils/profileStorage";
import { supabase } from "@/utils/supabase";
import { formatPoints } from "@/utils/geography";

export default function ProfileTab() {
  const [profile, setProfile] = useState<StoredProfile>(loadProfile);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.displayName);
  const [stats, setStats] = useState({ gamesPlayed: 0, gamesWon: 0, totalScore: 0, bestScore: 0 });
  const [, setLoadingStats] = useState(true);

  useEffect(() => {
    void fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.playerId]);

  const fetchStats = async () => {
    try {
      const { data: gpData, error: gpError } = await supabase
        .from("game_players")
        .select("total_score, games!inner(status, winner_profile_id)")
        .eq("profile_id", profile.playerId);

      if (gpError) return;

      const rows = (gpData ?? []) as any[];
      const finished = rows.filter((r: any) => r.games?.status === "finished");

      setStats({
        gamesPlayed: finished.length,
        gamesWon: finished.filter((r: any) => r.games?.winner_profile_id === profile.playerId).length,
        totalScore: finished.reduce((sum: number, r: any) => sum + (r.total_score ?? 0), 0),
        bestScore: Math.max(0, ...finished.map((r: any) => r.total_score ?? 0)),
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      saveProfile({ displayName: trimmed });
      setProfile((p) => ({ ...p, displayName: trimmed }));
    }
    setEditingName(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
          <View style={styles.avatarCircle}>
            <Feather name="user" size={36} color="#f97316" />
          </View>
          {editingName ? (
            <View style={styles.editRow}>
              <TextInput
                autoFocus
                onChangeText={setNameInput}
                onSubmitEditing={handleSaveName}
                style={styles.nameInput}
                value={nameInput}
              />
              <PrimaryButton label="Save" onPress={handleSaveName} />
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.displayName}>{profile.displayName}</Text>
              <PrimaryButton
                label="Edit"
                onPress={() => {
                  setNameInput(profile.displayName);
                  setEditingName(true);
                }}
                tone="ghost"
              />
            </View>
          )}
          <Text style={styles.playerId}>ID: {profile.playerId.slice(0, 20)}...</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.sectionHeader}>
            <Feather name="bar-chart-2" size={18} color="#f97316" />
            <Text style={styles.sectionTitle}>Your Stats</Text>
          </View>

          <View style={styles.statsGrid}>
            <Animated.View entering={FadeIn.delay(300)} style={styles.statCard}>
              <Feather name="play" size={20} color="#22c55e" />
              <Text style={styles.statValue}>{stats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Games</Text>
            </Animated.View>
            <Animated.View entering={FadeIn.delay(400)} style={styles.statCard}>
              <Feather name="award" size={20} color="#f97316" />
              <Text style={styles.statValue}>{stats.gamesWon}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </Animated.View>
            <Animated.View entering={FadeIn.delay(500)} style={styles.statCard}>
              <Feather name="target" size={20} color="#2563eb" />
              <Text style={styles.statValue}>{formatPoints(stats.bestScore)}</Text>
              <Text style={styles.statLabel}>Best</Text>
            </Animated.View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="info" size={18} color="#94a3b8" />
            <Text style={styles.cardTitle}>About World Trail</Text>
          </View>
          <Text style={styles.cardText}>
            World Trail is a multi-game geography platform. Your identity persists across app
            restarts so your stats and active games are always waiting.
          </Text>
          <Text style={styles.cardText}>
            Currently featuring GeoGuessr Duel — with more games coming soon.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  content: { gap: 20, padding: 18, paddingBottom: 40 },
  hero: {
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 28,
    borderWidth: 1,
    gap: 12,
    padding: 24,
  },
  avatarCircle: {
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.15)",
    borderRadius: 50,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  nameRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  displayName: { color: "#f8fafc", fontSize: 24, fontWeight: "900" },
  editRow: { gap: 10, width: "100%" },
  nameInput: {
    backgroundColor: "#020617",
    borderColor: "#334155",
    borderRadius: 14,
    borderWidth: 1,
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "800",
    paddingHorizontal: 14,
    paddingVertical: 14,
    textAlign: "center",
  },
  playerId: { color: "#64748b", fontSize: 11 },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
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
  card: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  cardHeader: { alignItems: "center", flexDirection: "row", gap: 10 },
  cardTitle: { color: "#f8fafc", fontSize: 16, fontWeight: "800" },
  cardText: { color: "#94a3b8", fontSize: 14, lineHeight: 21 },
});