#!/usr/bin/env node
/**
 * Build script for SKYBURN
 *
 * Concatenates all ES module source files into a single self-contained
 * skyburn.html that works when opened directly via file:// (no server needed).
 *
 * Usage: node build.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Source files in dependency order (leaves first, main last)
const SOURCE_FILES = [
  'src/constants.js',
  'src/core/vector.js',
  'src/core/rect.js',
  'src/core/entity.js',
  'src/core/objectPool.js',
  'src/systems/physics.js',
  'src/systems/collision.js',
  'src/systems/spawner.js',
  'src/systems/scoring.js',
  'src/systems/fuel.js',
  'src/systems/difficulty.js',
  'src/systems/powerup.js',
  'src/entities/player.js',
  'src/entities/obstacle.js',
  'src/entities/collectible.js',
  'src/entities/particle.js',
  'src/input/inputHandler.js',
  'src/rendering/renderer.js',
  'src/rendering/playerRenderer.js',
  'src/rendering/obstacleRenderer.js',
  'src/rendering/particleRenderer.js',
  'src/rendering/hudRenderer.js',
  'src/rendering/backgroundRenderer.js',
  'src/rendering/collectibleRenderer.js',
  'src/rendering/screenEffects.js',
  'src/audio/audioManager.js',
  'src/ui/titleScreen.js',
  'src/ui/gameOverScreen.js',
  'src/ui/pauseScreen.js',
  'src/game.js',
  'src/main.js',
];

/**
 * Strip import and export statements from a source file's contents.
 * - Removes `import { ... } from '...';` (single and multi-line)
 * - Converts `export class Foo` → `class Foo`
 * - Converts `export function foo` → `function foo`
 * - Converts `export const foo` → `const foo`
 * - Converts `export { ... };` → (removed)
 */
function stripModuleSyntax(code) {
  // Remove single-line imports: import { ... } from '...';
  // Also handles: import { Foo } from './bar.js';
  code = code.replace(/^\s*import\s+\{[^}]*\}\s+from\s+['"][^'"]+['"];\s*$/gm, '');

  // Remove multi-line imports:
  //   import {
  //     Foo, Bar
  //   } from './baz.js';
  code = code.replace(/^\s*import\s+\{[^}]*\}\s+from\s+['"][^'"]+['"];\s*$/gms, '');

  // Remove `export { ... };` re-export lines
  code = code.replace(/^\s*export\s+\{[^}]*\};\s*$/gm, '');

  // Convert `export class` → `class`
  code = code.replace(/^\s*export\s+(class\s)/gm, '$1');

  // Convert `export function` → `function`
  code = code.replace(/^\s*export\s+(function\s)/gm, '$1');

  // Convert `export const` → `const`
  code = code.replace(/^\s*export\s+(const\s)/gm, '$1');

  // Convert `export let` → `let`
  code = code.replace(/^\s*export\s+(let\s)/gm, '$1');

  return code;
}

// Read CSS
const css = readFileSync(join(__dirname, 'style.css'), 'utf-8');

// Read and process all JS source files
const jsChunks = SOURCE_FILES.map((file) => {
  const filePath = join(__dirname, file);
  const raw = readFileSync(filePath, 'utf-8');
  const stripped = stripModuleSyntax(raw);
  return `// ── ${file} ──\n${stripped}`;
});

// Detect duplicate top-level declarations across files
const declMap = new Map();
const declRegex = /^(?:const|let|class|function)\s+([A-Za-z_$]\w*)/gm;
for (const [i, chunk] of jsChunks.entries()) {
  let match;
  while ((match = declRegex.exec(chunk)) !== null) {
    const name = match[1];
    if (declMap.has(name)) {
      console.error(`ERROR: Duplicate declaration "${name}" in ${SOURCE_FILES[i]} (already in ${declMap.get(name)})`);
      process.exit(1);
    }
    declMap.set(name, SOURCE_FILES[i]);
  }
}

const bundledJs = jsChunks.join('\n\n');

// Build the final HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>SKYBURN</title>
  <style>
${css}
  </style>
</head>
<body>
  <div id="game-container">
    <canvas id="gameCanvas"></canvas>
  </div>
  <script>
(function() {
${bundledJs}
})();
  </script>
</body>
</html>
`;

const outPath = join(__dirname, 'skyburn.html');
writeFileSync(outPath, html, 'utf-8');

console.log(`Built ${outPath} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
