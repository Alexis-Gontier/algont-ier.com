import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectTags } from "./project-tags";

const TAG_WIDTH = 100;
const BADGE_WIDTH = 40;

const tags = ["Next.js", "TypeScript", "Tailwind", "Prisma", "PostgreSQL"];

/**
 * jsdom has no layout engine — every box measures 0 — so `useOneLineFit` would
 * always conclude "everything fits". Give the tags a fixed width and the
 * wrapper a fixed available width so the fitting maths runs on real numbers.
 */
function mockLayout(availableWidth: number) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      const width = this.textContent?.startsWith("+") ? BADGE_WIDTH : TAG_WIDTH;
      return { width } as DOMRect;
    },
  );
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(
    availableWidth,
  );
}

/** Rows in DOM order: visible (clipped), off-screen measurement, sr-only. */
function rows(container: HTMLElement) {
  const [visible, , accessible] = Array.from(container.querySelectorAll("ul"));
  const textOf = (list: Element | undefined) =>
    Array.from(list?.children ?? []).map((item) => item.textContent);
  return { visible: textOf(visible), accessible: textOf(accessible) };
}

describe("ProjectTags", () => {
  beforeEach(() => {
    // The hook observes the wrapper, then computes once synchronously — the
    // stub only needs to exist, not to fire.
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("shows every tag when they all fit on one line", () => {
    mockLayout(TAG_WIDTH * tags.length);
    const { container } = render(<ProjectTags tags={tags} />);

    expect(rows(container).visible).toEqual(tags);
  });

  it("collapses the overflow into a +N badge that itself fits", () => {
    // Room for two tags plus the badge, not three.
    mockLayout(TAG_WIDTH * 2 + BADGE_WIDTH + 10);
    const { container } = render(<ProjectTags tags={tags} />);

    expect(rows(container).visible).toEqual(["Next.js", "TypeScript", "+3"]);
  });

  it("keeps every tag readable by screen readers when the row is truncated", () => {
    mockLayout(TAG_WIDTH);
    const { container } = render(<ProjectTags tags={tags} />);

    // The whole point of the sr-only row: truncation is purely visual.
    expect(rows(container).accessible).toEqual(tags);
  });
});
