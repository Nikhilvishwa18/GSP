import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../theme/ThemeContext";
import type { AppTheme } from "../../theme/theme";

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="alert-circle-outline" size={28} color={theme.colors.danger} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <View style={styles.retryButton}>
          <Text style={styles.retryText} onPress={onRetry}>
            Try again
          </Text>
        </View>
      )}
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
      backgroundColor: theme.colors.dangerMuted,
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 15,
      color: theme.colors.text,
      textAlign: "center",
    },
    message: {
      fontFamily: theme.fonts.regular,
      fontSize: 13,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.xs,
      lineHeight: 18,
    },
    retryButton: {
      marginTop: theme.spacing.lg,
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radius.sm,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.sm + 2,
    },
    retryText: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 13,
      color: theme.colors.white,
    },
  });
