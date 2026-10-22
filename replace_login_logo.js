const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/auth/Login.jsx', 'utf8');

const oldMobileLogo = `<div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A]">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Door<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]">Step</span></span>`;

const newMobileLogo = `<img src="/logo-new.png" alt="DoorStep" className="h-10 object-contain" />`;

const oldDesktopLogo = `<div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] shadow-[0_4px_16px_rgba(255,122,0,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">Door<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F0A] to-[#F94D1A]">Step</span></span>
            </div>`;

const newDesktopLogo = `<img src="/logo-new.png" alt="DoorStep" className="h-[4.5rem] object-contain -ml-2" />`; // Adjusted height and margin for the big logo

code = code.replace(oldMobileLogo, newMobileLogo);
code = code.replace(oldDesktopLogo, newDesktopLogo);

fs.writeFileSync('frontend-web/src/pages/auth/Login.jsx', code);
console.log('Logos replaced successfully');
