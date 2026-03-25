import { defineConfig } from 'tsup';

export default defineConfig([
  // npm consumers (ESM + CJS + types)
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: false,
    sourcemap: true,
    outDir: 'dist',
    outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
    // Bundle @loupeink/* so consumers don't need to install them separately
    noExternal: [/@loupeink\//],
  },
  // CDN / script-tag consumers (IIFE, minified)
  {
    entry: ['src/index.ts'],
    format: ['iife'],
    globalName: 'Loupe',
    minify: true,
    sourcemap: true,
    outDir: 'dist',
    outExtension: () => ({ js: '.global.js' }),
    env: {
      NODE_ENV: 'production',
    },
  },
]);
