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
import { GuessMap } from "@/components/GuessMap";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Scoreboard } from "@/components/Scoreboard";
import { StreetViewPanel } from "@/components/StreetViewPanel";
import { formatDistance, formatPoints } from "@/utils/geography";
import { useGeoGame } from "@/utils/useGeoGame";

export function GeoGameScreen() {
  const {
    activeGame,
    busy,
    createSoloGame,
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
      return "Ready";
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
      Alert.alert("Game ID required", "Enter a game ID to join.");
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
      Alert.alert("Place a pin", "Tap on the world map before submitting.");
      return;
    }

    await submitGuess();
  };

  const roundSummary = revealLocation
    ? `${revealLocation.city}, ${revealLocation.country}`
    : "Look around, drop a pin on the map, and lock in your guess.";

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          onRefresh={refreshGame}
          refreshing={busy === "refreshing"}
          tintColor="#f8fafc"
        />
      }
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>GeoGuessr Mode</Text>
        <Text style={styles.title}>Play solo or duel in realtime</Text>
        <Text style={styles.subtitle}>
          Start a solo run, create a private room, join by code, or let
          automatch pair you. Each round scores the distance between your pin
          and the hidden Street View location.
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
        <Text style={styles.helperText}>Your session ID: {player.id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Lobby</Text>
        <Text style={styles.helperText}>
          If create or automatch fails, the error below should now tell you
          exactly whether the issue is env vars, missing Supabase RPCs, or a
          full room.
        </Text>
        <View style={styles.buttonRow}>
          <PrimaryButton
            disabled={busy !== "idle"}
            label={busy === "solo" ? "Starting..." : "Solo mode"}
            onPress={createSoloGame}
            tone="ghost"
          />
          <PrimaryButton
            disabled={busy !== "idle"}
            label={busy === "creating" ? "Creating..." : "Create game"}
            onPress={createPrivateGame}
          />
        </View>
        <View style={styles.buttonRow}>
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
                <Text style={styles.sectionTitle}>Current Match</Text>
                <Text style={styles.metaText}>Game ID: {activeGame.inviteCode}</Text>
                <Text style={styles.metaText}>
                  Mode: {activeGame.isSolo ? "Solo" : "Multiplayer"}
                </Text>
                <Text style={styles.metaText}>Status: {statusLabel}</Text>
              </View>
              <View style={styles.roundPill}>
                <Text style={styles.roundPillText}>
                  Round {activeGame.currentRoundNumber}/{activeGame.roundCount}
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
            <Text style={styles.sectionTitle}>World Map</Text>
            <Text style={styles.helperText}>{roundSummary}</Text>
            <GuessMap
              actualGuess={revealLocation}
              editable={activeGame.status === "active" && !activeGame.myGuess}
              onSelectGuess={setSelectedGuess}
              selectedGuess={selectedGuess}
            />

            {activeGame.myGuess ? (
              <View style={styles.resultStrip}>
                <Text style={styles.resultText}>
                  Score: {formatPoints(activeGame.myGuess.points)}
                </Text>
                <Text style={styles.resultText}>
                  Distance: {formatDistance(activeGame.myGuess.distanceMeters)}
                </Text>
              </View>
            ) : null}

            {revealLocation ? (
              <View style={styles.resultStrip}>
                <Text style={styles.resultText}>
                  Actual location: {revealLocation.city}, {revealLocation.country}
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
                label={busy === "advancing" ? "Loading..." : "Next round"}
                onPress={nextRound}
                tone="secondary"
              />
            </View>

            {activeGame.status === "waiting" && !activeGame.isSolo ? (
              <View style={styles.waitingBox}>
                <ActivityIndicator color="#f97316" />
                <Text style={styles.waitingText}>
                  Waiting for another player to join with game ID{" "}
                  {activeGame.inviteCode}.
                </Text>
              </View>
            ) : null}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingHorizontal: 18,
    paddingBottom: 40,
    paddingTop: 12,
  },
  hero: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 28,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  eyebrow: {
    color: "#f97316",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    color: "#f8fafc",
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 21,
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
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  joinRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  joinInput: {
    flex: 1,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  metaText: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },
  roundPill: {
    backgroundColor: "#1d4ed8",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  roundPillText: {
    color: "#eff6ff",
    fontSize: 13,
    fontWeight: "800",
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
