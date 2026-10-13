import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react()],
  publicDir: "../public",
  root: "github-pages-src",
  build: {
    emptyOutDir: true,
    outDir: "../github-pages",
  },
});
