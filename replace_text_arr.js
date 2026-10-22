const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const targetStart = '<div className="space-y-4 text-gray-600 text-lg mb-8">';
const targetEnd = '</div>';

const startIdx = code.indexOf(targetStart);
let endIdx = code.indexOf(targetEnd, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const lines = [
        '<div className="space-y-4 text-gray-600 text-lg mb-8">',
        '  <p>',
        '    Finding a reliable, skilled and trustworthy home service worker in Sri Lanka has always been a challenge. Most families rely on word of mouth — asking neighbours, calling friends, hoping someone knows someone. It is slow, unreliable and sometimes unsafe.',
        '  </p>',
        '  <p>',
        '    DoorStep was built to change that.',
        '  </p>',
        '  <p>',
        '    We are Sri Lanka\\'s dedicated home services marketplace — a platform that connects homeowners and tenants across Western Province with verified, background-checked skilled professionals for every home service need. From plumbing and electrical work to English tutoring, home cleaning, painting and beyond.',
        '  </p>',
        '  <p>',
        '    Whether you need a plumber urgently, a painter for your living room or a tutor for your child — DoorStep brings the right professional to your door. Quickly, safely and transparently.',
        '  </p>',
        '</div>'
    ];
    
    code = code.substring(0, startIdx) + lines.join('\\n') + code.substring(endIdx + 6);
    fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
    console.log("Replaced text successfully!");
} else {
    console.log("Could not find block");
}
