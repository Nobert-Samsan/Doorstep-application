const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const startIdx = code.indexOf('<div className="absolute -bottom-6');
const endIdxStr = '<p className="text-sm text-primary font-semibold">Island-wide</p>';
let endIdx = code.indexOf(endIdxStr, startIdx);
endIdx = code.indexOf('</div>', endIdx); // Close Coverage div
endIdx = code.indexOf('</div>', endIdx + 1); // Close main stats div

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + code.substring(endIdx + 6);
    fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
    console.log("Successfully removed stats card!");
} else {
    console.log("Not found.");
}
