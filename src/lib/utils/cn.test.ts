import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("applies conditional classes", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("merges conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm text-red-500", "text-lg")).toBe("text-red-500 text-lg");
  });
});
