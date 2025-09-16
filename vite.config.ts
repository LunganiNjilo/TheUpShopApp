import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { UserConfigExport } from 'vite'
import type { UserConfig as VitestConfig } from 'vitest'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  } as VitestConfig,
  server: {
    port: 5173,
    strictPort: true,
  },
})
