import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8", // или 'istanbul'
      reporter: ["text", "html", "clover", "json"], // форматы отчётов
      reportsDirectory: "./coverage", // папка для отчётов
      exclude: [
        // что исключить из покрытия
        "node_modules/",
        "src/test/**",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/types/**",
      ],
    },
  },
})
