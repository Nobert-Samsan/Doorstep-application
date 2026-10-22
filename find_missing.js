const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const tags = [...code.matchAll(/<([A-Z][a-zA-Z0-9]+)/g)].map(m => m[1]);
const uniqueTags = [...new Set(tags)];

const missing = uniqueTags.filter(c => {
  const isImported = code.match(new RegExp(`import.*\\\\b${c}\\\\b.*from`));
  const isDefined = code.match(new RegExp(`const ${c}\\s*=`)) || code.match(new RegExp(`function ${c}\\s*\\(`));
  return !isImported && !isDefined;
});

console.log("Missing Components:", missing);
