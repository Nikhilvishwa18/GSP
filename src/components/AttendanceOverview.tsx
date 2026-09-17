import { StyleSheet, Text, View } from "react-native";

import type { AttendanceData } from "../models/attendance";
import { useTheme } from "../theme/ThemeContext";
import type { AppTheme } from "../theme/theme";
import { useAttendanceGoal } from "../theme/AttendanceGoalContext";
import { getStatusBadge } from "../utils/attendanceUtils";
import { ProgressBar } from "./ui/ProgressBar";
import { Badge } from "./ui/Badge";

interface Props {
  attendance: AttendanceData;
}

export function AttendanceOverview({ attendance }: Props) {
  const { theme } = useTheme();
  const { goal } = useAttendanceGoal();
  const styles = createStyles(theme);
  const status = getStatusBadge(attendance.summary.overall, goal);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.label}>OVERALL</Text>
          <View style={styles.percentageRow}>
            <Text style={styles.percentage}>
              {attendance.summary.overall.toFixed(1)}
            </Text>
            <Text style={styles.percentSymbol}>%</Text>
          </View>
        </View>
        <Badge label={status.label} variant={status.variant} />
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar
          value={attendance.summary.overall}
          height={6}
          color={theme.colors.accent}
        />
      </View>

      <View style={styles.breakdown}>
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Theory</Text>
          <Text style={styles.breakdownValue}>{attendance.summary.theory.toFixed(1)}%</Text>
        </View>
        <View style={styles.breakdownDivider} />
        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Lab</Text>
          <Text style={styles.breakdownValue}>{attendance.summary.lab.toFixed(1)}%</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.xxl,
    },

    topRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },

    label: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 11,
      letterSpacing: 0.6,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.xs,
    },

    percentageRow: {
      flexDirection: "row",
      alignItems: "baseline",
    },

    percentage: {
      fontFamily: theme.fonts.extraBold,
      fontSize: 40,
      lineHeight: 48,
      letterSpacing: -1.2,
      color: theme.colors.text,
    },

    percentSymbol: {
      fontFamily: theme.fonts.bold,
      fontSize: 18,
      color: theme.colors.textSecondary,
      marginLeft: 2,
    },

    progressContainer: {
      marginVertical: theme.spacing.lg,
    },

    breakdown: {
      flexDirection: "row",
      alignItems: "center",
    },

    breakdownItem: {
      flex: 1,
    },

    breakdownLabel: {
      fontFamily: theme.fonts.medium,
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xxs,
    },

    breakdownValue: {
      fontFamily: theme.fonts.bold,
      fontSize: 17,
      color: theme.colors.text,
    },

    breakdownDivider: {
      width: 1,
      height: 32,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.xl,
    },
  });
