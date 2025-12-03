#!/usr/bin/env node
// scripts/find-colors.js - Report unique color literals in the repo
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const filesToScan = ['.css','.scss','.ts','.tsx','.js','.jsx','.html','.md'];
let results = {};
let categorized = {
  hex: new Map(),
  rgba: new Map(),
  legacy: new Map(),
  arbitrary: new Map()
};
const allowedHexPaths = [
  path.join('tailwind.config.js'),
  path.join('src', 'styles', 'tokens'),
  path.join('src', 'lib', 'constants.ts'),
  path.join('src', 'app', 'auth', 'page.tsx'),
  path.join('src', 'app', 'auth', 'page-new.tsx'),
  path.join('public')
];

function scanDir(dir) {
  const items = fs.readdirSync(dir);
  for (let item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', '.next', '.git', 'dist', 'out', 'public', 'scripts'].includes(item)) continue;
      if (full.includes(path.join('src', 'styles', 'tokens'))) continue;
      scanDir(full);
    } else if (stat.isFile()) {
      if (filesToScan.includes(path.extname(full))) {
        const text = fs.readFileSync(full, 'utf-8');
        const hexRegex = /#([A-Fa-f0-9]{3,8})\b/g;
        const rgbaRegex = /rgba?([^)]*)\)/g;
  // Match un-versioned classes like 'bg-gold' but do NOT match 'bg-gold-500'
  const legacyClassRegex = /\b(?:bg|text|from|to|border|ring|shadow|placeholder|selection|stroke)-gold(?!-\d)/g;
        const arbitraryColorRegex = /\b(?:bg|text|from|to|border|ring|shadow|stroke)-\[#([A-Fa-f0-9]{3,6})\](?:\/\d{1,3})?/g;
        let m;
        while ((m = hexRegex.exec(text))) {
          const val = '#' + m[1];
          results[val] = results[val] || new Set();
          results[val].add(full);
          if (!allowedHexPaths.some(p => full.includes(p))) {
            const set = categorized.hex.get(val) || new Set();
            set.add(full);
            categorized.hex.set(val, set);
          }
        }
        while ((m = rgbaRegex.exec(text))) {
          const val = m[0];
          results[val] = results[val] || new Set();
          results[val].add(full);
          const set = categorized.rgba.get(val) || new Set();
          set.add(full);
          categorized.rgba.set(val, set);
        }
        let c;
        while ((c = legacyClassRegex.exec(text))) {
          const val = c[0];
          results[val] = results[val] || new Set();
          results[val].add(full);
          const set = categorized.legacy.get(val) || new Set();
          set.add(full);
          categorized.legacy.set(val, set);
        }
        while ((c = arbitraryColorRegex.exec(text))) {
          const val = '#' + c[1];
          results[val] = results[val] || new Set();
          results[val].add(full);
          const set = categorized.arbitrary.get(val) || new Set();
          set.add(full);
          categorized.arbitrary.set(val, set);
        }
      }
    }
  }
}

scanDir(root);

console.log('\nFound color literals:');
Object.keys(results).sort().forEach(k => {
  console.log(k, [...results[k]].slice(0,5).join(', '));
});

if(Object.keys(results).length === 0) console.log('(none)');

// Print categorized deltas and fail CI if anything remains (legacy classes, arbitrary usage, or inline hexs outside allowed paths)
const problemList = [];
if (categorized.legacy.size > 0) {
  console.log('\nLegacy (un-versioned) Tailwind classes found:');
  for (const [k, s] of categorized.legacy.entries()) {
    console.log(k, [...s].slice(0,5).join(', '));
    problemList.push({type: 'legacy', match: k, files: [...s]});
  }
}
if (categorized.arbitrary.size > 0) {
  console.log('\nArbitrary Tailwind color usage found (bg-[#...]):');
  for (const [k, s] of categorized.arbitrary.entries()) {
    console.log(k, [...s].slice(0,5).join(', '));
    problemList.push({type: 'arbitrary', match: k, files: [...s]});
  }
}
if (categorized.hex.size > 0) {
  console.log('\nInline hex color usages found outside token/config files:');
  for (const [k, s] of categorized.hex.entries()) {
    console.log(k, [...s].slice(0,5).join(', '));
    problemList.push({type: 'hex', match: k, files: [...s]});
  }
}

// If any problems exist, exit with non-zero code (CI/lint failure)
if(problemList.length > 0) {
  console.log('\n⚠️  Found inline color matches that should be tokenized.');
  process.exit(1);
}
