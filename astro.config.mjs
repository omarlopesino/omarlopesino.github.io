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
  markdown: {
    // Both themes as CSS variables, so global.css can switch them on data-theme; with a single
    // theme Shiki bakes its colours in and code blocks stay dark on a light page.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), icon()],
});
