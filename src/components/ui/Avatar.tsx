import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import type { AppTheme } from "../../theme/theme";

interface Props {
  name: string;
  size?: number;
}

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "S"
  );
}

export function Avatar({ name, size = 52 }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme, size);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{getInitials(name)}</Text>
    </View>
  );
}

const createStyles = (theme: AppTheme, size: number) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size * 0.308,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.accentMuted,
    },
    text: {
      fontFamily: theme.fonts.bold,
      fontSize: size * 0.346,
      color: theme.colors.accent,
    },
  });
