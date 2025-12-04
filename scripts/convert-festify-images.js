const sharp = require('sharp');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

// Finde alle Festify-bezogenen Bilder
const patterns = [
  'assets/images/Festify*.{jpg,jpeg,png,JPG,JPEG,PNG}',
  'assets/images/*Festify*.{jpg,jpeg,png,JPG,JPEG,PNG}',
  'assets/images/Web\\ App*.{jpg,jpeg,png,JPG,JPEG,PNG}'
];

async function convertToWebP() {
  const allImages = [];

  // Sammle alle Bilder aus allen Patterns
  for (const pattern of patterns) {
    const images = glob.sync(pattern);
    allImages.push(...images);
  }

  // Remove duplicates
  const uniqueImages = [...new Set(allImages)];

  console.log(`\n🔄 Konvertiere ${uniqueImages.length} Festify Bilder zu WebP...\n`);

  for (const imagePath of uniqueImages) {
    const ext = path.extname(imagePath);
    const outputPath = imagePath.replace(new RegExp(`${ext}$`), '.webp');

    try {
      // Get original size
      const stats = fs.statSync(imagePath);
      const originalSize = stats.size;

      // Convert to WebP
      await sharp(imagePath)
        .webp({ quality: 85 })
        .toFile(outputPath);

      // Get new size
      const newStats = fs.statSync(outputPath);
      const newSize = newStats.size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

      const originalKB = (originalSize / 1024).toFixed(0);
      const newKB = (newSize / 1024).toFixed(0);

      console.log(`✓ ${path.basename(imagePath)} → ${path.basename(outputPath)}`);
      console.log(`  ${originalKB} KB → ${newKB} KB (-${savings}%)\n`);
    } catch (error) {
      console.error(`✗ Fehler bei ${imagePath}:`, error.message);
    }
  }

  console.log('✅ Fertig! Alle Festify Bilder erfolgreich konvertiert.');
}

convertToWebP().catch(console.error);
