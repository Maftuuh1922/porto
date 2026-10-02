// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://maftuuh1922.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
});
