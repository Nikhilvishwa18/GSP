import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "../theme/ThemeContext";
import type { AppTheme } from "../theme/theme";

interface Props {
  semesters: number[];
  selected: number;
  onSelect: (semester: number) => void;
}

export function SemesterPicker({ semesters, selected, onSelect }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {semesters.map((semester) => {
          const isActive = semester === selected;
          return (
            <TouchableOpacity
              key={semester}
              activeOpacity={0.7}
              onPress={() => onSelect(semester)}
              style={[styles.pill, isActive && styles.activePill]}
            >
              <Text style={[styles.pillText, isActive && styles.activePillText]}>
                Sem {semester}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.xl,
    },
    content: {
      gap: theme.spacing.sm,
    },
    pill: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm + 1,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surfaceSunken,
    },
    activePill: {
      backgroundColor: theme.colors.accent,
    },
    pillText: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
    activePillText: {
      color: theme.colors.white,
    },
  });
