import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeContext";
import type { AppTheme } from "../theme/theme";

interface Props {
  onLogin: (rollNo: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function LoginScreen({ onLogin, loading = false, error = null }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!rollNo.trim() || !password.trim()) {
      return;
    }
    await onLogin(rollNo, password);
  };

  const isFormValid = rollNo.trim().length > 0 && password.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>GSP++</Text>
          <Text style={styles.subtitle}>Attendance at a glance</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Roll Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="keypad-outline"
                size={18}
                color={theme.colors.textTertiary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your roll number"
                placeholderTextColor={theme.colors.textTertiary}
                value={rollNo}
                onChangeText={setRollNo}
                editable={!loading}
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={theme.colors.textTertiary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.visibilityButton}
                disabled={loading}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color={theme.colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons
                name="alert-circle"
                size={15}
                color={theme.colors.danger}
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginButton, (!isFormValid || loading) && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={!isFormValid || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    container: {
      flex: 1,
      paddingHorizontal: theme.spacing.xl,
      justifyContent: "center",
      paddingBottom: theme.spacing.xxxxxl,
    },

    header: {
      marginBottom: theme.spacing.xxxxxl,
    },

    title: {
      fontFamily: theme.fonts.bold,
      fontSize: 34,
      lineHeight: 41,
      letterSpacing: -0.4,
      color: theme.colors.text,
    },

    subtitle: {
      fontFamily: theme.fonts.regular,
      fontSize: 15,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },

    form: {
      gap: theme.spacing.lg,
    },

    inputGroup: {
      gap: theme.spacing.sm - 1,
    },

    label: {
      fontFamily: theme.fonts.medium,
      fontSize: 13,
      color: theme.colors.textSecondary,
    },

    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surfaceSunken,
      height: 48,
    },

    inputIcon: {
      marginRight: theme.spacing.sm,
    },

    input: {
      flex: 1,
      height: 48,
      fontFamily: theme.fonts.regular,
      fontSize: 16,
      color: theme.colors.text,
    },

    visibilityButton: {
      padding: theme.spacing.xs,
    },

    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm + 2,
      backgroundColor: theme.colors.dangerMuted,
      borderRadius: theme.radius.sm,
    },

    errorText: {
      flex: 1,
      fontFamily: theme.fonts.medium,
      fontSize: 13,
      color: theme.colors.danger,
    },

    loginButton: {
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radius.md,
      marginTop: theme.spacing.sm,
    },

    loginButtonDisabled: {
      opacity: 0.5,
    },

    loginButtonText: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 16,
      color: theme.colors.white,
    },
  });
