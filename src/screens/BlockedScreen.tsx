import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ThemeProvider, useTheme } from "../theme/ThemeContext";
import type { AppTheme } from "../theme/theme";

function BlockedScreenContent() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="ban-outline" size={32} color={theme.colors.danger} />
        </View>
        <Text style={styles.title}>Access Restricted</Text>
        <Text style={styles.message}>
          Your account has been restricted by the administrator. Contact admin for help.
        </Text>
        <Text style={styles.subMessage}>
          If you believe this is a mistake, please reach out to the administrator.
        </Text>
      </View>
    </SafeAreaProvider>
  );
}

export function BlockedScreen() {
  return (
    <ThemeProvider>
      <BlockedScreenContent />
    </ThemeProvider>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.xxxl,
      backgroundColor: theme.colors.background,
    },
    iconContainer: {
      width: 72,
      height: 72,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.dangerMuted,
      marginBottom: theme.spacing.xxl,
    },
    title: {
      fontFamily: theme.fonts.bold,
      fontSize: 22,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    message: {
      fontFamily: theme.fonts.regular,
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    subMessage: {
      fontFamily: theme.fonts.regular,
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.textTertiary,
      textAlign: "center",
    },
  });
