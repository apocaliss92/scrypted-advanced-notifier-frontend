import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from "vite"
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/endpoint/@apocaliss92/scrypted-advanced-notifier/public/app/',
    build: {
      assetsDir: '.',
    },
    plugins: [
      react(),
      svgr(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_CLIENT_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          
        },
      },
    }
  }
});
