const fs = require('fs');

function replaceSize(file) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Replace h-10 w-auto object-contain
    code = code.replace(/className="h-10 w-auto object-contain"/g, 'className="h-16 md:h-20 w-auto object-contain"');
    
    // Replace h-12 md:h-14 w-auto object-contain
    code = code.replace(/className="h-12 md:h-14 w-auto object-contain/g, 'className="h-16 md:h-20 w-auto object-contain');
    
    // Replace h-12 w-auto object-contain (mobile menu)
    code = code.replace(/className="h-12 w-auto object-contain"/g, 'className="h-16 w-auto object-contain"');
    
    // Replace footer logo specifically (has mb-6)
    code = code.replace(/className="h-12 w-auto object-contain mb-6"/g, 'className="h-24 w-auto object-contain mb-6"');

    fs.writeFileSync(file, code);
}

replaceSize('frontend-web/src/components/layout/MainLayout.jsx');
replaceSize('frontend-web/src/components/layout/AdminLayout.jsx');
replaceSize('frontend-web/src/components/layout/CustomerLayout.jsx');
replaceSize('frontend-web/src/components/layout/WorkerLayout.jsx');

console.log("Increased logo sizes!");
