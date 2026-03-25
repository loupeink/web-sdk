import { defineConfig } from 'tsup';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

// Resolve @loupeink/* to local source so the build always uses latest code,
// while still externalizing heavy deps (React, Konva, etc.) that consumers provide.
const loupeAliases = {
  '@loupeink/core': resolve(__dir, '../loupe-core/src/index.ts'),
  '@loupeink/ui': resolve(__dir, '../loupe-ui/src/index.ts'),
};

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
    noExternal: [/@loupeink\//],
    esbuildOptions(options) {
      options.alias = loupeAliases;
      // Externalize heavy deps that consumers already have.
      // Must be set here (not tsup-level) to override noExternal's transitive bundling.
      options.external = [
        'react', 'react-dom', 'react/jsx-runtime',
        'konva', 'react-konva',
        'lucide-react',
        '@radix-ui/react-slot',
      ];
    },
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
