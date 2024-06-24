import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: 'https://datasets.yangs.cloud',
  vite: {
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
  },
  integrations: [tailwind(), playformCompress()],
});