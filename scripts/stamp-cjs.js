/**
 * Post-build script for dual CJS/ESM output.
 * Run from within a package directory: node ../../scripts/stamp-cjs.js
 *
 * 1. Stamps dist/cjs/package.json with { "type": "commonjs" }
 * 2. Rewrites all `require("./foo.js")` → `require("./foo")` in CJS output
 *    because CommonJS resolution doesn't require file extensions.
 */

const fs = require('fs');
const path = require('path');

// Run from the package root (the cwd when the build script executes)
const pkgDir = process.cwd();
const cjsDir = path.join(pkgDir, 'dist', 'cjs');

function walk(dir, cb) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

function rewriteRequireExtensions(filePath) {
  if (path.extname(filePath) !== '.js') return;
  const src = fs.readFileSync(filePath, 'utf8');
  const rewritten = src.replace(/require\((['"])(\.\.?\/[^'"]+)\.js\1\)/g, 'require($1$2$1)');
  if (rewritten !== src) fs.writeFileSync(filePath, rewritten);
}

if (!fs.existsSync(cjsDir)) {
  console.error(`✗ dist/cjs not found at ${cjsDir}`);
  process.exit(1);
}

// 1. Stamp package.json
fs.writeFileSync(
  path.join(cjsDir, 'package.json'),
  JSON.stringify({ type: 'commonjs' }, null, 2) + '\n'
);

// 2. Rewrite require() extensions
walk(cjsDir, rewriteRequireExtensions);

const pkgName = require(path.join(pkgDir, 'package.json')).name;
console.log(`✓ CJS build ready: ${pkgName}`);
