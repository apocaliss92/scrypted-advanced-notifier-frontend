import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr' 

export default defineConfig({
  base: '/endpoint/@apocaliss92/scrypted-advanced-notifier/public/app/',
  build: {
    assetsDir: '.',
    rollupOptions: {
      // output: {
      //   entryFileNames: `[name].js`,
      //   chunkFileNames: `[name].js`,
      //   assetFileNames: `[name][extname]`,
      // }
    }
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
        target: 'https://scrypted.gianlucaruocco.top',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})
