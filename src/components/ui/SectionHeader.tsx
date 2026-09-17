import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import type { AppTheme } from "../../theme/theme";

interface Props {
  title: string;
  right?: React.ReactNode;
}

export function SectionHeader({ title, right }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      {right}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
    },
    title: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 11,
      letterSpacing: 0.6,
      color: theme.colors.textTertiary,
    },
  });
