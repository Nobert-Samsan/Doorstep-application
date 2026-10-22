const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const badgeRegex = /<div className=\{`absolute -bottom-4 \$\{isLeft \? "-right-4 lg:-right-6" : "-left-4 lg:-left-6"\} w-\[56px\] h-\[56px\].*?>\s*<StepIcon size=\{28\} className="text-white" \/>\s*<\/div>/g;

code = code.replace(badgeRegex, '');

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Removed orange badge from images');
