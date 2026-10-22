const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

// replace any multiple </div> before Commission Policy with a single </div>
code = code.replace(/(<\/div>\s*)+\{\/\* Commission Policy/, '</div>\n\n      {/* Commission Policy');

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
