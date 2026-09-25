const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/features/docs/components/DocsSidebar.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of `<Link href=` with `<Link onClick={onClose} href=`
content = content.replace(/<Link\s+href=/g, '<Link onClick={onClose} href=');
// Also handle `<Link\n                      href=` if there are newlines
content = content.replace(/<Link[\s\n]+href=/g, '<Link onClick={onClose} href=');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done');
