import { StyleSheet, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import type { AppTheme } from "../../theme/theme";

interface Props {
  inset?: number;
  color?: string;
}

export function Separator({ inset = 0, color }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme, inset, color);

  return <View style={styles.line} />;
}

const createStyles = (theme: AppTheme, inset: number, color?: string) =>
  StyleSheet.create({
    line: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: color ?? theme.colors.border,
      marginLeft: inset,
    },
  });
