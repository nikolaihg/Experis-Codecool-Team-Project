import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react-swc"
import { execSync } from "child_process"

export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), "")
  console.log("Proxy target:", env.VITE_API_URL)

  let gitHash = "dev";
  try {
    gitHash = execSync("git rev-parse --short HEAD").toString().trim()
  } catch { console.log("Git commit hash not available") }

  return {
    plugins: [react()],
    
    define : {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "0.0.0"),
      __GIT_HASH__: JSON.stringify(gitHash)
    },

    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
        }
      }
    }
  }
})
