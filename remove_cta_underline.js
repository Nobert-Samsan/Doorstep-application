const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const oldStr = `Ready to Join <span className="relative inline-block">DoorStep?
                    <div className="absolute -bottom-1 left-0 w-full h-[4px] bg-[#000000] rounded-full"></div>
                  </span>`;
                  
const newStr = `Ready to Join DoorStep?`;

code = code.replace(oldStr, newStr);

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Removed underline from CTA banner heading');
