const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

// 1. Remove GET STARTED pill
const getStartedRegex = /<FadeIn delay=\{0\}>\s*<div className="inline-flex items-center gap-2 bg-\[#FF7A00\]\/10 border border-\[#FF7A00\]\/30 px-3 py-1\.5 rounded-full mb-6">\s*<div className="w-1\.5 h-1\.5 rounded-full bg-\[#FF7A00\] animate-pulse"><\/div>\s*<span className="text-\[#FF7A00\] text-\[13px\] font-semibold uppercase tracking-\[0\.12em\]">Get Started<\/span>\s*<\/div>\s*<\/FadeIn>/;
code = code.replace(getStartedRegex, '');

// 2. Remove the secondary ghost button (Browse Services / How Payments Work)
const ghostBtnRegex = /<Link to=\{activeTab === 'customer' \? "\/services" : "\/how-it-works"\} className="w-full sm:w-auto group bg-transparent border border-white\/30 text-white hover:bg-white hover:text-black font-poppins font-semibold text-\[16px\] py-\[16px\] px-\[32px\] rounded-\[12px\] transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">[\s\S]*?<\/Link>/;
code = code.replace(ghostBtnRegex, '');

// 3. Remove the Trust Row
const trustRowRegex = /\{\/\* Trust Row \*\/\}\s*<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-\[13px\] text-white\/75 font-inter">[\s\S]*?<\/div>\s*<\/FadeIn>/;
// Wait, removing up to </FadeIn> would delete the closing tag for FadeIn delay={300}.
// The Trust Row div itself:
const trustRowDivRegex = /\{\/\* Trust Row \*\/\}\s*<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-\[13px\] text-white\/75 font-inter">[\s\S]*?<\/div>/;
code = code.replace(trustRowDivRegex, '');


fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Removed eyebrow, secondary button, and trust row');
