import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { StreetViewPanel } from "@/games/geoguessr/components/StreetViewPanel";
import { GuessMap } from "@/games/geoguessr/components/GuessMap";
import { Scoreboard } from "@/games/geoguessr/components/Scoreboard";
import { useGeoGameContext } from "@/games/geoguessr/GeoGameContext";
import { formatDistance, formatPoints } from "@/utils/geography";

export default function GeoGuessrPlay() {
  const router = useRouter();
  const {
    activeGame,
    busy,
    currentRound,
    error,
    nextRound,
    revealLocation,
    selectedGuess,
    setSelectedGuess,
    submitGuess,
    submittingGuess,
  } = useGeoGameContext();

  useEffect(() => {
    if (!activeGame) {
      router.replace("/games/geoguessr/lobby" as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGame]);

  const isResultPhase = activeGame?.status === "round_result" || activeGame?.status === "finished";
  const isFinished = activeGame?.status === "finished";
  const canGuess = activeGame?.status === "active" && !activeGame?.myGuess;

  const onSubmitGuess = async () => {
    if (!selectedGuess) {
      Alert.alert("Place a pin", "Tap on the world map before submitting.");
      return;
    }
    await submitGuess();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.topBar}>
          <View style={styles.topLeft}>
            <Text style={styles.gameLabel}>GEOGUESSR</Text>
            <Text style={styles.codeText}>{activeGame?.inviteCode}</Text>
          </View>
          <View style={styles.roundPill}>
            <Text style={styles.roundPillText}>
              Round {activeGame?.currentRoundNumber}/{activeGame?.roundCount}
            </Text>
          </View>
        </Animated.View>

        <Scoreboard
          players={activeGame?.players ?? []}
          revealLocation={isResultPhase}
        />

        <StreetViewPanel
          apiKey={process.env.EXPO_PUBLIC_MAPS_KEY ?? process.env.MAPS_KEY}
          heading={currentRound?.heading ?? 0}
          latitude={currentRound?.latitude ?? null}
          longitude={currentRound?.longitude ?? null}
          pitch={currentRound?.pitch ?? 0}
        />

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="map-pin" size={18} color={canGuess ? "#22c55e" : "#f97316"} />
            <Text style={styles.sectionTitle}>
              {canGuess ? "Drop your pin" : isResultPhase ? "Results" : "Locked in"}
            </Text>
          </View>

          {canGuess ? (
            <Text style={styles.helperText}>
              Explore the Street View above, then tap the map to place your guess.
            </Text>
          ) : null}

          <GuessMap
            actualGuess={revealLocation}
            editable={canGuess}
            onSelectGuess={setSelectedGuess}
            selectedGuess={selectedGuess}
          />

          {activeGame?.myGuess && revealLocation ? (
            <Animated.View entering={FadeIn} style={styles.resultStrip}>
              <View style={styles.resultRow}>
                <Feather name="target" size={16} color="#f97316" />
                <Text style={styles.resultText}>
                  {formatPoints(activeGame.myGuess.points)}
                </Text>
              </View>
              <View style={styles.resultRow}>
                <Feather name="map" size={16} color="#94a3b8" />
                <Text style={styles.resultText}>
                  {formatDistance(activeGame.myGuess.distanceMeters)} away
                </Text>
              </View>
            </Animated.View>
          ) : null}

          {revealLocation ? (
            <Animated.View entering={FadeIn} style={styles.revealStrip}>
              <Feather name="check-circle" size={16} color="#22c55e" />
              <Text style={styles.revealText}>
                {revealLocation.city}, {revealLocation.country}
              </Text>
            </Animated.View>
          ) : null}

          <View style={styles.actionRow}>
            {canGuess ? (
              <PrimaryButton
                disabled={!selectedGuess || submittingGuess}
                label={submittingGuess ? "Submitting..." : "Lock in guess"}
                onPress={onSubmitGuess}
              />
            ) : null}

            {isResultPhase && !isFinished ? (
              <PrimaryButton
                disabled={busy !== "idle"}
                label={busy === "advancing" ? "Loading..." : "Next round"}
                onPress={nextRound}
                tone="secondary"
              />
            ) : null}

            {isFinished ? (
              <PrimaryButton
                label="View results"
                onPress={() => router.push("/games/geoguessr/result" as any)}
                tone="secondary"
              />
            ) : null}
          </View>

          {activeGame?.status === "waiting" && !activeGame.isSolo ? (
            <View style={styles.waitingBox}>
              <ActivityIndicator color="#f97316" size="small" />
              <Text style={styles.waitingText}>
                Waiting for opponent to join with code{" "}
                <Text style={styles.codeHighlight}>{activeGame.inviteCode}</Text>
              </Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={16} color="#fca5a5" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  content: { gap: 14, padding: 18, paddingBottom: 40 },
  topBar: {
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },
  topLeft: { gap: 2 },
  gameLabel: { color: "#f97316", fontSize: 11, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase" },
  codeText: { color: "#94a3b8", fontSize: 12 },
  roundPill: { backgroundColor: "#1d4ed8", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
  roundPillText: { color: "#eff6ff", fontSize: 13, fontWeight: "800" },
  card: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  cardHeader: { alignItems: "center", flexDirection: "row", gap: 10 },
  sectionTitle: { color: "#f8fafc", fontSize: 17, fontWeight: "800" },
  helperText: { color: "#94a3b8", fontSize: 13, lineHeight: 18 },
  actionRow: { gap: 8 },
  resultStrip: {
    backgroundColor: "#111827",
    borderRadius: 14,
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  resultRow: { alignItems: "center", flexDirection: "row", gap: 6 },
  resultText: { color: "#e2e8f0", fontSize: 14, fontWeight: "600" },
  revealStrip: {
    alignItems: "center",
    backgroundColor: "rgba(34,197,94,0.1)",
    borderRadius: 14,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  revealText: { color: "#22c55e", fontSize: 14, fontWeight: "700" },
  waitingBox: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  waitingText: { color: "#e2e8f0", flex: 1, fontSize: 13, lineHeight: 19 },
  codeHighlight: { color: "#f97316", fontWeight: "800" },
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