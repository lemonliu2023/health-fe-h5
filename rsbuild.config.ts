import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server: {
    base: '/health-fe-h5'
  },
  plugins: [pluginReact()],
});
