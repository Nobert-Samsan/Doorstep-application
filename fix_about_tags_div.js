const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

code = code.replace(/<\/div>\n              <\/div>\n            <\/div>\n            <\/FadeIn>/g, '</div>\n              </div>\n            </FadeIn>');

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Fixed tags div issue');
