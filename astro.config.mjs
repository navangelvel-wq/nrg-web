// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true } // Esto fuerza a Vercel a inicializar correctamente las funciones de servidor
  }),
  server: {
    host: true,
    allowedHosts: true,
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Forzamos a Vite a empaquetar Resend correctamente en el entorno de servidor de Vercel
      noExternal: ['resend']
    }
  }
});