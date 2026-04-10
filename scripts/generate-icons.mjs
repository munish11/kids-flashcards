#!/usr/bin/env node
/**
 * Generates PNG icons from the SVG source for iOS PWA compatibility.
 * iOS Safari doesn't support SVG icons for Add to Home Screen.
 * 
 * Usage: node scripts/generate-icons.mjs
 * 
 * If you don't have canvas installed, you can also just create PNGs manually
 * or use an online SVG-to-PNG converter for the files in public/icons/.
 */

import { writeFileSync } from 'fs';

// Simple approach: create a minimal HTML file that renders the SVGs to canvas
// and downloads PNGs. Open this in a browser to generate the icons.

const html = `<!DOCTYPE html>
<html>
<head><title>Icon Generator</title></head>
<body>
<h2>Click each button to download the PNG icon</h2>
<canvas id="c" style="display:none"></canvas>

<button onclick="generate(192)">Download 192x192</button>
<button onclick="generate(512)">Download 512x512</button>
<button onclick="generate(180)">Download 180x180 (apple-touch-icon)</button>

<script>
function generate(size) {
  const canvas = document.getElementById('c');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Draw rounded rect background
  const r = size * 0.2;
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();
  
  // Draw text
  const fontSize = Math.round(size * 0.45);
  ctx.fillStyle = 'white';
  ctx.font = 'bold ' + fontSize + 'px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ABC', size / 2, size * 0.54);
  
  // Download
  const a = document.createElement('a');
  a.download = 'icon-' + size + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
}
</script>
</body>
</html>`;

writeFileSync('public/icons/generate.html', html);
console.log('Created public/icons/generate.html');
console.log('Open this file in a browser and click the buttons to generate PNG icons.');
console.log('Save them as icon-192.png, icon-512.png, and apple-touch-icon.png in public/icons/');
