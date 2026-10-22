const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// Replace the image containers
code = code.replace(
  /<div className="h-56 w-full overflow-hidden relative shrink-0">\s*<img src="([^"]+)" className="([^"]+)" alt="([^"]+)" \/>\s*<div className="absolute inset-0 bg-gradient-to-t from-black\/65 to-transparent"><\/div>/g,
  '<div className="h-56 w-full relative shrink-0">\n                <div className="absolute inset-0 overflow-hidden">\n                  <img src="$1" className="$2" alt="$3" />\n                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>\n                </div>'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Fixed icon overflow!');
