const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const startStr = '{/* FAQ Accordion */}';
const endStr = '{/* Still Have Questions Banner */}';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + code.substring(endIdx);
    fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
    console.log("Successfully removed FAQ section!");
} else {
    console.log("Could not find boundaries");
}
