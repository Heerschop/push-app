import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
// https://vite-pwa-org.netlify.app/guide/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        theme_color: '#383a3f',
        background_color: '#383a3f',
        orientation: 'portrait',
        id: 'push-app',
        name: 'Push app',
        short_name: 'Push app',
        description: 'App for testing push notifications',
        icons: [
          {
            'src': 'icons/icon-16x16.png',
            'sizes': '16x16',
            'type': 'image/png',
          },
          {
            'src': 'icons/icon-32x32.png',
            'sizes': '32x32',
            'type': 'image/png',
          },
          {
            'src': 'icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png',
          },
          {
            'src': 'icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png',
          },
          {
            'src': 'icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png',
          },
        ],
      },
    }),
  ],
});
