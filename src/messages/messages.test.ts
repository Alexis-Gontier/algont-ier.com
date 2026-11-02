import { describe, expect, it } from "vitest";
import en from "./en.json";
import fr from "./fr.json";

/**
 * Locale files are edited by hand, so a key added to one and forgotten in the
 * other only surfaces at runtime as a raw `Namespace.key` string on the page.
 * This asserts the invariant that keeps `fr` and `en` interchangeable.
 */
function flatten(value: object, prefix = ""): string[] {
  return Object.entries(value).flatMap(([key, child]) =>
    child !== null && typeof child === "object"
      ? flatten(child, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

describe("messages", () => {
  it("exposes exactly the same keys in fr and en", () => {
    expect(flatten(en).sort()).toEqual(flatten(fr).sort());
  });

  it("has no empty translation", () => {
    for (const messages of [fr, en]) {
      const empty = Object.entries(messages).flatMap(([namespace, values]) =>
        Object.entries(values)
          .filter(
            ([, value]) => typeof value === "string" && value.trim() === "",
          )
          .map(([key]) => `${namespace}.${key}`),
      );
      expect(empty).toEqual([]);
    }
  });
});
