import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useGeoGameContext } from "@/games/geoguessr/GeoGameContext";

export default function GeoGuessrLobby() {
  const router = useRouter();
  const {
    activeGame,
    busy,
    createSoloGame,
    createPrivateGame,
    error,
    gameIdInput,
    joinByCode,
    player,
    setGameIdInput,
    setPlayerName,
    startAutomatch,
  } = useGeoGameContext();

  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (activeGame) {
      router.replace("/games/geoguessr/play" as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGame?.gameId]);

  const onJoin = async () => {
    if (!gameIdInput.trim()) {
      Alert.alert("Code required", "Enter a game code to join.");
      return;
    }
    setJoining(true);
    try { await joinByCode(); } finally { setJoining(false); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
          <View style={styles.heroIcon}>
            <Feather name="globe" size={32} color="#f97316" />
          </View>
          <Text style={styles.eyebrow}>GEOGUESSR DUEL</Text>
          <Text style={styles.title}>Where on Earth?</Text>
          <Text style={styles.subtitle}>
            Explore Street View. Find clues. Pin the location. Closest guess wins.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="user" size={18} color="#f97316" />
            <Text style={styles.sectionTitle}>Your Identity</Text>
          </View>
          <TextInput
            autoCapitalize="words"
            onChangeText={setPlayerName}
            placeholder="Display name"
            placeholderTextColor="#64748b"
            style={styles.input}
            value={player.name}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(500)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="play-circle" size={18} color="#f97316" />
            <Text style={styles.sectionTitle}>Game Modes</Text>
          </View>

          <View style={styles.modeGrid}>
            <Animated.View entering={FadeIn.delay(350)} style={styles.modeCard}>
              <Feather name="user" size={22} color="#22c55e" />
              <Text style={styles.modeTitle}>Solo</Text>
              <Text style={styles.modeDesc}>5 rounds, beat your best</Text>
              <PrimaryButton
                disabled={busy !== "idle"}
                label={busy === "solo" ? "Starting..." : "Play Solo"}
                onPress={createSoloGame}
                tone="ghost"
              />
            </Animated.View>

            <Animated.View entering={FadeIn.delay(450)} style={styles.modeCard}>
              <Feather name="users" size={22} color="#2563eb" />
              <Text style={styles.modeTitle}>Duel</Text>
              <Text style={styles.modeDesc}>1v1 against anyone</Text>
              <PrimaryButton
                disabled={busy !== "idle"}
                label={busy === "matching" ? "Matching..." : "Find Match"}
                onPress={startAutomatch}
                tone="secondary"
              />
            </Animated.View>

            <Animated.View entering={FadeIn.delay(550)} style={styles.modeCard}>
              <Feather name="lock" size={22} color="#f97316" />
              <Text style={styles.modeTitle}>Private</Text>
              <Text style={styles.modeDesc}>Create a party, share code</Text>
              <PrimaryButton
                disabled={busy !== "idle"}
                label={busy === "creating" ? "Creating..." : "Create Party"}
                onPress={createPrivateGame}
              />
            </Animated.View>
          </View>

          <View style={styles.divider} />

          <View style={styles.joinRow}>
            <TextInput
              autoCapitalize="characters"
              onChangeText={setGameIdInput}
              placeholder="Enter invite code"
              placeholderTextColor="#64748b"
              style={[styles.input, styles.joinInput]}
              value={gameIdInput}
            />
            <PrimaryButton
              disabled={joining || busy !== "idle"}
              label={joining ? "Joining..." : "Join"}
              onPress={onJoin}
              tone="ghost"
            />
          </View>

          {error ? (
            <Animated.View entering={FadeIn} style={styles.errorBox}>
              <Feather name="alert-circle" size={16} color="#fca5a5" />
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          ) : null}
        </Animated.View>

        {activeGame && !activeGame.isSolo && activeGame.status === "waiting" ? (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.waitingCard}>
            <ActivityIndicator color="#f97316" size="small" />
            <View style={{ flex: 1 }}>
              <Text style={styles.waitingTitle}>Waiting for opponent</Text>
              <Text style={styles.waitingSub}>
                Share code: <Text style={styles.codeHighlight}>{activeGame.inviteCode}</Text>
              </Text>
            </View>
          </Animated.View>
        ) : null}
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
    padding: 24,
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.15)",
    borderRadius: 40,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  eyebrow: {
    color: "#f97316",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: { color: "#f8fafc", fontSize: 34, fontWeight: "900" },
  subtitle: { color: "#94a3b8", fontSize: 14, lineHeight: 21, textAlign: "center" },
  card: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 22,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  cardHeader: { alignItems: "center", flexDirection: "row", gap: 10 },
  sectionTitle: { color: "#f8fafc", fontSize: 17, fontWeight: "800" },
  input: {
    backgroundColor: "#020617",
    borderColor: "#334155",
    borderRadius: 14,
    borderWidth: 1,
    color: "#f8fafc",
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  modeGrid: { gap: 10 },
  modeCard: {
    backgroundColor: "#0a0f1d",
    borderRadius: 18,
    gap: 6,
    padding: 16,
  },
  modeTitle: { color: "#f8fafc", fontSize: 16, fontWeight: "800" },
  modeDesc: { color: "#64748b", fontSize: 13 },
  divider: {
    backgroundColor: "#1e293b",
    height: 1,
    marginVertical: 4,
  },
  joinRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  joinInput: { flex: 1 },
  errorBox: {
    alignItems: "center",
    backgroundColor: "rgba(252,165,165,0.1)",
    borderRadius: 14,
    flexDirection: "row",
    gap: 8,
    padding: 12,
  },
  errorText: { color: "#fca5a5", flex: 1, fontSize: 13, lineHeight: 18 },
  waitingCard: {
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderColor: "#f97316",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 16,
  },
  waitingTitle: { color: "#f8fafc", fontSize: 15, fontWeight: "700" },
  waitingSub: { color: "#94a3b8", fontSize: 13 },
  codeHighlight: { color: "#f97316", fontWeight: "800", letterSpacing: 1 },
});