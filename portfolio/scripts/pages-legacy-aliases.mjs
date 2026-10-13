import { copyFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const assetsDir = fileURLToPath(new URL("../github-pages/assets/", import.meta.url));
const legacyJsFiles = ["index-C-gkJ3pF.js"];

const currentJsFile = readdirSync(assetsDir)
  .filter((file) => /^index-[\w-]+\.js$/.test(file) && !legacyJsFiles.includes(file))
  .map((file) => ({
    file,
    mtime: statSync(path.join(assetsDir, file)).mtimeMs,
  }))
  .sort((a, b) => b.mtime - a.mtime)[0]?.file;

if (!currentJsFile) {
  throw new Error("No GitHub Pages JavaScript bundle found.");
}

for (const alias of legacyJsFiles) {
  copyFileSync(path.join(assetsDir, currentJsFile), path.join(assetsDir, alias));
}
