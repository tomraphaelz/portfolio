const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

// Finde alle JPG/PNG in assets/images
const images = glob.sync('assets/images/*.{jpg,jpeg,png,JPG,PNG,JPEG}');

console.log(`\n🔄 Konvertiere ${images.length} Bilder zu WebP...\n`);

let successCount = 0;
let errorCount = 0;

// Konvertiere alle Bilder zu WebP
Promise.all(
  images.map(async (file) => {
    const outputPath = file.replace(/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/i, '.webp');

    try {
      const info = await sharp(file)
        .webp({ quality: 80 }) // Balance zwischen Qualität und Größe
        .toFile(outputPath);

      const originalSize = fs.statSync(file).size;
      const newSize = info.size;
      const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

      console.log(`✓ ${path.basename(file)} → ${path.basename(outputPath)}`);
      console.log(`  ${(originalSize / 1024).toFixed(0)} KB → ${(newSize / 1024).toFixed(0)} KB (-${reduction}%)\n`);
      successCount++;
    } catch (err) {
      console.error(`✗ Fehler bei ${file}:`, err.message, '\n');
      errorCount++;
    }
  })
).then(() => {
  console.log(`\n✅ Fertig! ${successCount} Bilder erfolgreich konvertiert.`);
  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} Fehler aufgetreten.`);
  }
}).catch(err => {
  console.error('\n❌ Unerwarteter Fehler:', err);
  process.exit(1);
});
