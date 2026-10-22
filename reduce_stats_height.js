const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// Change container padding
code = code.replace(
  'rounded-[24px] p-8 md:p-10 overflow-hidden',
  'rounded-[24px] py-6 md:py-8 px-8 overflow-hidden'
);

// Reduce margins inside stat items (there are 9 mb-4s inside the stats block)
// I will just use a regex for the stats bar section
const statsStart = code.indexOf('{/* Stats Bar */}');
if (statsStart !== -1) {
  let before = code.substring(0, statsStart);
  let statsBlock = code.substring(statsStart);
  
  statsBlock = statsBlock.replace(/mb-4/g, 'mb-2.5');
  statsBlock = statsBlock.replace(/h-\[120px\]/g, 'h-[100px]');
  
  code = before + statsBlock;
  fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
  console.log('Reduced height of stats bar.');
} else {
  console.log('Stats bar not found');
}
