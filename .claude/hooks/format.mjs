// PostToolUse hook: format the file Claude just edited with Biome.
// Reads the hook payload (JSON) from stdin and never blocks the edit.
//
// Biome's launcher is run straight through node — no shell. Going through
// `pnpm` needs `shell: true` on Windows, and cmd.exe then chokes on the
// parentheses of route-group paths like `[locale]/(site)/…`.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));
const biome = fileURLToPath(
  new URL("../../node_modules/@biomejs/biome/bin/biome", import.meta.url),
);

let data = "";
process.stdin.on("data", (chunk) => {
  data += chunk;
});
process.stdin.on("end", () => {
  try {
    const { tool_input } = JSON.parse(data || "{}");
    const file = tool_input?.file_path;
    if (!file || !/\.([cm]?[jt]sx?|jsonc?|css)$/.test(file)) return;

    spawnSync(
      process.execPath,
      [biome, "check", "--write", "--no-errors-on-unmatched", file],
      { cwd: root, stdio: "ignore" },
    );
  } catch {
    // Ignore — formatting must never block an edit.
  }
});
