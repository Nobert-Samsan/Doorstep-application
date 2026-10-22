const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

// The file currently has:
//               </div>
// 
//       {/* Commission Policy (Only for Workers) */}
// 
// We need to change that to:
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
// 
//       {/* Commission Policy (Only for Workers) */}

code = code.replace(/<\/div>\s*\{\/\* Commission Policy/, '</div>\\n            </div>\\n          </div>\\n        </div>\\n      </div>\\n\\n      {/* Commission Policy');

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Fixed tags');
