import { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Address, StudentProfile } from "../models/profile";
import { useTheme } from "../theme/ThemeContext";
import type { AppTheme } from "../theme/theme";

import { Avatar } from "../components/ui/Avatar";
import { Separator } from "../components/ui/Separator";
import { ErrorState } from "../components/ui/ErrorState";

interface Props {
  profile: StudentProfile | null;
  loading: boolean;
  error: string | null;
  onLoad: () => Promise<void>;
}

export function ProfileScreen({ profile, loading, error, onLoad }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    if (!profile && !loading && !error) {
      void onLoad();
    }
  }, [error, loading, onLoad, profile]);

  if (loading || (!profile && !error)) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.centeredState}>
          <ActivityIndicator size="small" color={theme.colors.accent} />
          <Text style={styles.stateText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ErrorState
          title="Couldn't load profile"
          message={error ?? "An unexpected error occurred."}
          onRetry={() => void onLoad()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        <View style={styles.identity}>
          <Avatar name={profile.name} size={56} />
          <View style={styles.identityText}>
            <Text style={styles.name}>{profile.name || "Student"}</Text>
            <Text style={styles.branch}>
              {profile.branch || "Branch unavailable"}
            </Text>
          </View>
          <View style={styles.rollBadge}>
            <Text style={styles.rollLabel}>ROLL NO</Text>
            <Text style={styles.rollValue}>{valueOrDash(profile.rollNo)}</Text>
          </View>
        </View>

        <ProfileSection title="Student details">
          <InfoRow label="Registration No" value={profile.registrationNo} />
          <InfoRow label="Date of birth" value={profile.dob} />
          <InfoRow label="Gender" value={profile.sex} last />
        </ProfileSection>

        <ProfileSection title="Contact">
          <InfoRow label="Mobile" value={profile.studentMobile} />
          <InfoRow label="Father's mobile" value={profile.fatherMobile} />
          <InfoRow label="WhatsApp" value={profile.whatsappNo} />
          <InfoRow label="Email" value={profile.email} last />
        </ProfileSection>

        <ProfileSection title="Family">
          <InfoRow label="Father" value={profile.fatherName} />
          <InfoRow label="Mother" value={profile.motherName} last />
        </ProfileSection>

        <ProfileSection title="Admission">
          <InfoRow label="Category" value={profile.admissionCategory} />
          <InfoRow label="Admission date" value={profile.admissionDate} last />
        </ProfileSection>

        <ProfileSection title="Mailing address">
          <AddressDetails address={profile.mailingAddress} />
        </ProfileSection>

        <ProfileSection title="Permanent address">
          <AddressDetails address={profile.permanentAddress} />
        </ProfileSection>

        {(profile.hostel.hostel || profile.hostel.block || profile.hostel.roomNo) && (
          <ProfileSection title="Hostel">
            <InfoRow label="Hostel" value={profile.hostel.hostel} />
            <InfoRow label="Block" value={profile.hostel.block} />
            <InfoRow label="Room" value={profile.hostel.roomNo} last />
          </ProfileSection>
        )}

        {profile.academicDetails.length > 0 && (
          <View style={styles.academicSection}>
            <Text style={styles.sectionLabel}>ACADEMIC HISTORY</Text>
            {profile.academicDetails.map((detail) => (
              <View
                key={`${detail.examination}-${detail.year}`}
                style={styles.academicCard}
              >
                <View style={styles.academicHeader}>
                  <Text style={styles.academicTitle}>{detail.examination}</Text>
                  {detail.percentage !== null && (
                    <Text style={styles.percentage}>{detail.percentage}%</Text>
                  )}
                </View>
                <Text style={styles.academicInstitution}>
                  {valueOrDash(detail.institution)}
                </Text>
                <Text style={styles.academicMeta}>
                  {[detail.boardUniversity, detail.stream, detail.year, detail.division]
                    .filter(Boolean)
                    .join(" · ")}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title.toUpperCase()}</Text>
      <View style={styles.group}>{children}</View>
    </View>
  );
}

function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{valueOrDash(value)}</Text>
      </View>
      {!last && <Separator inset={theme.spacing.lg} />}
    </>
  );
}

function AddressDetails({ address }: { address: Address }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const parts = [address.atPo, address.cityVia, address.district, address.state, address.pin].filter(Boolean);

  return (
    <View style={styles.addressContainer}>
      <Text style={styles.addressText}>
        {parts.length > 0 ? parts.join(", ") : "Not available"}
      </Text>
    </View>
  );
}

function valueOrDash(value: string) {
  return value || "—";
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      padding: theme.spacing.xl,
      paddingBottom: theme.spacing.xxxxxl,
    },

    title: {
      fontFamily: theme.fonts.bold,
      fontSize: 28,
      lineHeight: 34,
      letterSpacing: -0.3,
      color: theme.colors.text,
      marginBottom: theme.spacing.xxl,
    },

    identity: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xxxl,
    },

    identityText: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },

    name: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 17,
      color: theme.colors.text,
    },

    branch: {
      fontFamily: theme.fonts.regular,
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xxs,
    },

    rollBadge: {
      alignItems: "flex-end",
      marginLeft: theme.spacing.sm,
    },

    rollLabel: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 9,
      letterSpacing: 0.6,
      color: theme.colors.textTertiary,
    },

    rollValue: {
      fontFamily: theme.fonts.bold,
      fontSize: 13,
      color: theme.colors.text,
      marginTop: 2,
    },

    section: {
      marginBottom: theme.spacing.xl,
    },

    sectionLabel: {
      fontFamily: theme.fonts.semiBold,
      fontSize: 11,
      letterSpacing: 0.6,
      color: theme.colors.textTertiary,
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
    },

    group: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      overflow: "hidden",
    },

    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 44,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },

    infoLabel: {
      flex: 1,
      fontFamily: theme.fonts.regular,
      fontSize: 14,
      color: theme.colors.textSecondary,
    },

    infoValue: {
      flex: 1.4,
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
      color: theme.colors.text,
      textAlign: "right",
    },

    addressContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },

    addressText: {
      fontFamily: theme.fonts.regular,
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text,
    },

    academicSection: {
      marginBottom: theme.spacing.xl,
    },

    academicCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.sm,
    },

    academicHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    academicTitle: {
      flex: 1,
      fontFamily: theme.fonts.semiBold,
      fontSize: 15,
      color: theme.colors.text,
    },

    percentage: {
      fontFamily: theme.fonts.bold,
      fontSize: 14,
      color: theme.colors.success,
    },

    academicInstitution: {
      fontFamily: theme.fonts.regular,
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },

    academicMeta: {
      fontFamily: theme.fonts.medium,
      fontSize: 12,
      color: theme.colors.textTertiary,
      marginTop: theme.spacing.xxs,
    },

    centeredState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    stateText: {
      fontFamily: theme.fonts.medium,
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
  });
