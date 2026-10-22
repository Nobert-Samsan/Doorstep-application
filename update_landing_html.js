const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

// 1. Eyebrow
code = code.replace(
  '<div className="mission-hook-eyebrow">Why DoorStep Exists</div>',
  '<div className="mission-hook-eyebrow"><span className="eyebrow-dot"></span> WHY DOORSTEP EXISTS</div>'
);

// 2. Declaration
code = code.replace(
  'DoorStep was built to <span>change that.</span>',
  '🚀 DoorStep was built to <span className="accent">change that.</span>'
);

// 3. Two column left card "Western Province" orange
code = code.replace(
  'Western Province with <strong>verified, background-checked skilled professionals</strong>',
  '<span className="orange-text">Western Province</span> with <strong>verified, background-checked skilled professionals</strong>'
);

// 4. Trust Strip
code = code.replace(
  '<div className="trust-strip-item">\n        <span className="trust-strip-icon">🔒</span>\n        <div className="trust-strip-value">100%</div>\n        <div className="trust-strip-label">Verified professionals</div>\n      </div>',
  `<div className="trust-strip-item">
        <span className="trust-strip-icon">🔒</span>
        <div className="trust-strip-value">100%</div>
        <div className="trust-strip-underline"></div>
        <div className="trust-strip-label">NIC Verified Professionals</div>
      </div>`
);

code = code.replace(
  '<div className="trust-strip-item">\n        <span className="trust-strip-icon">📍</span>\n        <div className="trust-strip-value">Western</div>\n        <div className="trust-strip-label">Province covered</div>\n      </div>',
  `<div className="trust-strip-item">
        <span className="trust-strip-icon">📍</span>
        <div className="trust-strip-value accent-orange">Western</div>
        <div className="trust-strip-underline"></div>
        <div className="trust-strip-label">Province covered</div>
      </div>`
);

code = code.replace(
  '<div className="trust-strip-item">\n        <span className="trust-strip-icon">⭐</span>\n        <div className="trust-strip-value">50+</div>\n        <div className="trust-strip-label">Types of home services available</div>\n      </div>',
  `<div className="trust-strip-item">
        <span className="trust-strip-icon">⭐</span>
        <div className="trust-strip-value">50+</div>
        <div className="trust-strip-underline"></div>
        <div className="trust-strip-label">Types of home services available</div>
      </div>`
);

fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Updated Landing.jsx HTML');
