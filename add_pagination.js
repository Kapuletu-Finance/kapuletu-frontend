const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "src/app/(public)");

function processModuleIndex(moduleName) {
  const indexPath = path.join(srcDir, "docs", moduleName, "page.tsx");
  if (!fs.existsSync(indexPath)) {
    console.log(`Index file not found for ${moduleName}`);
    return;
  }

  const indexContent = fs.readFileSync(indexPath, "utf8");

  // Extract the guides array
  const guidesMatch = indexContent.match(/const guides = \[([\s\S]*?)\];/);
  if (!guidesMatch) {
    console.log(`No guides array found in ${moduleName}`);
    return;
  }

  const guidesStr = guidesMatch[1];
  const guides = [];

  // Extract each title and link
  const regex = /\{[\s]*title:\s*["']([^"']+)["'],\s*link:\s*["']([^"']+)["'][\s]*\}/g;
  let match;
  while ((match = regex.exec(guidesStr)) !== null) {
    guides.push({
      title: match[1],
      link: match[2],
    });
  }

  console.log(`Found ${guides.length} guides in ${moduleName}`);

  // Update each guide page
  for (let i = 0; i < guides.length; i++) {
    const guide = guides[i];
    const prev = i > 0 ? guides[i - 1] : null;
    const next = i < guides.length - 1 ? guides[i + 1] : null;

    // Path to the guide's page.tsx
    const relPath = guide.link.replace("/docs/", "");
    const guideFilePath = path.join(srcDir, "docs", relPath, "page.tsx");

    if (!fs.existsSync(guideFilePath)) {
      console.log(`Guide file not found: ${guideFilePath}`);
      continue;
    }

    let content = fs.readFileSync(guideFilePath, "utf8");

    // Check if pagination already exists
    if (content.includes("<DocsPagination")) {
      console.log(`Pagination already exists in ${guide.link}`);
      continue;
    }

    // Add import if missing
    if (!content.includes("DocsPagination")) {
      const importLines = content.split("\n").filter((line) => line.trim().startsWith("import "));
      if (importLines.length > 0) {
        const lastImport = importLines[importLines.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;
        const paginationImport = `\nimport { DocsPagination } from "@/features/docs/components/DocsPagination";`;
        content =
          content.slice(0, lastImportIndex) + paginationImport + content.slice(lastImportIndex);
      }
    }

    // Generate pagination component string
    const paginationProps = [];
    if (prev) {
      paginationProps.push(`prev={{ title: "${prev.title}", link: "${prev.link}" }}`);
    }
    if (next) {
      paginationProps.push(`next={{ title: "${next.title}", link: "${next.link}" }}`);
    }

    const paginationStr = `\n      <DocsPagination ${paginationProps.join(" ")} />\n`;

    // Insert before closing DocsArticle
    content = content.replace(/(\s*)<\/DocsArticle>/, (match, whitespace) => {
      return `${paginationStr}${whitespace}</DocsArticle>`;
    });

    fs.writeFileSync(guideFilePath, content, "utf8");
    console.log(`Updated ${guide.link}`);
  }
}

// Process known modules that have a guides array
processModuleIndex("campaigns");
processModuleIndex("groups");
// Add others if they have the same pattern, e.g., 'contributions', 'reports', 'expenses'
// Let's check which ones have a guides array by grep or just try them
["contributions", "reports", "expenses", "getting-started"].forEach((mod) => {
  processModuleIndex(mod);
});
