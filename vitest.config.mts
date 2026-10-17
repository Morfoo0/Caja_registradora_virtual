import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: [
      "features/**/*.test.ts",
      "lib/**/*.test.ts",
      "tests/**/*.test.ts",
    ],
  },
});
