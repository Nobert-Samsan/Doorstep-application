const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const targetStrStart = '<div className="space-y-4 text-gray-600 text-lg mb-8">';
const targetStrEnd = '</div>\n              <button className="px-6 py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-amber-50 transition-colors">';

const startIdx = code.indexOf(targetStrStart);
const endIdx = code.indexOf(targetStrEnd);

if (startIdx !== -1 && endIdx !== -1) {
    const newText = \`              <div className="space-y-4 text-gray-600 text-lg mb-8">
                <p>
                  Finding a reliable, skilled and trustworthy home service worker in Sri Lanka has always been a challenge. Most families rely on word of mouth — asking neighbours, calling friends, hoping someone knows someone. It is slow, unreliable and sometimes unsafe.
                </p>
                <p>
                  DoorStep was built to change that.
                </p>
                <p>
                  We are Sri Lanka's dedicated home services marketplace — a platform that connects homeowners and tenants across Western Province with verified, background-checked skilled professionals for every home service need. From plumbing and electrical work to English tutoring, home cleaning, painting and beyond.
                </p>
                <p>
                  Whether you need a plumber urgently, a painter for your living room or a tutor for your child — DoorStep brings the right professional to your door. Quickly, safely and transparently.
                </p>
              \`;
              
    code = code.substring(0, startIdx) + newText + code.substring(endIdx);
    fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
    console.log("Successfully replaced the text!");
} else {
    console.log("Could not find the target text block to replace.");
}
