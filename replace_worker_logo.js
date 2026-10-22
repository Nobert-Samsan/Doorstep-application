const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/components/layout/WorkerLayout.jsx', 'utf8');

const targetIdx = code.indexOf('>D</div>');
if (targetIdx !== -1) {
    const startIdx = code.lastIndexOf('<div', targetIdx);
    const endIdx = code.indexOf('</span>', targetIdx) + 7;
    const oldBlock = code.substring(startIdx, endIdx);
    
    code = code.replace(oldBlock, '<img src="/logo.jpg" alt="DoorStep Logo" className="h-10 w-auto object-contain" />');
    fs.writeFileSync('frontend-web/src/components/layout/WorkerLayout.jsx', code);
    console.log("Replaced WorkerLayout logo!");
} else {
    console.log("Could not find logo in WorkerLayout");
}
