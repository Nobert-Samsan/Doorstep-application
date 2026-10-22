const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// 1. Remove accent-orange from Western
code = code.replace(
  '<div className="trust-strip-value accent-orange">Western</div>',
  '<div className="trust-strip-value">Western</div>'
);

// 2. Add navy tags to cards
// Card 1
code = code.replace(
  'home cleaning, painting and beyond.\n        </div>',
  'home cleaning, painting and beyond.\n          <br />\n          <div className="col-card-navy-tag">🔵 NIC Verified Platform</div>\n        </div>'
);

// Card 2
code = code.replace(
  'Just skilled, verified help when you need it.\n        </div>',
  'Just skilled, verified help when you need it.\n          <br />\n          <div className="col-card-navy-tag">🔵 Secure In-App Communication</div>\n        </div>'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Updated Landing HTML for black/orange style');
