const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace(
  '<Link to="/how-it-works" className="text-white text-[15px] font-semibold underline underline-offset-4 hover:text-[#FF7A00] transition-colors duration-200">\n                      Learn how it works\n                    </Link>',
  '<Link to="/how-it-works" className="border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white hover:text-[#000000] transition-all duration-300">\n                      How It Works\n                    </Link>'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Updated secondary button in worker section');
