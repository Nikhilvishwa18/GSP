import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import type { AppTheme } from "../../theme/theme";

interface Props {
  value: number;
  height?: number;
  color?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  height = 4,
  color,
  animated = true,
}: Props) {
  const { theme } = useTheme();
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const [animValue] = useState(() => new Animated.Value(animated ? 0 : clampedValue));

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: clampedValue,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clampedValue]);

  const trackStyle = createTrackStyles(theme, height);
  const fillColor = color ?? theme.colors.accent;

  return (
    <View style={trackStyle.track}>
      <Animated.View
        style={[
          trackStyle.fill,
          { backgroundColor: fillColor },
          {
            width: animValue.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
}

const createTrackStyles = (theme: AppTheme, height: number) =>
  StyleSheet.create({
    track: {
      height,
      borderRadius: height / 2,
      backgroundColor: theme.colors.surfaceSunken,
      overflow: "hidden",
    },
    fill: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      borderRadius: height / 2,
    },
  });
