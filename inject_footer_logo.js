const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/components/layout/MainLayout.jsx', 'utf8');

const targetStr = '<div className="col-span-1 md:col-span-1">\n              \n              <p className="text-gray-600';
const replaceStr = '<div className="col-span-1 md:col-span-1">\n              <img src="/logo.jpg" alt="DoorStep Logo" className="h-12 w-auto object-contain mb-6" />\n              <p className="text-gray-600';

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('frontend-web/src/components/layout/MainLayout.jsx', code);
console.log("Footer logo injected!");
