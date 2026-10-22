const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const regex = /<div className="absolute -bottom-6[^>]*>[\s\S]*?Island-wide<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
const match = code.match(regex);
if (match) {
    console.log("Found it! Removing...");
    // Just remove the top level div, wait, I might remove too much.
    // Let's do exact substring replacement.
    const startStr = '<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-20 flex justify-between items-center text-center">';
    const endStr = '</div>\n              </div>';
    
    const startIdx = code.indexOf(startStr);
    if (startIdx !== -1) {
        let endIdx = code.indexOf('Island-wide</p>', startIdx);
        endIdx = code.indexOf('</div>', endIdx); // close Coverage
        endIdx = code.indexOf('</div>', endIdx + 1); // close container
        
        code = code.substring(0, startIdx) + code.substring(endIdx + 6);
        fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
        console.log("Successfully removed!");
    } else {
        console.log("Start str not found");
    }
} else {
    console.log("Regex not found");
}
