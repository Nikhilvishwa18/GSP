import { View } from "react-native";

import type { SubjectAttendance } from "../models/attendance";
import { useTheme } from "../theme/ThemeContext";
import { AttendanceCard } from "./AttendanceCard";

interface Props {
  subjects: SubjectAttendance[];
}

export function SubjectList({ subjects }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        paddingHorizontal: theme.spacing.lg,
      }}
    >
      {subjects.map((subject, index) => (
        <AttendanceCard
          key={`${subject.name}-${index}`}
          subject={subject}
          index={index}
        />
      ))}
    </View>
  );
}
