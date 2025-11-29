import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const widgetsDir = path.join(__dirname, '..', 'src', 'components', 'widgets');

const widgetsToOptimize = [
  'AnalyticsWidget.tsx',
  'AlertsWidget.tsx',
  'ApiUsageWidget.tsx',
  'DeviceStatusWidget.tsx',
  'HVACControlWidget.tsx',
  'LightingControlWidget.tsx',
  'MapWidget.tsx',
  'RecentActivityWidget.tsx',
  'RevenueDashboardWidget.tsx',
  'StorageAnalyticsWidget.tsx',
  'TableWidget.tsx',
  'UserActivityHeatmapWidget.tsx',
];

widgetsToOptimize.forEach(filename => {
  const filePath = path.join(widgetsDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${filename} - file not found`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if already optimized
  if (content.includes('export default memo(')) {
    console.log(`✅ ${filename} - already optimized`);
    return;
  }

  // Add memo import if not present
  if (content.includes("from 'react'")) {
    if (!content.includes('memo')) {
      content = content.replace(
        /import\s*{([^}]*)}\s*from\s*['"]react['"]/,
        (match, imports) => {
          const trimmed = imports.trim();
          return `import { ${trimmed}, memo } from 'react'`;
        }
      );
    }
  } else {
    // Add React import with memo
    const firstImport = content.indexOf('import');
    if (firstImport !== -1) {
      content = content.slice(0, firstImport) +
                `import { memo } from 'react';\n` +
                content.slice(firstImport);
    }
  }

  // Extract component name from filename
  const componentName = filename.replace('.tsx', '');

  // Replace export statement
  const exportPattern = new RegExp(`export default ${componentName};`);
  if (exportPattern.test(content)) {
    content = content.replace(
      exportPattern,
      `// Memoize component to prevent unnecessary re-renders\nexport default memo(${componentName});`
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${filename} - optimized successfully`);
  } else {
    console.log(`⚠️  ${filename} - export pattern not found`);
  }
});

console.log('\n🎉 Widget optimization complete!');
