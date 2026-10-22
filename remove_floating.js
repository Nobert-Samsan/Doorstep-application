const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// The floating elements are preceded by the comment {/* Floating Elements - Desktop Only */}
const floatingStart = code.indexOf('{/* Floating Elements - Desktop Only */}');
if (floatingStart !== -1) {
  const contentContainer = code.indexOf('{/* Content Container */}');
  if (contentContainer !== -1) {
    // We want to remove from floatingStart to contentContainer, but keeping the closing </div> of the Image Container
    code = code.substring(0, floatingStart) + '\n        </div>\n\n        ' + code.substring(contentContainer);
    fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
    console.log('Removed floating cards!');
  }
}
