import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import alpine from "@astrojs/alpinejs";
import tailwind from "@astrojs/tailwind";
import playformCompress from "@playform/compress";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: 'https://datasets.yangs.cloud',
  vite: {
    define: {
      __DATE__: `'${new Date().toISOString()}'`
    }
  },
  output: 'server',
  integrations: [tailwind(), alpine(), svelte(), playformCompress()],
  adapter: node({
    mode: "standalone"
  })
});