const fs = require('fs');

// Admin Layout
let adminCode = fs.readFileSync('frontend-web/src/components/layout/AdminLayout.jsx', 'utf8');
const adminLogoHTML = '<h2 className="text-2xl font-bold text-accent">DoorStep</h2>';
adminCode = adminCode.replace(adminLogoHTML, '<img src="/logo.jpg" alt="DoorStep Logo" className="h-10 w-auto object-contain" />');
fs.writeFileSync('frontend-web/src/components/layout/AdminLayout.jsx', adminCode);

// Customer Layout
let customerCode = fs.readFileSync('frontend-web/src/components/layout/CustomerLayout.jsx', 'utf8');
const startIdx = customerCode.indexOf('<div className="nav-logo-icon">');
const endIdx = customerCode.indexOf('</Link>', startIdx);
if (startIdx !== -1 && endIdx !== -1) {
    const oldBlock = customerCode.substring(startIdx, endIdx);
    customerCode = customerCode.replace(oldBlock, '<img src="/logo.jpg" alt="DoorStep Logo" className="h-10 w-auto object-contain" />\n        ');
    fs.writeFileSync('frontend-web/src/components/layout/CustomerLayout.jsx', customerCode);
    console.log("CustomerLayout logo replaced!");
}

console.log("Admin and Customer layouts updated!");
