const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

// Fix Height
code = code.replace(
  'min-h-[560px] lg:min-h-[60vh]',
  'min-h-[90vh] lg:min-h-[96vh]'
);

// Fix Gradient Mask (so image isn't dark)
code = code.replace(
  "background: 'linear-gradient(90deg, #000000 0%, #000000 36%, rgba(0,0,0,0.78) 52%, rgba(0,0,0,0.1) 100%)'",
  "background: 'linear-gradient(90deg, #000000 0%, #000000 40%, transparent 65%)'"
);

// Fix Floating Badge Position (move it to the right side of the image so it doesn't overlap text)
code = code.replace(
  'absolute bottom-[15%] left-[5%]',
  'absolute bottom-[20%] right-[10%]'
);

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Fixed About hero messy layout and height');
