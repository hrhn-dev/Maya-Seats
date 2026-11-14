// Small helper so the test runner has something real to run before the hour.
// Likely useful later for an "unused" rule based on last activity.
const DAY_MS = 24 * 60 * 60 * 1000;

export function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / DAY_MS);
}
