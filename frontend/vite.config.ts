import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react-swc"

export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react()],

    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, "")
        }
      }
    }
  }
})
