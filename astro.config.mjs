// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import { precompress } from './precompress.mjs';

// https://astro.build/config
export default defineConfig({
  vite: {
      plugins: [tailwindcss()],
    },

  integrations: [react(), mdx(), precompress()],
});
