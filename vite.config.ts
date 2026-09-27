import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    // Freebuff requirement: keep HMR disabled in the managed preview.
    hmr: false,
    // Allow the Freebuff/e2b preview hosts (subdomains change per workspace).
    allowedHosts: [".e2b.app"],
  },
});
