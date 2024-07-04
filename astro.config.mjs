import { defineConfig } from 'astro/config';

import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: 'https://datasets.yangs.cloud',
  vite: {
    define: {
      __DATE__: `'${new Date().toISOString()}'`
    }
  },
  output: 'server',
  integrations: [tailwind(), alpinejs(), svelte(), playformCompress()]
});