const fs = require('fs');

function updateLogo(file) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Replace the image source
    code = code.replace(/\/logo\.jpg/g, '/logo-new.png');
    
    // Revert the aggressive sizing since this is a horizontal logo
    // h-16 md:h-20 -> h-10 md:h-12
    code = code.replace(/h-16 md:h-20/g, 'h-10 md:h-12');
    
    // h-16 -> h-10 (mobile menus, etc)
    code = code.replace(/h-16 w-auto/g, 'h-10 w-auto');
    
    // footer h-24 -> h-12 md:h-16
    code = code.replace(/h-24 w-auto/g, 'h-12 md:h-16 w-auto');

    fs.writeFileSync(file, code);
}

const layouts = [
    'frontend-web/src/components/layout/MainLayout.jsx',
    'frontend-web/src/components/layout/AdminLayout.jsx',
    'frontend-web/src/components/layout/CustomerLayout.jsx',
    'frontend-web/src/components/layout/WorkerLayout.jsx'
];

layouts.forEach(updateLogo);

console.log("Updated logo image and sizes across all layouts!");
