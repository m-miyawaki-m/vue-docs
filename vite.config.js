// vite.config.js
import vue from '@vitejs/plugin-vue'
import path from 'path'; // ← 追加
import { defineConfig } from 'vite'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ← 追加
    },
  },
})
