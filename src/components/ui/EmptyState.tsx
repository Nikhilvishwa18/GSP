import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../theme/ThemeContext";
import type { AppTheme } from "../../theme/theme";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={28} color={theme.colors.textTertiary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.xxxxxl,
      paddingHorizontal: theme.spacing.xxxl,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surfaceSunken,
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 15,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    subtitle: {
      fontFamily: theme.fonts.regular,
      fontSize: 13,
      color: theme.colors.textTertiary,
      textAlign: "center",
      marginTop: theme.spacing.xs,
      lineHeight: 18,
    },
  });
