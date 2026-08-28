// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import icon from 'astro-icon';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.BASE_URL,
  // The whole Tailwind/DaisyUI bundle is one file per page and too big for Astro's 4kB auto-inline
  // threshold, so it always ships as a render-blocking <link> unless forced inline.
  build: {
    inlineStylesheets: 'always',
  },
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
  integrations: [
    mdx(),
    icon(),
    // No i18n option on purpose: it derives alternates by swapping the locale prefix, and slugs are
    // translated, so it would point /en/blog/hello-world at /es/blog/hello-world instead of
    // /es/blog/hola-mundo. The hreflang links in every page's head are built from the cid.
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        // '/' is the meta-refresh redirect; the feeds and llms.txt are not pages.
        return pathname !== '/' && !/\.(xml|txt)$/.test(pathname);
      },
    }),
  ],
});
