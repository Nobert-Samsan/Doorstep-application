const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const regex = /\{\/\* Tags \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;
// Wait, the div structure is:
//                 {/* Tags */}
//                 <div className="mt-auto pt-6 border-t border-white/10 flex flex-wrap gap-2">
//                   ...
//                 </div>
//               </div>
//             </div>
//           </FadeIn>
// So we just want to remove `{/* Tags */}` and its following `div`.

code = code.replace(/\{\/\* Tags \*\/\}[\s\S]*?<div className="mt-auto pt-6 border-t border-white\/10 flex flex-wrap gap-2">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g, (match) => {
  return '</div>\n              </div>\n            </div>';
});

// A safer way: find `{\/\* Tags \*\/}` to the `<\/div>` of the tags container.
code = code.replace(/\{\/\* Tags \*\/\}[\s\S]*?<div className="mt-auto pt-6 border-t border-white\/10 flex flex-wrap gap-2">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '</div>\n              </div>');


// Actually, just replace the explicit tags blocks:
const regex2 = /\{\/\* Tags \*\/\}[\s\S]*?<\/div>\s*(?=\s*<\/div>\s*<\/div>\s*<\/FadeIn>)/g;
code = code.replace(regex2, '');

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Tags removed');
