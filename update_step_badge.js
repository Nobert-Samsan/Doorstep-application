const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const oldHeader = `<div className="flex items-center gap-4 mb-6">
                          <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] shadow-[0_0_0_6px_rgba(255,122,0,0.12)] flex flex-shrink-0 items-center justify-center">
                            <span className="text-white font-poppins font-bold text-[20px]">{idx + 1}</span>
                          </div>
                          <div className="text-[#FF7A00] uppercase text-[14px] font-semibold tracking-[0.12em]">
                            STEP {idx + 1}
                          </div>
                        </div>`;

const newHeader = `<div className="mb-8 inline-flex">
                          <div className="w-[64px] h-[64px] rounded-full bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] shadow-[0_0_0_8px_rgba(255,122,0,0.12)] flex flex-col items-center justify-center">
                            <span className="text-white/90 font-poppins font-bold text-[11px] tracking-[0.12em] uppercase leading-none mb-1">Step</span>
                            <span className="text-white font-poppins font-extrabold text-[24px] leading-none">{idx + 1}</span>
                          </div>
                        </div>`;

if (code.includes(oldHeader)) {
  code = code.replace(oldHeader, newHeader);
  fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
  console.log('Successfully updated step badge');
} else {
  console.log('Could not find old header block');
}
