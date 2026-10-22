const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

code = code.replace(/<\/div>\\n\s*<\/div>\\n\\n\s*\{\/\* Commission Policy/, '</div>\\n      </div>\\n\\n      {/* Commission Policy');
// Wait, in the output, it literally has `</div>\n      </div>\n\n      {/* Commission Policy (Only for Workers) */}`
code = code.replace("</div>\\n      </div>\\n\\n      {/* Commission", "</div>\n      </div>\n\n      {/* Commission");

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
