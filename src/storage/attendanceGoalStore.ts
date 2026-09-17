import AsyncStorage from "@react-native-async-storage/async-storage";

const ATTENDANCE_GOAL_KEY = "attendance-goal";
const DEFAULT_GOAL = 60;

export async function getAttendanceGoal(): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(ATTENDANCE_GOAL_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_GOAL;
}

export async function setAttendanceGoal(goal: number): Promise<void> {
  try {
    await AsyncStorage.setItem(ATTENDANCE_GOAL_KEY, String(goal));
  } catch {
    // ignore
  }
}
