import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import type { AppTheme } from "../../theme/theme";

type Variant = "success" | "warning" | "danger" | "accent";

interface Props {
  label: string;
  variant?: Variant;
}

const variantConfig = {
  success: (theme: AppTheme) => ({
    bg: theme.colors.successMuted,
    color: theme.colors.success,
  }),
  warning: (theme: AppTheme) => ({
    bg: theme.colors.warningMuted,
    color: theme.colors.warning,
  }),
  danger: (theme: AppTheme) => ({
    bg: theme.colors.dangerMuted,
    color: theme.colors.danger,
  }),
  accent: (theme: AppTheme) => ({
    bg: theme.colors.accentMuted,
    color: theme.colors.accent,
  }),
} as const;

export function Badge({ label, variant = "accent" }: Props) {
  const { theme } = useTheme();
  const config = variantConfig[variant](theme);
  const styles = createStyles(theme, config.bg, config.color);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const createStyles = (theme: AppTheme, bg: string, color: string) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      borderRadius: theme.radius.full,
      paddingHorizontal: theme.spacing.sm + 2,
      paddingVertical: theme.spacing.xs + 1,
      backgroundColor: bg,
    },
    text: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 11,
      color,
    },
  });
