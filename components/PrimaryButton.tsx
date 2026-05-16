import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type PrimaryButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void | Promise<void>;
  tone?: "primary" | "secondary" | "ghost";
};

const toneStyles: Record<
  NonNullable<PrimaryButtonProps["tone"]>,
  ViewStyle
> = {
  primary: {
    backgroundColor: "#f97316",
  },
  secondary: {
    backgroundColor: "#2563eb",
  },
  ghost: {
    backgroundColor: "#111827",
    borderColor: "#334155",
    borderWidth: 1,
  },
};

export function PrimaryButton({
  disabled,
  label,
  onPress,
  tone = "primary",
}: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        void onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        toneStyles[tone],
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
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
  label: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
});
