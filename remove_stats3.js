const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const targetStr = `
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-20 flex justify-between items-center text-center">
                <div className="px-2">
                  <p className="font-bold text-gray-900">Founded</p>
                  <p className="text-sm text-primary font-semibold">2023</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="px-2">
                  <p className="font-bold text-gray-900">HQ</p>
                  <p className="text-sm text-primary font-semibold">Colombo</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="px-2">
                  <p className="font-bold text-gray-900">Coverage</p>
                  <p className="text-sm text-primary font-semibold">Island-wide</p>
                </div>
              </div>`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, '');
    fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
    console.log("Successfully removed exact string!");
} else {
    // try to find it by index
    const startIdx = code.indexOf('Founded</p>');
    if (startIdx !== -1) {
        // find the start of the div
        let divStart = code.lastIndexOf('<div', startIdx);
        divStart = code.lastIndexOf('<div', divStart - 1);
        
        let endIdx = code.indexOf('Island-wide</p>', startIdx);
        endIdx = code.indexOf('</div>', endIdx);
        endIdx = code.indexOf('</div>', endIdx + 1);
        
        code = code.substring(0, divStart) + code.substring(endIdx + 6);
        fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
        console.log("Successfully removed by manual index parsing!");
    } else {
        console.log("Could not find 'Founded</p>'");
    }
}
