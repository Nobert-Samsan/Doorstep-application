const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const startStr = '{/* 4. Impact Numbers */}';
const endStr = '{/* 6. Our Values */}';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + code.substring(endIdx);
    fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
    console.log("Successfully removed sections!");
} else {
    console.log("Could not find sections");
}
