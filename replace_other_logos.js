const fs = require('fs');

const fallbackRegex = /<div className="[^"]*w-[8|10|12] h-[8|10|12][^"]*">D<\/div>\s*<span[^>]*>DoorStep<\/span>/;

['AdminLayout.jsx', 'CustomerLayout.jsx'].forEach(file => {
    let code = fs.readFileSync('frontend-web/src/components/layout/' + file, 'utf8');
    if (code.match(fallbackRegex)) {
        code = code.replace(fallbackRegex, '<img src="/logo.jpg" alt="DoorStep Logo" className="h-10 w-auto object-contain" />');
        fs.writeFileSync('frontend-web/src/components/layout/' + file, code);
        console.log(file, "logo replaced!");
    } else {
        console.log(file, "logo not found with regex.");
    }
});
