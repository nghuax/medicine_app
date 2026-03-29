import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function resolveBasePath(prefix: string | undefined, pathName: string) {
  const normalizedPrefix = (prefix ?? "").replace(/\/+$/, "");
  const normalizedPath = pathName.startsWith("/") ? pathName : `/${pathName}`;
  const combined = `${normalizedPrefix}${normalizedPath}`;
  return combined.replace(/\/{2,}/g, "/");
}

// https://vite.dev/config/
export default defineConfig({
  base: resolveBasePath(process.env.PAGES_BASE_PREFIX, "/app-skip-login/"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@shared": fileURLToPath(new URL("../shared", import.meta.url)),
      "@convex": fileURLToPath(new URL("../convex", import.meta.url))
    }
  }
})
