const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// The search block starts with: <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/20 flex flex-col md:flex-row gap-3 max-w-3xl">
const searchRegex = /<div className="bg-white\/10 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white\/20 flex flex-col md:flex-row gap-3 max-w-3xl">[\s\S]*?<button[\s\S]*?onClick=\{handleSearch\}[\s\S]*?<\/button>\n\s*<\/div>/;

if (code.match(searchRegex)) {
  code = code.replace(searchRegex, '');
  fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
  console.log("Search block removed.");
} else {
  console.log("Search block not found.");
}
