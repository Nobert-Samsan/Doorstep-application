const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

// 1. Remove the large outlined number watermark
code = code.replace(
  /<div className="absolute -top-12 left-0 text-\[72px\] font-poppins font-bold text-transparent select-none pointer-events-none" style={{ WebkitTextStroke: '2px rgba\(255,122,0,0\.18\)' }}>\s*0\{idx \+ 1\}\s*<\/div>/g,
  ''
);

// 2. Increase the gap in the row to give the center circle breathing room
code = code.replace(
  /className=\{`flex flex-col lg:flex-row items-center gap-12 lg:gap-\[64px\]/g,
  "className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-[100px] xl:gap-[120px]"
);

// 3. Move the floating square badge to the outer edge of the image so it doesn't crowd the center line
// It's currently: className="absolute -bottom-2 -left-2 lg:bottom-4 lg:-left-6 ...
// We can use isLeft to determine outer edge.
// If isLeft is true, text is left, image is right. So outer edge of image is RIGHT.
// If isLeft is false, text is right, image is left. So outer edge of image is LEFT.
code = code.replace(
  'className="absolute -bottom-2 -left-2 lg:bottom-4 lg:-left-6 w-[56px] h-[56px] rounded-[16px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_12px_24px_rgba(255,122,0,0.4)] z-20 transition-transform duration-300 group-hover:-translate-y-2"',
  'className={`absolute -bottom-4 ${isLeft ? "-right-4 lg:-right-6" : "-left-4 lg:-left-6"} w-[56px] h-[56px] rounded-[16px] bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] flex items-center justify-center shadow-[0_12px_24px_rgba(255,122,0,0.4)] z-20 transition-transform duration-300 group-hover:-translate-y-2`}'
);

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Fixed timeline spacing and removed redundant numbers');
