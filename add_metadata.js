const fs = require("fs");
const path = require("path");

const docsDir = path.join(__dirname, "src/app/(public)/docs");

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === "page.tsx") {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Skip if metadata is already exported
  if (content.includes("export const metadata")) {
    return;
  }

  // Skip if it doesn't have DocsArticle
  if (!content.includes("DocsArticle")) {
    return;
  }

  // Extract title and description
  const titleMatch = content.match(/title=(["'])(.*?)\1/);
  const descMatch = content.match(/description=(["'])(.*?)\1/);

  if (titleMatch && descMatch) {
    let title = titleMatch[2];
    const description = descMatch[2];

    // Ensure KapuLetu Docs is appended
    if (!title.includes("KapuLetu")) {
      title = `${title} | KapuLetu Docs`;
    }

    const metadataBlock = `import type { Metadata } from "next";\n\nexport const metadata: Metadata = {\n  title: "${title}",\n  description: "${description}",\n};\n\n`;

    // Find the last import statement
    const importLines = content.split("\n").filter((line) => line.trim().startsWith("import "));
    if (importLines.length > 0) {
      const lastImport = importLines[importLines.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;

      content =
        content.slice(0, lastImportIndex) +
        "\n" +
        metadataBlock +
        content.slice(lastImportIndex).replace(/^\s+/, "");
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Added metadata to: ${filePath}`);
    }
  } else {
    console.log(`Could not find title/description in: ${filePath}`);
  }
}

processDirectory(docsDir);
console.log("Done");
