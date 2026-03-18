import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set the dev server to always run on port 3000
// This must match the CORS origin we set in the backend Program.cs
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
