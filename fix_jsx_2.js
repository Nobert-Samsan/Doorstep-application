const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const brokenStr = `          <div className="block lg:hidden absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, #000000 95%)' }}></div>\n          \n          </div>\n        </div>`;
const fixedStr = `          <div className="block lg:hidden absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, #000000 95%)' }}></div>\n        </div>`;

code = code.replace(brokenStr, fixedStr);

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Fixed JSX by removing the extra closing div');
