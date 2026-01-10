/**
 * Helper script to generate PWA icons from logo.png
 * 
 * This script requires sharp: npm install -D sharp
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * This will create icon-192x192.png and icon-512x512.png in the public folder
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/logo.png');
const output192 = path.join(__dirname, '../public/icon-192x192.png');
const output512 = path.join(__dirname, '../public/icon-512x512.png');

async function generateIcons() {
  try {
    // Check if logo.png exists
    if (!fs.existsSync(inputPath)) {
      console.error('Error: logo.png not found in public folder');
      process.exit(1);
    }

    // Generate 192x192 icon
    await sharp(inputPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(output192);

    console.log('✓ Generated icon-192x192.png');

    // Generate 512x512 icon
    await sharp(inputPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(output512);

    console.log('✓ Generated icon-512x512.png');
    console.log('✓ Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();


