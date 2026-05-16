import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GuessMap } from "@/components/GuessMap";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Scoreboard } from "@/components/Scoreboard";
import { StreetViewPanel } from "@/components/StreetViewPanel";
import { formatDistance, formatPoints } from "@/utils/geography";
import { useGeoGame } from "@/utils/useGeoGame";

export default function HomeScreen() {
  const {
    activeGame,
    busy,
    createPrivateGame,
    currentRound,
    error,
    gameIdInput,
    joinByCode,
    nextRound,
    player,
    refreshGame,
    revealLocation,
    selectedGuess,
    setGameIdInput,
    setPlayerName,
    setSelectedGuess,
    startAutomatch,
    submitGuess,
    submittingGuess,
  } = useGeoGame();

  const [joining, setJoining] = useState(false);

  const statusLabel = useMemo(() => {
    if (!activeGame) {
      return "Idle";
    }

    switch (activeGame.status) {
      case "waiting":
        return "Waiting for opponent";
      case "active":
        return "Round live";
      case "round_result":
        return "Round result";
      case "finished":
        return "Game finished";
      default:
        return activeGame.status;
    }
  }, [activeGame]);

  const onJoin = async () => {
    if (!gameIdInput.trim()) {
      Alert.alert("Game ID required", "Enter the game ID your opponent shared.");
      return;
    }

    setJoining(true);
    try {
      await joinByCode();
    } finally {
      setJoining(false);
    }
  };

  const onSubmitGuess = async () => {
    if (!selectedGuess) {
      Alert.alert("Pin required", "Tap the map before submitting your guess.");
      return;
    }

    await submitGuess();
  };

  const roundSummary = revealLocation
    ? `${revealLocation.city}, ${revealLocation.country}`
    : "Guess as close to the Street View location as you can.";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={busy === "refreshing"}
            onRefresh={refreshGame}
            tintColor="#f8fafc"
          />
        }
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>World Trail</Text>
          <Text style={styles.title}>Realtime GeoGuessr duel</Text>
          <Text style={styles.subtitle}>
            Create a match, share the game ID, or jump into automatch. Each
            round streams live through Supabase Realtime and scores as soon as
            both players lock a guess.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Player</Text>
          <TextInput
            autoCapitalize="words"
            onChangeText={setPlayerName}
            placeholder="Display name"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={player.name}
          />
          <Text style={styles.helperText}>Player ID: {player.id}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Matchmaking</Text>
          <View style={styles.buttonRow}>
            <PrimaryButton
              disabled={busy !== "idle"}
              label={busy === "creating" ? "Creating..." : "Create private game"}
              onPress={createPrivateGame}
            />
            <PrimaryButton
              disabled={busy !== "idle"}
              label={busy === "matching" ? "Matching..." : "Automatch"}
              onPress={startAutomatch}
              tone="secondary"
            />
          </View>

          <View style={styles.joinRow}>
            <TextInput
              autoCapitalize="characters"
              onChangeText={setGameIdInput}
              placeholder="Enter game ID"
              placeholderTextColor="#94a3b8"
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {activeGame ? (
          <>
            <View style={styles.card}>
              <View style={styles.metaRow}>
                <View>
                  <Text style={styles.sectionTitle}>Game</Text>
                  <Text style={styles.metaText}>Game ID: {activeGame.inviteCode}</Text>
                  <Text style={styles.metaText}>Status: {statusLabel}</Text>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Round</Text>
                  <Text style={styles.metaText}>
                    {activeGame.currentRoundNumber}/{activeGame.roundCount}
                  </Text>
                </View>
              </View>
              <Scoreboard
                players={activeGame.players}
                revealLocation={Boolean(revealLocation)}
              />
            </View>

            <StreetViewPanel
              apiKey={process.env.EXPO_PUBLIC_MAPS_KEY ?? process.env.MAPS_KEY}
              heading={currentRound?.heading ?? 0}
              latitude={currentRound?.latitude ?? null}
              longitude={currentRound?.longitude ?? null}
              pitch={currentRound?.pitch ?? 0}
            />

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Guess Map</Text>
              <Text style={styles.helperText}>{roundSummary}</Text>
              <GuessMap
                actualGuess={revealLocation}
                editable={activeGame.status === "active" && !activeGame.myGuess}
                selectedGuess={selectedGuess}
                onSelectGuess={setSelectedGuess}
              />

              {activeGame.myGuess ? (
                <View style={styles.resultStrip}>
                  <Text style={styles.resultText}>
                    Your score: {formatPoints(activeGame.myGuess.points)}
                  </Text>
                  <Text style={styles.resultText}>
                    Distance: {formatDistance(activeGame.myGuess.distanceMeters)}
                  </Text>
                </View>
              ) : null}

              {revealLocation ? (
                <View style={styles.resultStrip}>
                  <Text style={styles.resultText}>
                    Actual: {revealLocation.city}, {revealLocation.country}
                  </Text>
                </View>
              ) : null}

              <View style={styles.buttonRow}>
                <PrimaryButton
                  disabled={
                    activeGame.status !== "active" ||
                    Boolean(activeGame.myGuess) ||
                    submittingGuess
                  }
                  label={submittingGuess ? "Submitting..." : "Submit guess"}
                  onPress={onSubmitGuess}
                />
                <PrimaryButton
                  disabled={activeGame.status !== "round_result"}
                  label="Next round"
                  onPress={nextRound}
                  tone="secondary"
                />
              </View>

              {activeGame.status === "waiting" ? (
                <View style={styles.waitingBox}>
                  <ActivityIndicator color="#f97316" />
                  <Text style={styles.waitingText}>
                    Waiting for an opponent to join with game ID{" "}
                    {activeGame.inviteCode}.
                  </Text>
                </View>
              ) : null}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 40,
    gap: 18,
  },
  hero: {
    paddingTop: 12,
    gap: 8,
  },
  eyebrow: {
    color: "#f97316",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: "#f8fafc",
    fontSize: 34,
    fontWeight: "900",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 22,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  sectionTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "800",
  },
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
  helperText: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 18,
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  joinRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  joinInput: {
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metaText: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },
  resultStrip: {
    backgroundColor: "#111827",
    borderRadius: 14,
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  resultText: {
    color: "#e2e8f0",
    fontSize: 14,
  },
  waitingBox: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  waitingText: {
    color: "#e2e8f0",
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
