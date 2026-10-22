const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const brokenStr = `                  </div>\n                </div>\n              </FadeIn>`;
const fixedStr = `                </div>\n              </FadeIn>`;

code = code.replace(brokenStr, fixedStr);

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Fixed JSX by removing the extra closing div');
