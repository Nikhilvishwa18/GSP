import {
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeContext";
import type { AppTheme } from "../theme/theme";
import { useAttendanceGoal } from "../theme/AttendanceGoalContext";
import { Separator } from "../components/ui/Separator";

import * as Application from "expo-application";

interface Props {
  onLogout: () => Promise<void>;
}

const GOAL_MIN = 50;
const GOAL_MAX = 95;
const GOAL_STEP = 5;

export function SettingsScreen({ onLogout }: Props) {
  const { mode, setMode, theme } = useTheme();
  const { goal, setGoal } = useAttendanceGoal();
  const styles = createStyles(theme);
  const [showGoalSheet, setShowGoalSheet] = useState(false);
  const [showLogoutSheet, setShowLogoutSheet] = useState(false);
  const trackRef = useRef<View>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  const steps = [];
  for (let v = GOAL_MIN; v <= GOAL_MAX; v += GOAL_STEP) steps.push(v);

  const goalToPosition = (v: number) => {
    if (trackWidth === 0) return 0;
    return ((v - GOAL_MIN) / (GOAL_MAX - GOAL_MIN)) * trackWidth;
  };

  const positionToGoal = (x: number) => {
    if (trackWidth === 0) return goal;
    const ratio = Math.max(0, Math.min(1, x / trackWidth));
    const raw = GOAL_MIN + ratio * (GOAL_MAX - GOAL_MIN);
    const snapped = Math.round(raw / GOAL_STEP) * GOAL_STEP;
    return Math.max(GOAL_MIN, Math.min(GOAL_MAX, snapped));
  };

  const handleTrackPress = (evt: any) => {
    const { locationX } = evt.nativeEvent;
    const newGoal = positionToGoal(locationX);
    if (newGoal !== goal) {
      setGoal(newGoal);
    }
  };

  const openLink = (url: string) => {
    void Linking.openURL(url).catch(() => {});
  };

  const handleLogout = () => {
    setShowLogoutSheet(true);
  };

  const confirmLogout = async () => {
    setShowLogoutSheet(false);
    await onLogout();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>APPEARANCE</Text>
          <View style={styles.segmentedControl}>
            <Pressable
              style={[styles.segment, mode === "light" && styles.segmentActive]}
              onPress={() => {
                if (mode !== "light") {
                  setMode("light");
                }
              }}
            >
              <Ionicons
                name="sunny"
                size={16}
                color={mode === "light" ? theme.colors.accent : theme.colors.textTertiary}
              />
              <Text style={[styles.segmentText, mode === "light" && styles.segmentTextActive]}>
                Light
              </Text>
            </Pressable>
            <Pressable
              style={[styles.segment, mode === "dark" && styles.segmentActive]}
              onPress={() => {
                if (mode !== "dark") {
                  setMode("dark");
                }
              }}
            >
              <Ionicons
                name="moon"
                size={16}
                color={mode === "dark" ? theme.colors.accent : theme.colors.textTertiary}
              />
              <Text style={[styles.segmentText, mode === "dark" && styles.segmentTextActive]}>
                Dark
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DATA</Text>
          <View style={styles.group}>
            <Pressable style={styles.row} onPress={() => setShowGoalSheet(true)}>
              <View style={styles.rowIcon}>
                <Ionicons name="flag-outline" size={18} color={theme.colors.accent} />
              </View>
              <Text style={styles.rowTitle}>Attendance Goal</Text>
              <Text style={styles.rowValue}>{goal}%</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SUPPORT</Text>
          <View style={styles.group}>
            <Pressable style={styles.row} onPress={() => openLink("https://github.com/mahtab89")}>
              <View style={styles.rowIcon}>
                <Ionicons name="logo-github" size={18} color={theme.colors.accent} />
              </View>
              <Text style={styles.rowTitle}>GitHub</Text>
              <Ionicons name="open-outline" size={16} color={theme.colors.textTertiary} />
            </Pressable>
            <Separator inset={52} />
            <Pressable
              style={styles.row}
              onPress={() => openLink("mailto:mdmahtabyasin@gmail.com")}
            >
              <View style={styles.rowIcon}>
                <Ionicons name="mail-outline" size={18} color={theme.colors.accent} />
              </View>
              <Text style={styles.rowTitle}>Contact Support</Text>
              <Ionicons name="open-outline" size={16} color={theme.colors.textTertiary} />
            </Pressable>
            <Separator inset={52} />
            <Pressable
              style={styles.row}
              onPress={() =>
                openLink("upi://pay?pa=9608896428@sbi&pn=Mahtab%20Yasin&cu=INR")
              }
            >
              <View style={styles.rowIcon}>
                <Ionicons name="cafe-outline" size={18} color={theme.colors.accent} />
              </View>
              <Text style={styles.rowTitle}>Buy me a coffee</Text>
              <Ionicons name="open-outline" size={16} color={theme.colors.textTertiary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <View style={styles.group}>
            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Ionicons name="information-circle-outline" size={18} color={theme.colors.accent} />
              </View>
              <Text style={styles.rowTitle}>Version</Text>
              <Text style={styles.rowValue}>{Application.nativeApplicationVersion ?? "unknown"}</Text>
            </View>
            <Separator inset={52} />
            <View style={styles.row}>
              <View style={styles.rowIcon}>
                <Ionicons name="person-circle-outline" size={18} color={theme.colors.accent} />
              </View>
              <Text style={styles.rowTitle}>Author</Text>
              <Text style={styles.rowValue}>Mahtab Yasin</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.group}>
            <Pressable style={styles.row} onPress={handleLogout}>
              <View style={[styles.rowIcon, { backgroundColor: theme.colors.dangerMuted }]}>
                <Ionicons name="log-out-outline" size={18} color={theme.colors.danger} />
              </View>
              <Text style={[styles.rowTitle, { color: theme.colors.danger }]}>Log Out</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Attendance Goal Bottom Sheet */}
      <Modal visible={showGoalSheet} transparent animationType="fade" onRequestClose={() => setShowGoalSheet(false)}>
        <View style={styles.sheetOverlay}>
          <Pressable style={styles.sheetBackdrop} onPress={() => setShowGoalSheet(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Attendance Goal</Text>
            <Text style={styles.sheetSubtitle}>
              Set your target attendance percentage. Subjects below this will appear in alerts.
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{goal}%</Text>
              <View
                ref={trackRef}
                style={styles.sliderTrack}
                onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
              >
                <Pressable
                  style={[styles.sliderTrackFill, { width: goalToPosition(goal) }]}
                  onStartShouldSetResponder={() => false}
                  pointerEvents="none"
                />
                {steps.map((v) => {
                  const x = goalToPosition(v);
                  const isMajor = v % 10 === 0;
                  return (
                    <View
                      key={v}
                      style={[
                        styles.sliderTick,
                        { left: x },
                        isMajor ? styles.sliderTickMajor : styles.sliderTickMinor,
                      ]}
                    />
                  );
                })}
                <View style={[styles.sliderThumb, { left: goalToPosition(goal) }]} />
              </View>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>{GOAL_MIN}%</Text>
                <Text style={styles.sliderLabel}>{GOAL_MAX}%</Text>
              </View>
              <Pressable
                style={styles.sliderTrackTouchable}
                onLayout={(e) => {
                  if (trackWidth === 0) setTrackWidth(e.nativeEvent.layout.width);
                }}
                onPress={handleTrackPress}
              />
            </View>
            <Pressable style={styles.sheetClose} onPress={() => setShowGoalSheet(false)}>
              <Text style={styles.sheetCloseText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Bottom Sheet */}
      <Modal visible={showLogoutSheet} transparent animationType="fade" onRequestClose={() => setShowLogoutSheet(false)}>
        <View style={styles.sheetOverlay}>
          <Pressable style={styles.sheetBackdrop} onPress={() => setShowLogoutSheet(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={[styles.sheetIcon, { backgroundColor: theme.colors.dangerMuted }]}>
              <Ionicons name="log-out-outline" size={24} color={theme.colors.danger} />
            </View>
            <Text style={styles.sheetTitle}>Log Out?</Text>
            <Text style={styles.sheetSubtitle}>
              Your saved credentials and cached data will be removed from this device.
            </Text>
            <View style={styles.sheetActions}>
              <Pressable style={styles.sheetCancel} onPress={() => setShowLogoutSheet(false)}>
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.sheetConfirm} onPress={confirmLogout}>
                <Text style={styles.sheetConfirmText}>Log Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      padding: theme.spacing.xl,
      paddingBottom: theme.spacing.xxxxxl,
    },

    title: {
      fontFamily: theme.fonts.bold,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.3,
      color: theme.colors.text,
      marginBottom: theme.spacing.xxl,
    },

    section: {
      marginBottom: theme.spacing.xxl,
    },

    sectionLabel: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 11,
      letterSpacing: 0.6,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
    },

    segmentedControl: {
      flexDirection: "row",
      backgroundColor: theme.colors.surfaceSunken,
      borderRadius: theme.radius.sm,
      padding: 2,
    },

    segment: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.sm + 2,
      borderRadius: theme.radius.xs,
    },

    segmentActive: {
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },

    segmentText: {
      fontFamily: theme.fonts.medium,
      fontSize: 13,
      color: theme.colors.textTertiary,
    },

    segmentTextActive: {
      fontFamily: theme.fonts.semiBold,
      color: theme.colors.text,
    },

    group: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      overflow: "hidden",
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 48,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },

    rowIcon: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.accentMuted,
      marginRight: theme.spacing.md,
    },

    rowTitle: {
      flex: 1,
      fontFamily: theme.fonts.regular,
      fontSize: 15,
      color: theme.colors.text,
    },

    rowValue: {
      fontFamily: theme.fonts.medium,
      fontSize: 14,
      color: theme.colors.textSecondary,
    },

    sheetOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },

    sheetBackdrop: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },

    sheet: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      padding: theme.spacing.xl,
      paddingBottom: theme.spacing.xxxl,
      width: "100%",
    },

    sheetHandle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.border,
      marginBottom: theme.spacing.lg,
      alignSelf: "center",
    },

    sheetIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },

    sheetTitle: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 17,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      alignSelf: "center",
    },

    sheetSubtitle: {
      fontFamily: theme.fonts.regular,
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
      alignSelf: "center",
    },

    sliderContainer: {
      marginBottom: theme.spacing.xl,
    },

    sliderValue: {
      fontFamily: theme.fonts.bold,
      fontSize: 42,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },

    sliderTrack: {
      height: 52,
      justifyContent: "center",
    },

    sliderTrackTouchable: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    sliderTrackFill: {
      position: "absolute",
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.accent,
      top: 24,
      left: 0,
    },

    sliderTick: {
      position: "absolute",
      width: 2,
      borderRadius: 1,
      top: 22,
      marginLeft: -1,
    },

    sliderTickMinor: {
      height: 8,
      backgroundColor: theme.colors.border,
    },

    sliderTickMajor: {
      height: 12,
      backgroundColor: theme.colors.textTertiary,
      top: 20,
    },

    sliderThumb: {
      position: "absolute",
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.accent,
      top: 12,
      marginLeft: -14,
      borderWidth: 3,
      borderColor: theme.colors.background,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        android: {
          elevation: 4,
        },
      }),
    },

    sliderLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.sm,
    },

    sliderLabel: {
      fontFamily: theme.fonts.medium,
      fontSize: 11,
      color: theme.colors.textTertiary,
    },

    sheetClose: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.radius.sm,
      paddingVertical: theme.spacing.sm + 2,
      paddingHorizontal: theme.spacing.xxxxxl,
      alignSelf: "center",
    },

    sheetCloseText: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 15,
      color: theme.colors.white,
    },

    sheetActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      width: "100%",
    },

    sheetCancel: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.sm + 2,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.surfaceSunken,
    },

    sheetCancelText: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 15,
      color: theme.colors.textSecondary,
    },

    sheetConfirm: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.sm + 2,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.danger,
    },

    sheetConfirmText: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 15,
      color: theme.colors.white,
    },
  });
