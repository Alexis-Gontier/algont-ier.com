import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Resolve the `@/*` tsconfig path alias natively (no vite-tsconfig-paths needed).
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Unit/component tests live next to code or in src/. E2E lives in tests/e2e
    // and is run by Playwright, so keep it out of Vitest.
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
  },
});
