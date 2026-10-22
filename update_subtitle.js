const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

const oldSubtitle = 'From finding a worker to getting the job done — here is exactly how it works';
const newSubtitle = `{activeTab === 'customer' 
                  ? "From finding a professional to getting the job done — here is exactly how it works" 
                  : "From receiving job requests to getting paid — here is exactly how it works"}`;

code = code.replace(oldSubtitle, newSubtitle);

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Subtitle updated');
