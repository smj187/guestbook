import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [vue(), VitePWA({
    manifest: {
      icons: [{
        src: "/icons/512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }]
    }
  })],

});
