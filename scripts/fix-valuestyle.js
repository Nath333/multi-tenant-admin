import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('dist') && !file.includes('.git')) {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

const files = getAllFiles(path.join(rootDir, 'src'));
let totalChanges = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix valueStyle={{ ... }} -> styles={{ value: { ... } }}
  // Match valueStyle with inline style objects
  const valueStyleRegex = /valueStyle=\{\{([^}]+)\}\}/g;
  if (valueStyleRegex.test(content)) {
    content = content.replace(/valueStyle=\{\{([^}]+)\}\}/g, 'styles={{ value: {$1} }}');
    changed = true;
    console.log(`Fixed valueStyle in ${path.relative(rootDir, file)}`);
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    totalChanges++;
  }
});

console.log(`\nTotal files modified: ${totalChanges}`);
