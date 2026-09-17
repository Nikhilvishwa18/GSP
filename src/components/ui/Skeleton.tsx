import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import type { AppTheme } from "../../theme/theme";

interface SkeletonBlockProps {
  width: number;
  height: number;
  radius?: number;
}

export function SkeletonBlock({ width, height, radius = 8 }: SkeletonBlockProps) {
  const { theme } = useTheme();
  const [opacity] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: theme.colors.surfaceSunken,
        opacity,
      }}
    />
  );
}

export function SkeletonBlockFull({ height, radius = 8 }: { height: number; radius?: number }) {
  const { theme } = useTheme();
  const [opacity] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <View style={{ width: "100%" as any, height, borderRadius: radius, overflow: "hidden" }}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius,
            backgroundColor: theme.colors.surfaceSunken,
          },
          { opacity },
        ]}
      />
    </View>
  );
}

export function DashboardSkeleton() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <SkeletonBlock width={180} height={28} />
      <SkeletonBlock width={120} height={16} radius={4} />
      <View style={{ height: theme.spacing.xxl }} />
      <SkeletonBlockFull height={140} radius={theme.radius.lg} />
      <View style={{ height: theme.spacing.xxl }} />
      <SkeletonBlockFull height={100} radius={theme.radius.md} />
      <View style={{ height: theme.spacing.xxl }} />
      <SkeletonBlockFull height={200} radius={theme.radius.md} />
    </View>
  );
}

export function AttendanceSkeleton() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <SkeletonBlock width={160} height={28} />
      <SkeletonBlock width={200} height={14} radius={4} />
      <View style={{ height: theme.spacing.xxl }} />
      <View style={styles.pillRow}>
        <SkeletonBlock width={60} height={32} radius={theme.radius.full} />
        <SkeletonBlock width={60} height={32} radius={theme.radius.full} />
        <SkeletonBlock width={60} height={32} radius={theme.radius.full} />
      </View>
      <View style={{ height: theme.spacing.xxl }} />
      <SkeletonBlockFull height={120} radius={theme.radius.md} />
      <View style={{ height: theme.spacing.xxl }} />
      <SkeletonBlockFull height={180} radius={theme.radius.md} />
    </View>
  );
}

export function ProfileSkeleton() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <SkeletonBlock width={140} height={28} />
      <View style={{ height: theme.spacing.xxl }} />
      <View style={styles.profileRow}>
        <SkeletonBlock width={56} height={56} radius={16} />
        <View style={{ flex: 1, marginLeft: theme.spacing.md, gap: theme.spacing.sm }}>
          <SkeletonBlock width={140} height={18} />
          <SkeletonBlock width={100} height={14} radius={4} />
        </View>
      </View>
      <View style={{ height: theme.spacing.xxl }} />
      <SkeletonBlockFull height={180} radius={theme.radius.md} />
      <View style={{ height: theme.spacing.lg }} />
      <SkeletonBlockFull height={140} radius={theme.radius.md} />
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
    },
    pillRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    profileRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
