import type { SubjectAttendance } from "../models/attendance";

export const DEFAULT_GOAL = 60;

export type StatusLevel = "good" | "warning" | "danger";

export function getStatusLevel(percentage: number, goal: number = DEFAULT_GOAL): StatusLevel {
  if (percentage >= goal) return "good";
  if (percentage >= goal - 15) return "warning";
  return "danger";
}

export function getStatusBadge(percentage: number, goal: number = DEFAULT_GOAL) {
  const level = getStatusLevel(percentage, goal);
  switch (level) {
    case "good":
      return { label: "On Track", variant: "success" as const };
    case "warning":
      return { label: "Needs Attention", variant: "warning" as const };
    case "danger":
      return { label: "Low Attendance", variant: "danger" as const };
  }
}

export interface ClassSummary {
  totalAttended: number;
  totalTaken: number;
  percentage: number;
}

export function computeTotalClasses(subjects: SubjectAttendance[]): ClassSummary {
  let totalAttended = 0;
  let totalTaken = 0;

  for (const subject of subjects) {
    totalAttended += subject.classesAttended;
    totalTaken += subject.classesTaken;
  }

  const percentage = totalTaken > 0 ? (totalAttended / totalTaken) * 100 : 0;

  return { totalAttended, totalTaken, percentage };
}

export interface ClassesNeeded {
  needed: number;
  reachable: boolean;
}

/**
 * Calculate how many consecutive classes a student must attend
 * to reach the target percentage, starting from current standing.
 *
 * Returns { needed, reachable } where reachable=false means
 * even attending all remaining classes can't reach the target.
 */
export function classesNeededToReach(
  attended: number,
  taken: number,
  targetPercent: number,
): ClassesNeeded {
  const currentPercent = taken > 0 ? (attended / taken) * 100 : 0;

  if (currentPercent >= targetPercent) {
    return { needed: 0, reachable: true };
  }

  // Binary search for minimum consecutive classes needed
  // Brute force: try 1, 2, 3... up to a reasonable limit
  const maxAttempts = 200;

  for (let i = 1; i <= maxAttempts; i++) {
    const newPercent = ((attended + i) / (taken + i)) * 100;
    if (newPercent >= targetPercent) {
      return { needed: i, reachable: true };
    }
  }

  return { needed: maxAttempts, reachable: false };
}

export interface AlertSubject {
  name: string;
  type: string;
  percentage: number;
  classesAttended: number;
  classesTaken: number;
  classesNeeded: number;
  reachable: boolean;
}

export function getAlertSubjects(
  subjects: SubjectAttendance[],
  targetPercent: number,
): AlertSubject[] {
  return subjects
    .filter((s) => s.percentage < targetPercent)
    .map((s) => {
      const { needed, reachable } = classesNeededToReach(
        s.classesAttended,
        s.classesTaken,
        targetPercent,
      );
      return {
        name: s.name,
        type: s.type,
        percentage: s.percentage,
        classesAttended: s.classesAttended,
        classesTaken: s.classesTaken,
        classesNeeded: needed,
        reachable,
      };
    })
    .sort((a, b) => a.percentage - b.percentage);
}
