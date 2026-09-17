import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { SubjectAttendance } from "../models/attendance";
import { useTheme } from "../theme/ThemeContext";
import type { AppTheme } from "../theme/theme";
import { Separator } from "./ui/Separator";

interface Props {
  subject: SubjectAttendance;
  index: number;
}

export function AttendanceCard({ subject, index }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      delay: index * 40,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const isLab = subject.type === "PRACTICAL/LAB";

  return (
    <Animated.View style={{ opacity }}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={isLab ? "flask-outline" : "book-outline"}
            size={16}
            color={theme.colors.textTertiary}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={1}>
              {subject.name}
            </Text>
            <Text style={styles.percentage}>
              {subject.percentage}%
            </Text>
          </View>
          <Text style={styles.meta}>
            {isLab ? "LAB" : "THEORY"} · {subject.classesAttended}/{subject.classesTaken} classes
          </Text>
        </View>
      </View>
      <Separator inset={52} />
    </Animated.View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
      minWidth: 0,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    name: {
      flex: 1,
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
      color: theme.colors.text,
      marginRight: theme.spacing.sm,
    },
    percentage: {
      fontFamily: theme.fonts.bold,
      fontSize: 14,
      color: theme.colors.text,
    },
    meta: {
      fontFamily: theme.fonts.medium,
      fontSize: 11,
      color: theme.colors.textTertiary,
      marginTop: 3,
    },
  });
