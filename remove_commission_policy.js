const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const sectionStart = code.indexOf('{/* Commission Policy (Only for Workers) */}');
const sectionEnd = code.indexOf('</section>', sectionStart);

if (sectionStart !== -1 && sectionEnd !== -1) {
  // It's wrapped in a conditional: {activeTab === 'worker' && ( <section>...</section> )}
  // So the close is `</section>\n      )}`
  const closeIndex = code.indexOf(')}', sectionEnd);
  
  if (closeIndex !== -1) {
    code = code.substring(0, sectionStart) + code.substring(closeIndex + 2);
    fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
    console.log('Removed Commission Policy section');
  } else {
    console.log('Could not find end of conditional block');
  }
} else {
  console.log('Could not find Commission Policy section');
}
