import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { PrimaryButton } from "@/components/PrimaryButton";
import { loadProfile } from "@/utils/profileStorage";
import { gameRegistry } from "@/utils/gameRegistry";

export default function IndexScreen() {
  const router = useRouter();
  const profile = loadProfile();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.hero}>
          <View style={styles.iconRing}>
            <Feather name="globe" size={48} color="#f97316" />
          </View>
          <Text style={styles.brand}>WORLD TRAIL</Text>
          <Text style={styles.tagline}>
            Explore. Guess. Conquer.
          </Text>
          <Text style={styles.desc}>
            Drop into Street View anywhere on Earth. Study the clues, pin your
            location, and compete against players worldwide.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.actionArea}>
          <PrimaryButton
            label="Start exploring"
            onPress={() => router.replace("/hub" as any)}
          />

          <View style={styles.gamePreview}>
            {gameRegistry.filter((g) => g.enabled).map((game, i) => (
              <Animated.View
                key={game.id}
                entering={FadeIn.delay(500 + i * 150).duration(400)}
                style={styles.previewCard}
              >
                <View style={[styles.previewIcon, { backgroundColor: `${game.color}1a` }]}>
                  <Feather name={game.icon as any} size={22} color={game.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewName}>{game.name}</Text>
                  <Text style={styles.previewDesc}>{game.description}</Text>
                </View>
              </Animated.View>
            ))}
          </View>

          <Text style={styles.footer}>
            Welcome back, {profile.displayName}
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020617" },
  wrapper: {
    flex: 1,
    gap: 28,
    justifyContent: "center",
    padding: 24,
  },
  hero: {
    alignItems: "center",
    gap: 14,
  },
  iconRing: {
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.12)",
    borderRadius: 60,
    height: 100,
    justifyContent: "center",
    width: 100,
  },
  brand: {
    color: "#f97316",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  tagline: {
    color: "#f8fafc",
    fontSize: 36,
    fontWeight: "900",
    lineHeight: 42,
    textAlign: "center",
  },
  desc: {
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },
  actionArea: {
    gap: 20,
  },
  gamePreview: {
    gap: 10,
  },
  previewCard: {
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 14,
  },
  previewIcon: {
    alignItems: "center",
    borderRadius: 14,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  previewName: { color: "#f8fafc", fontSize: 15, fontWeight: "800" },
  previewDesc: { color: "#94a3b8", fontSize: 12, lineHeight: 17 },
  footer: {
    color: "#475569",
    fontSize: 13,
    textAlign: "center",
  },
});