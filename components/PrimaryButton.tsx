import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PrimaryButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void | Promise<void>;
  tone?: "primary" | "secondary" | "ghost";
};

const toneStyles: Record<NonNullable<PrimaryButtonProps["tone"]>, ViewStyle> = {
  primary: { backgroundColor: "#f97316" },
  secondary: { backgroundColor: "#2563eb" },
  ghost: { backgroundColor: "#111827", borderColor: "#334155", borderWidth: 1 },
};

export function PrimaryButton({
  disabled,
  label,
  onPress,
  tone = "primary",
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      onPress={() => {
        void onPress();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.96, { stiffness: 400, damping: 20 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { stiffness: 400, damping: 20 });
      }}
      style={[
        styles.button,
        toneStyles[tone],
        disabled ? styles.disabled : null,
        animatedStyle,
      ]}
    >
      <Text style={[styles.label, tone === "ghost" && styles.ghostLabel]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 16,
    flex: 1,
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  label: { color: "#f8fafc", fontSize: 15, fontWeight: "800", textAlign: "center" },
  ghostLabel: { color: "#cbd5e1" },
  disabled: { opacity: 0.45 },
});