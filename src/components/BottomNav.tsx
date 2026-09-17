import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../theme/ThemeContext";
import type { AppTheme } from "../theme/theme";

type Tab = "home" | "attendance" | "profile" | "settings";

interface Props {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: {
  key: Tab;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  label: string;
}[] = [
  { key: "home", icon: "home-outline", activeIcon: "home", label: "Home" },
  { key: "attendance", icon: "stats-chart-outline", activeIcon: "stats-chart", label: "Attendance" },
  { key: "profile", icon: "person-outline", activeIcon: "person", label: "Profile" },
  { key: "settings", icon: "settings-outline", activeIcon: "settings", label: "Settings" },
];

export function BottomNav({ activeTab, onChange }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.6}
            onPress={() => onChange(tab.key)}
            style={styles.item}
          >
            <View style={[styles.iconWrap, isActive && styles.activeIconWrap]}>
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={20}
                color={isActive ? theme.colors.accent : theme.colors.textTertiary}
              />
            </View>
            <Text
              numberOfLines={1}
              style={[styles.label, isActive && styles.activeLabel]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-around",
      backgroundColor: theme.colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
    },

    item: {
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xxs,
      minWidth: 64,
    },

    iconWrap: {
      width: 32,
      height: 28,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius.sm,
    },

    activeIconWrap: {
      backgroundColor: theme.colors.accentMuted,
    },

    label: {
      fontFamily: theme.fonts.medium,
      fontSize: 10,
      color: theme.colors.textTertiary,
    },

    activeLabel: {
      fontFamily: theme.fonts.semiBold,
      color: theme.colors.accent,
    },
  });
