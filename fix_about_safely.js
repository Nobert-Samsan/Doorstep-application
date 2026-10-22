const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

// 1. Remove orange dot
code = code.replace('<div className="w-2 h-2 rounded-full bg-[#FF7A00]"></div>\n              <span className="text-white text-[13px] font-semibold uppercase tracking-[0.12em]">WHO WE ARE</span>', '<span className="text-white text-[13px] font-semibold uppercase tracking-[0.12em]">WHO WE ARE</span>');

// 2. Remove "Trusted across Western Province" badge
code = code.replace(/\{\/\* Top-left Floating Badge \*\/\}[\s\S]*?<div className="w-2\.5 h-2\.5 rounded-full bg-\[#2E9E5B\]"><\/div>\s*<span className="text-\[#000000\] text-\[13px\] font-semibold">Trusted across Western Province<\/span>\s*<\/div>/, '');

// 3. Remove orange highlight from "Western Province"
code = code.replace('<span className="text-black font-semibold bg-gradient-to-t from-[#FF7A00]/18 to-[#FF7A00]/18 bg-[length:100%_40%] bg-bottom bg-no-repeat">Western Province</span>', '<span className="text-black font-semibold">Western Province</span>');

// 4. Remove PURPOSE & FUTURE badge
code = code.replace(/<FadeIn delay=\{0\}>\s*\{\/\* Eyebrow \*\/\}\s*<div className="inline-flex items-center gap-2 bg-\[#FF7A00\]\/12 border border-\[#FF7A00\]\/30 px-4 py-1\.5 rounded-full mb-6">\s*<div className="w-2 h-2 rounded-full bg-\[#FF7A00\] animate-pulse"><\/div>\s*<span className="text-\[#FF7A00\] text-\[13px\] font-semibold uppercase tracking-\[0\.12em\]">PURPOSE & FUTURE<\/span>\s*<\/div>\s*<\/FadeIn>/, '');

// 5. Remove Tags blocks
// Instead of regex, we can search for the exact container class
const tagBlock1 = '<div className="mt-auto pt-6 border-t border-white/10 flex flex-wrap gap-2">\n                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">\n                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />\n                      <span className="text-white text-[13px] font-medium">Fast</span>\n                    </div>\n                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">\n                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />\n                      <span className="text-white text-[13px] font-medium">Safe</span>\n                    </div>\n                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">\n                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />\n                      <span className="text-white text-[13px] font-medium">Accessible</span>\n                    </div>\n                  </div>';

const tagBlock2 = '<div className="mt-auto pt-6 border-t border-white/10 flex flex-wrap gap-2">\n                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">\n                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />\n                      <span className="text-white text-[13px] font-medium">Trusted</span>\n                    </div>\n                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">\n                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />\n                      <span className="text-white text-[13px] font-medium">Reliable</span>\n                    </div>\n                    <div className="flex items-center gap-1.5 bg-[#FF7A00]/10 border border-[#FF7A00]/30 rounded-full px-3 py-1.5">\n                      <Check size={12} className="text-[#FF7A00]" strokeWidth={3} />\n                      <span className="text-white text-[13px] font-medium">Empowering</span>\n                    </div>\n                  </div>';

code = code.replace('{/* Tags */}\n                  ' + tagBlock1, '');
code = code.replace('{/* Tags */}\n                  ' + tagBlock2, '');

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Restored all fixes cleanly');
