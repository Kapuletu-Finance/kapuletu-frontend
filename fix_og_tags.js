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

  // Check if it has a basic metadata export
  const metadataMatch = content.match(
    /export const metadata: Metadata = \{\s*title:\s*(["'])(.*?)\1,\s*description:\s*(["'])(.*?)\3,?\s*\};/s,
  );

  if (metadataMatch) {
    const fullMatch = metadataMatch[0];
    const title = metadataMatch[2];
    const description = metadataMatch[4];

    const newMetadata = `export const metadata: Metadata = {
  title: "${title}",
  description: "${description}",
  openGraph: {
    title: "${title}",
    description: "${description}",
  },
  twitter: {
    title: "${title}",
    description: "${description}",
  },
};`;

    content = content.replace(fullMatch, newMetadata);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated OG tags for: ${filePath}`);
  }
}

processDirectory(docsDir);
console.log("Done");
