import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getAttendanceGoal,
  setAttendanceGoal as persistGoal,
} from "../storage/attendanceGoalStore";

interface AttendanceGoalContextValue {
  goal: number;
  setGoal: (value: number) => void;
  loaded: boolean;
}

const AttendanceGoalContext = createContext<AttendanceGoalContextValue | null>(null);

export function AttendanceGoalProvider({ children }: { children: React.ReactNode }) {
  const [goal, setGoalState] = useState(60);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAttendanceGoal().then((value) => {
      setGoalState(value);
      setLoaded(true);
    });
  }, []);

  const setGoal = useCallback((value: number) => {
    setGoalState(value);
    void persistGoal(value);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <AttendanceGoalContext.Provider value={{ goal, setGoal, loaded }}>
      {children}
    </AttendanceGoalContext.Provider>
  );
}

export function useAttendanceGoal() {
  const context = useContext(AttendanceGoalContext);
  if (!context) {
    throw new Error("useAttendanceGoal must be used within an AttendanceGoalProvider");
  }
  return context;
}
