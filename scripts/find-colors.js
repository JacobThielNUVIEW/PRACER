#!/usr/bin/env node
// scripts/find-colors.js - Report unique color literals in the repo
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const filesToScan = ['.css','.scss','.ts','.tsx','.js','.jsx','.html','.md'];
let results = {};

function scanDir(dir) {
  const items = fs.readdirSync(dir);
  for(let item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if(stat.isDirectory()) {
      // skip node_modules and .next
      if(['node_modules','.next','.git','dist','out'].includes(item)) continue;
      scanDir(full);
    } else if (stat.isFile()) {
      if(filesToScan.includes(path.extname(full))) {
        const text = fs.readFileSync(full,'utf-8');
        const hexRegex = /#([A-Fa-f0-9]{3,8})\b/g;
        const rgbaRegex = /rgba?\([^)]*\)/g;
        let m;
        while((m = hexRegex.exec(text))) {
          const val = '#'+m[1];
          results[val] = results[val] || new Set();
          results[val].add(full);
        }
        while((m = rgbaRegex.exec(text))) {
          const val = m[0];
          results[val] = results[val] || new Set();
          results[val].add(full);
        }
      }
    }
  }
}

scanDir(root);

console.log('Found color literals:');
Object.keys(results).sort().forEach(k => {
  console.log(k, [...results[k]].slice(0,5).join(', '));
});

if(Object.keys(results).length === 0) console.log('(none)');
