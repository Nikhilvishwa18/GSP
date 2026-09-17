import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import type { AttendanceData } from "../models/attendance";
import { formatBranchShort, formatRelativeTime } from "../utils/formatters";
import { useTheme } from "../theme/ThemeContext";
import type { AppTheme } from "../theme/theme";
import { useAttendanceGoal } from "../theme/AttendanceGoalContext";
import {
  getStatusBadge,
  computeTotalClasses,
  getAlertSubjects,
} from "../utils/attendanceUtils";

import { ProgressBar } from "../components/ui/ProgressBar";
import { Badge } from "../components/ui/Badge";
import { Separator } from "../components/ui/Separator";

interface Props {
  attendance: AttendanceData;
  lastFetched: number | null;
}

export function HomeScreen({ attendance, lastFetched }: Props) {
  const { theme } = useTheme();
  const { goal } = useAttendanceGoal();
  const styles = createStyles(theme);

  const overallPercentage = attendance.summary.overall;
  const status = getStatusBadge(overallPercentage, goal);
  const classSummary = computeTotalClasses(attendance.subjects);
  const alertSubjects = getAlertSubjects(attendance.subjects, goal);

  const theoryCount = attendance.subjects.filter(
    (s) => s.type === "THEORY",
  ).length;
  const labCount = attendance.subjects.filter(
    (s) => s.type === "PRACTICAL/LAB",
  ).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {attendance.name.split(" ")[0]}
          </Text>
          <Text style={styles.subtitle}>
            {formatBranchShort(attendance.branch)} · Sem {attendance.semester}
          </Text>
        </View>

        {/* Hero: Overall Attendance */}
        <View style={styles.heroSection}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>OVERALL ATTENDANCE</Text>
              <View style={styles.heroRow}>
                <Text style={styles.heroValue}>
                  {overallPercentage.toFixed(1)}
                </Text>
                <Text style={styles.heroPercent}>%</Text>
              </View>
            </View>
            <Badge label={status.label} variant={status.variant} />
          </View>
          <ProgressBar
            value={overallPercentage}
            height={6}
            color={theme.colors.accent}
          />
        </View>

        {/* Class Summary */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CLASSES THIS SEMESTER</Text>
          <View style={styles.classSummaryRow}>
            <View style={styles.classNumber}>
              <Text style={styles.classBig}>{classSummary.totalAttended}</Text>
              <Text style={styles.classSmall}>
                {" "}
                / {classSummary.totalTaken}
              </Text>
            </View>
            <Text style={styles.classSubtext}>classes attended</Text>
          </View>
          <ProgressBar
            value={classSummary.percentage}
            height={4}
            color={theme.colors.accent}
          />
          <Text style={styles.classMeta}>
            {classSummary.totalTaken - classSummary.totalAttended} classes
            missed
          </Text>
        </View>

        {/* Theory / Lab Quick Stats */}
        <View style={styles.splitCard}>
          <View style={styles.splitColumn}>
            <Text style={styles.splitLabel}>Theory</Text>
            <Text style={styles.splitValue}>
              {attendance.summary.theory.toFixed(1)}%
            </Text>
            <ProgressBar
              value={attendance.summary.theory}
              height={3}
              color={theme.colors.accent}
            />
            <Text style={styles.splitMeta}>{theoryCount} subjects</Text>
          </View>
          <View style={styles.splitDivider} />
          <View style={styles.splitColumn}>
            <Text style={styles.splitLabel}>Lab</Text>
            <Text style={styles.splitValue}>
              {attendance.summary.lab.toFixed(1)}%
            </Text>
            <ProgressBar
              value={attendance.summary.lab}
              height={3}
              color={theme.colors.accent}
            />
            <Text style={styles.splitMeta}>{labCount} subjects</Text>
          </View>
        </View>

        {/* Subject Alerts */}
        {alertSubjects.length > 0 ? (
          <View style={styles.alertsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Needs Attention</Text>
              <Text style={styles.sectionCount}>{alertSubjects.length}</Text>
            </View>
            <View style={styles.alertsList}>
              {alertSubjects.map((subject, index) => (
                <View key={`${subject.name}-${index}`}>
                  <View style={styles.alertRow}>
                    <View style={styles.alertIconContainer}>
                      <Ionicons
                        name={
                          subject.type === "PRACTICAL/LAB"
                            ? "flask-outline"
                            : "book-outline"
                        }
                        size={15}
                        color={theme.colors.textTertiary}
                      />
                    </View>
                    <View style={styles.alertContent}>
                      <Text style={styles.alertName} numberOfLines={1}>
                        {subject.name}
                      </Text>
                      <Text style={styles.alertMeta}>
                        {subject.percentage}% · {subject.classesAttended}/
                        {subject.classesTaken} classes
                      </Text>
                    </View>
                    <View style={styles.alertRight}>
                      {subject.reachable ? (
                        <Text style={styles.alertNeeded}>
                          +{subject.classesNeeded} more
                        </Text>
                      ) : (
                        <Text style={styles.alertUnreachable}>Critical</Text>
                      )}
                    </View>
                  </View>
                  {index < alertSubjects.length - 1 && <Separator inset={44} />}
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.allGoodCard}>
            <View style={styles.allGoodIcon}>
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={theme.colors.success}
              />
            </View>
            <View>
              <Text style={styles.allGoodTitle}>All subjects on track</Text>
              <Text style={styles.allGoodMeta}>
                Every subject is above {goal}% attendance
              </Text>
            </View>
          </View>
        )}

        {lastFetched && (
          <Text style={styles.lastFetched}>
            Updated {formatRelativeTime(new Date(lastFetched))}
          </Text>
        )}
      </ScrollView>
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
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxxxl,
    },

    header: {
      marginBottom: theme.spacing.xxl,
    },

    greeting: {
      fontFamily: theme.fonts.bold,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.3,
      color: theme.colors.text,
    },

    subtitle: {
      fontFamily: theme.fonts.regular,
      fontSize: 15,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xxs,
    },

    heroSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
    },

    heroTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },

    heroLabel: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 11,
      letterSpacing: 0.6,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.xs,
    },

    heroRow: {
      flexDirection: "row",
      alignItems: "baseline",
    },

    heroValue: {
      fontFamily: theme.fonts.extraBold,
      fontSize: 48,
      lineHeight: 56,
      letterSpacing: -1.5,
      color: theme.colors.text,
    },

    heroPercent: {
      fontFamily: theme.fonts.bold,
      fontSize: 20,
      color: theme.colors.textSecondary,
      marginLeft: 2,
    },

    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
    },

    cardLabel: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 11,
      letterSpacing: 0.6,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.md,
    },

    classSummaryRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },

    classNumber: {
      flexDirection: "row",
      alignItems: "baseline",
    },

    classBig: {
      fontFamily: theme.fonts.extraBold,
      fontSize: 32,
      lineHeight: 38,
      letterSpacing: -0.8,
      color: theme.colors.text,
    },

    classSmall: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 18,
      color: theme.colors.textSecondary,
    },

    classSubtext: {
      fontFamily: theme.fonts.medium,
      fontSize: 12,
      color: theme.colors.textTertiary,
    },

    classMeta: {
      fontFamily: theme.fonts.medium,
      fontSize: 12,
      color: theme.colors.textTertiary,
      marginTop: theme.spacing.sm,
    },

    splitCard: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.xxl,
    },

    splitColumn: {
      flex: 1,
    },

    splitDivider: {
      width: 1,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.xl,
    },

    splitLabel: {
      fontFamily: theme.fonts.medium,
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },

    splitValue: {
      fontFamily: theme.fonts.bold,
      fontSize: 20,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },

    splitMeta: {
      fontFamily: theme.fonts.medium,
      fontSize: 11,
      color: theme.colors.textTertiary,
      marginTop: theme.spacing.sm,
    },

    alertsSection: {
      marginBottom: theme.spacing.xxl,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },

    sectionTitle: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 17,
      color: theme.colors.text,
    },

    sectionCount: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 12,
      color: theme.colors.textTertiary,
      backgroundColor: theme.colors.surfaceSunken,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.radius.full,
      overflow: "hidden",
    },

    alertsList: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      paddingHorizontal: theme.spacing.lg,
    },

    alertRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
    },

    alertIconContainer: {
      width: 28,
      height: 28,
      borderRadius: 7,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },

    alertContent: {
      flex: 1,
      minWidth: 0,
    },

    alertName: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 13,
      color: theme.colors.text,
    },

    alertMeta: {
      fontFamily: theme.fonts.medium,
      fontSize: 11,
      color: theme.colors.textTertiary,
      marginTop: 2,
    },

    alertRight: {
      marginLeft: theme.spacing.sm,
    },

    alertNeeded: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 12,
      color: theme.colors.accent,
    },

    alertUnreachable: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 12,
      color: theme.colors.danger,
    },

    allGoodCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.xxl,
      gap: theme.spacing.md,
    },

    allGoodIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.successMuted,
    },

    allGoodTitle: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
      color: theme.colors.text,
    },

    allGoodMeta: {
      fontFamily: theme.fonts.regular,
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },

    quickInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.sm,
    },

    quickInfoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },

    quickInfoText: {
      fontFamily: theme.fonts.medium,
      fontSize: 11,
      color: theme.colors.textTertiary,
    },

    quickInfoDivider: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: theme.colors.border,
    },

    lastFetched: {
      fontFamily: theme.fonts.medium,
      fontSize: 11,
      color: theme.colors.textTertiary,
      textAlign: "center",
      marginTop: theme.spacing.lg,
    },
  });
