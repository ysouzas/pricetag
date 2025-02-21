import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { loadEnv } from "vite";

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...env };
  return defineConfig({
    plugins: [react()],
  });
};
