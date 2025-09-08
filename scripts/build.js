const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building CSS...');

// Ensure the output directory exists
const outputDir = path.join(process.cwd(), 'app');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Run Tailwind CSS build
try {
  execSync('npx tailwindcss -i ./app/globals.css -o ./app/globals-tailwind.css --minify', { stdio: 'inherit' });
  console.log('Tailwind CSS build completed successfully');
} catch (error) {
  console.error('Tailwind CSS build failed:', error);
  process.exit(1);
}
