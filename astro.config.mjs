// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: process.env.BASE_URL,
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en"
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), icon()],
});
