import { describe, expect, it } from "vitest";
import { absoluteUrl, siteConfig, siteUrl } from "./site";

describe("site config", () => {
  it("exposes a site URL without a trailing slash", () => {
    expect(siteUrl.endsWith("/")).toBe(false);
  });

  it("builds absolute URLs from a path", () => {
    expect(absoluteUrl("/about")).toBe(`${siteUrl}/about`);
    expect(absoluteUrl()).toBe(`${siteUrl}/`);
  });

  it("keeps siteConfig.url in sync with siteUrl", () => {
    expect(siteConfig.url).toBe(siteUrl);
  });
});
