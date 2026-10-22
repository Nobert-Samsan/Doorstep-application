const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const searchStartStr = '<div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/20 flex flex-col md:flex-row gap-3 max-w-3xl">';
const searchEndStr = '</button>\n            </div>';

const searchStart = code.indexOf(searchStartStr);
const searchEnd = code.indexOf(searchEndStr, searchStart) + searchEndStr.length;

if (searchStart !== -1 && searchEnd !== -1) {
  code = code.substring(0, searchStart) + code.substring(searchEnd);
  fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
  console.log("Removed search block");
} else {
  console.log("Could not find search block boundaries.");
}
