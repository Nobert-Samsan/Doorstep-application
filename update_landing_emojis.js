const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

code = code.replace(
  '<div className="col-card-navy-tag">🔵 NIC Verified Platform</div>',
  '<div className="col-card-navy-tag">✓ NIC Verified Platform</div>'
);

code = code.replace(
  '<div className="col-card-navy-tag">🔵 Secure In-App Communication</div>',
  '<div className="col-card-navy-tag">✓ Secure In-App Communication</div>'
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Updated Landing HTML to remove blue emojis');
