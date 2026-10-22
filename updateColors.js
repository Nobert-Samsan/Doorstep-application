const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend-web', 'src', 'pages', 'public', 'Landing.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace backgrounds
content = content.replace(/bg-white/g, 'bg-cream');
content = content.replace(/bg-gradient-to-br from-amber-50 via-white to-amber-100/g, 'bg-cream');
content = content.replace(/bg-amber-50/g, 'bg-[#E5D7CC]'); // slightly darker cream for contrast
content = content.replace(/bg-gray-50/g, 'bg-white'); // keep cards white
content = content.replace(/bg-gray-900/g, 'bg-olive');

// Replace text colors
content = content.replace(/text-gray-900/g, 'text-espresso');
content = content.replace(/text-gray-800/g, 'text-espresso');
content = content.replace(/text-gray-700/g, 'text-espresso/90');
content = content.replace(/text-gray-600/g, 'text-espresso/80');
content = content.replace(/text-gray-500/g, 'text-espresso/60');
content = content.replace(/text-gray-400/g, 'text-espresso/40');

// Replace primary and accents
content = content.replace(/text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-800/g, 'text-burnt-text');
content = content.replace(/text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600/g, 'text-burnt-text');
content = content.replace(/bg-primary\/20/g, 'bg-burnt-orange/20');
content = content.replace(/bg-primary\/5/g, 'bg-burnt-orange/5');
content = content.replace(/bg-primary/g, 'bg-burnt-orange');
content = content.replace(/text-primary/g, 'text-burnt-text');
content = content.replace(/hover:bg-primary-dark/g, 'hover:bg-chocolate');

// Replace borders
content = content.replace(/border-gray-100/g, 'border-espresso/10');
content = content.replace(/border-gray-200/g, 'border-espresso/20');
content = content.replace(/border-amber-100/g, 'border-espresso/10');
content = content.replace(/border-amber-200/g, 'border-espresso/20');

// App Download specific fixes
content = content.replace(/bg-gray-800/g, 'bg-olive/80');
content = content.replace(/bg-gray-700/g, 'bg-olive/50');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Colors updated successfully.');
