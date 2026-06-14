// PostToolUse hook: format the file Claude just edited with Biome.
// Reads the hook payload (JSON) from stdin and never blocks the edit.
import { spawnSync } from "node:child_process";

let data = "";
process.stdin.on("data", (chunk) => {
  data += chunk;
});
process.stdin.on("end", () => {
  try {
    const { tool_input } = JSON.parse(data || "{}");
    const file = tool_input?.file_path;
    if (!file || !/\.(jsx?|tsx?|json|jsonc|css)$/.test(file)) return;

    spawnSync(
      "pnpm",
      ["biome", "check", "--write", "--no-errors-on-unmatched", file],
      { stdio: "ignore", shell: true },
    );
  } catch {
    // Ignore — formatting must never block an edit.
  }
});
