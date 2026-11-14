import { describe, expect, it } from "vitest";
import { daysBetween } from "./dates";

describe("daysBetween", () => {
  it("counts whole days", () => {
    expect(daysBetween(new Date("2026-01-01"), new Date("2026-01-31"))).toBe(30);
  });

  it("rounds partial days down", () => {
    expect(
      daysBetween(new Date("2026-01-01T00:00Z"), new Date("2026-01-02T23:00Z")),
    ).toBe(1);
  });
});
