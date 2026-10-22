const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

const targetInsertStr = '{/* 2. PickMe Style Benefits Section */}';
const insertIdx = code.indexOf(targetInsertStr);

if (insertIdx !== -1) {
    const lines = [
      '{/* Mission Statement Section */}',
      '<section className="mission-section">',
      '  <div className="mission-inner">',
      '    {/* Layer 1 - Hook */}',
      '    <div className="mission-hook">',
      '      <div className="mission-hook-eyebrow">🇱🇰 Why DoorStep Exists</div>',
      '      <h2 className="mission-hook-text">',
      '        Finding reliable home help in Sri Lanka has always been a <span className="orange"><i>challenge.</i></span>',
      '      </h2>',
      '    </div>',
      '',
      '    {/* Layer 2 - Declaration Card */}',
      '    <div className="mission-declaration">',
      '      <div className="declaration-card">',
      '        <div className="declaration-icon">🚀</div>',
      '        <div className="declaration-text">',
      '          DoorStep was built to <span>change that.</span>',
      '        </div>',
      '      </div>',
      '    </div>',
      '',
      '    {/* Layer 3 - Two Columns */}',
      '    <div className="mission-columns">',
      '      <div className="mission-col-card">',
      '        <div className="col-card-icon">🏠</div>',
      '        <div className="col-card-title">Who We Are</div>',
      '        <div className="col-card-text">',
      '          We are Sri Lanka&apos;s dedicated home services marketplace — a platform that connects homeowners and tenants across Western Province with <strong>verified, background-checked skilled professionals</strong> for every home service need. From plumbing and electrical work to English tutoring, home cleaning, painting and beyond.',
      '        </div>',
      '      </div>',
      '      <div className="mission-col-card">',
      '        <div className="col-card-icon">⚡</div>',
      '        <div className="col-card-title">What We Do For You</div>',
      '        <div className="col-card-text">',
      '          Whether you need a plumber urgently, a painter for your living room or a tutor for your child — <strong>DoorStep brings the right professional to your door.</strong> Quickly, safely and transparently. No word of mouth. No uncertainty. Just skilled, verified help when you need it.',
      '        </div>',
      '      </div>',
      '    </div>',
      '',
      '    {/* Layer 4 - Trust Strip */}',
      '    <div className="mission-trust-strip">',
      '      <div className="trust-strip-item">',
      '        <span className="trust-strip-icon">🔒</span>',
      '        <div className="trust-strip-value">100%</div>',
      '        <div className="trust-strip-label">Verified professionals</div>',
      '      </div>',
      '      <div className="trust-strip-item">',
      '        <span className="trust-strip-icon">🌍</span>',
      '        <div className="trust-strip-value">25</div>',
      '        <div className="trust-strip-label">Districts covered island-wide</div>',
      '      </div>',
      '      <div className="trust-strip-item">',
      '        <span className="trust-strip-icon">⭐</span>',
      '        <div className="trust-strip-value">50+</div>',
      '        <div className="trust-strip-label">Types of home services available</div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</section>',
      '',
      '      '
    ];
              
    code = code.substring(0, insertIdx) + lines.join('\n') + code.substring(insertIdx);
    fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
    console.log("Successfully inserted the mission section!");
} else {
    console.log("Could not find insertion point");
}
