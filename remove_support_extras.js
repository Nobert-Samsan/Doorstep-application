const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

// 1. Remove Headset Icon block
const headsetRegex = /<FadeIn delay=\{0\}>\s*<div className="w-\[56px\] h-\[56px\].*?">\s*<Headset size=\{28\} className="text-white" \/>\s*<\/div>\s*<\/FadeIn>/;
code = code.replace(headsetRegex, '');

// 2. Remove Availability Pill block
// The pill is a self-invoking function block: {/* Availability Pill */} {(() => { ... })()}
const pillRegex = /\{\/\* Availability Pill \*\/\}\s*\{\(\(\) => \{[\s\S]*?\}\)\(\)\}/;
code = code.replace(pillRegex, '');


fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Removed headset icon and availability pill');
