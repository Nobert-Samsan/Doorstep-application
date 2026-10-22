const fs = require('fs');

function increaseLogo(file) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Desktop Navbars (MainLayout, etc)
    code = code.replace(/className="h-10 md:h-12 w-auto/g, 'className="h-16 md:h-20 w-auto');
    
    // Mobile Navbars
    code = code.replace(/className="h-10 w-auto/g, 'className="h-14 w-auto');
    
    // Footer
    code = code.replace(/className="h-12 md:h-16 w-auto object-contain mb-6"/g, 'className="h-20 md:h-24 w-auto object-contain mb-6"');

    fs.writeFileSync(file, code);
}

const layouts = [
    'frontend-web/src/components/layout/MainLayout.jsx',
    'frontend-web/src/components/layout/AdminLayout.jsx',
    'frontend-web/src/components/layout/CustomerLayout.jsx',
    'frontend-web/src/components/layout/WorkerLayout.jsx'
];

layouts.forEach(increaseLogo);

console.log("Increased logo sizes!");
