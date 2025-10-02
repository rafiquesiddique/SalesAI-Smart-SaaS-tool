// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },cd ..
//   },
//   server: {
//     port: 3000,
//     open: true,
//   },
//   build: {
//     outDir: 'dist',
//     sourcemap: true,
//   },
// })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from "path"

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5001',
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Ensure this is 5001
        changeOrigin: true,
        secure: false,
      }
    }
  }
})