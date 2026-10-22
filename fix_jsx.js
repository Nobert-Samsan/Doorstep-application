const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const brokenStr = `            </div>\n\n          </div>\n        </div>\n\n      </section>`;
const fixedStr = `          </div>\n        </div>\n\n      </section>`;

code = code.replace(brokenStr, fixedStr);

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Fixed JSX');
