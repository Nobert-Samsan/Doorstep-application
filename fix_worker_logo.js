const fs = require('fs');
const file = 'frontend-web/src/components/layout/WorkerLayout.jsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /<div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center font-bold text-white shadow-sm">D<\/div>\s*<span className="text-2xl font-extrabold tracking-tight text-gray-900">DoorStep<\/span>/;

if (code.match(regex)) {
    code = code.replace(regex, '<img src="/logo.jpg" alt="DoorStep Logo" className="h-10 w-auto object-contain" />');
    fs.writeFileSync(file, code);
    console.log("WorkerLayout logo replaced successfully!");
} else {
    // try slightly different classes
    const fallbackRegex = /<div className="[^"]*w-[8|10|12] h-[8|10|12][^"]*">D<\/div>\s*<span[^>]*>DoorStep<\/span>/;
    code = code.replace(fallbackRegex, '<img src="/logo.jpg" alt="DoorStep Logo" className="h-10 w-auto object-contain" />');
    fs.writeFileSync(file, code);
    console.log("WorkerLayout logo replaced with fallback!");
}
