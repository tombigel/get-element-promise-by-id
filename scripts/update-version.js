import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get current version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

console.log(`Updating version references to ${version}`);

// Update demo HTML file if it exists
const demoIndexPath = path.join(__dirname, '..', 'demo', 'index.html');
if (fs.existsSync(demoIndexPath)) {
  let demoContent = fs.readFileSync(demoIndexPath, 'utf8');
  // Replace version in title or other places if needed
  demoContent = demoContent.replace(/v\d+\.\d+\.\d+/g, `v${version}`);
  fs.writeFileSync(demoIndexPath, demoContent);
  console.log('Updated demo/index.html');
}

// Update README if it contains version references
const readmePath = path.join(__dirname, '..', 'README.md');
if (fs.existsSync(readmePath)) {
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  // Update version badges or references if they exist
  readmeContent = readmeContent.replace(/v\d+\.\d+\.\d+/g, `v${version}`);
  fs.writeFileSync(readmePath, readmeContent);
  console.log('Updated README.md');
}

console.log('Version update complete');
