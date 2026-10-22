const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

// Fix image quality: remove scale-105, adjust animation, and sharpen the gradient fade so it doesn't muddy the image
code = code.replace(
  'className="w-full h-full object-cover object-[center_center] lg:object-right scale-105 animate-[zoomOut_1.2s_ease-out_forwards]"',
  'className="w-full h-full object-cover object-[center_center] lg:object-right opacity-0 animate-[fadeInImage_1.2s_ease-out_0.2s_forwards]"'
);

code = code.replace(
  "style={{ background: 'linear-gradient(90deg, #000000 0%, rgba(0,0,0,0.5) 15%, transparent 40%)' }}",
  "style={{ background: 'linear-gradient(90deg, #000000 0%, transparent 10%)' }}"
);

// Add keyframes for fadeInImage
const zoomOutKeyframes = `@keyframes zoomOut {
            from { transform: scale(1.06); }
            to { transform: scale(1); }
          }`;
const newKeyframes = `@keyframes fadeInImage {
            from { opacity: 0; }
            to { opacity: 1; }
          }`;
code = code.replace(zoomOutKeyframes, newKeyframes);

// Fix headline: add whitespace-nowrap and swap the thick underline for the matching SVG curve
const oldHeadline = `<h1 className="text-[38px] lg:text-[52px] xl:text-[72px] font-poppins font-extrabold text-white leading-[1.1] mb-6">
                How <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">DoorStep Works</span>
                  <div className="absolute -bottom-1 left-0 w-full h-[6px] lg:h-[8px] rounded-full bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]"></div>
                </span>
              </h1>`;

const newHeadline = `<h1 className="text-[38px] lg:text-[52px] xl:text-[72px] font-poppins font-extrabold text-white leading-[1.1] mb-6">
                How <span className="relative inline-block whitespace-nowrap">
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A]">DoorStep Works</span>
                  <svg className="absolute w-full h-[8px] lg:h-[12px] -bottom-2 lg:-bottom-3 left-0 text-[#FF7A00] opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>`;

code = code.replace(oldHeadline, newHeadline);

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Fixed headline, underline, and image quality');
