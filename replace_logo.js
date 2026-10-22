const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/components/layout/MainLayout.jsx', 'utf8');

const oldLogoHTML = `<div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform">D</div>
                <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-900">DoorStep</span>`;

const newLogoHTML = `<img src="/logo.jpg" alt="DoorStep Logo" className="h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform" />`;

code = code.replace(oldLogoHTML, newLogoHTML);

// Let's check if the mobile menu logo also needs replacing
const oldMobileLogoHTML = `<div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center font-bold text-white shadow-lg">D</div>
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-900">DoorStep</span>`;

if (code.includes(oldMobileLogoHTML)) {
    code = code.replace(oldMobileLogoHTML, `<img src="/logo.jpg" alt="DoorStep Logo" className="h-12 w-auto object-contain" />`);
} else {
    // maybe it's slightly different
    console.log("Could not find mobile menu logo string, will try regex.");
    code = code.replace(/<div className="w-10 h-10[^>]*>D<\/div>\s*<span[^>]*>DoorStep<\/span>/g, `<img src="/logo.jpg" alt="DoorStep Logo" className="h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform" />`);
}

fs.writeFileSync('frontend-web/src/components/layout/MainLayout.jsx', code);
console.log("Logo replaced in Navbar!");
