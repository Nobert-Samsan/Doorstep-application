const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const regex = /<FadeIn delay=\{0\}>\s*\{\/\* Eyebrow \*\/\}\s*<div className="inline-flex items-center gap-2 bg-\[#FF7A00\]\/12 border border-\[#FF7A00\]\/30 px-4 py-1\.5 rounded-full mb-6">\s*<div className="w-2 h-2 rounded-full bg-\[#FF7A00\] animate-pulse"><\/div>\s*<span className="text-\[#FF7A00\] text-\[13px\] font-semibold uppercase tracking-\[0\.12em\]">PURPOSE & FUTURE<\/span>\s*<\/div>\s*<\/FadeIn>/;

code = code.replace(regex, '');

fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
console.log('Removed PURPOSE & FUTURE badge');
