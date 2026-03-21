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
  },
]);
