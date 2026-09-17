import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AttendanceData } from "../models/attendance";
import { useTheme } from "../theme/ThemeContext";
import type { AppTheme } from "../theme/theme";

import { AttendanceOverview } from "../components/AttendanceOverview";
import { SubjectList } from "../components/SubjectList";
import { SemesterPicker } from "../components/SemesterPicker";

interface Props {
  attendance: AttendanceData | null;
  attendanceBySemester: Record<number, AttendanceData>;
  onRefresh: () => Promise<void>;
  refreshing: boolean;
  onSemesterChange: (semester: number) => void;
}

export function AttendanceScreen({
  attendance,
  attendanceBySemester,
  onRefresh,
  refreshing,
  onSemesterChange,
}: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [selectedSemester, setSelectedSemester] = useState(
    attendance?.semester ?? 3,
  );

  const handleSemesterChange = (semester: number) => {
    if (semester === selectedSemester) return;
    setSelectedSemester(semester);
    onSemesterChange(semester);
  };

  if (!attendance) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading attendance...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Attendance</Text>
        </View>

        {attendance.availableSemesters.length > 0 && (
          <SemesterPicker
            semesters={attendance.availableSemesters}
            selected={selectedSemester}
            onSelect={handleSemesterChange}
          />
        )}

        <AttendanceOverview attendance={attendance} />

        <View style={styles.subjectsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subjects</Text>
            <Text style={styles.sectionCount}>{attendance.subjects.length}</Text>
          </View>
          <SubjectList subjects={attendance.subjects} />
        </View>
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
      marginBottom: theme.spacing.lg,
    },

    title: {
      fontFamily: theme.fonts.bold,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.3,
      color: theme.colors.text,
    },

    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
    },

    loadingText: {
      fontFamily: theme.fonts.medium,
      fontSize: 13,
      color: theme.colors.textSecondary,
    },

    subjectsSection: {
      marginTop: theme.spacing.xxl,
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
  });
