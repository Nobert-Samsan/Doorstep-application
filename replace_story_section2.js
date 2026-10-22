const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/About.jsx', 'utf8');

const targetStart = '{/* 2. Our Story */}';
const targetEnd = '{/* 3. Mission and Vision */}';

const startIdx = code.indexOf(targetStart);
const endIdx = code.indexOf(targetEnd);

if (startIdx !== -1 && endIdx !== -1) {
    const lines = [
      '{/* 2. Our Story - Split Personality Redesign */}',
      '<section className="our-story-section">',
      '  <div className="our-story-inner">',
      '    {/* Left Column - Text Side */}',
      '    <div className="story-left">',
      '      <div className="story-eyebrow">',
      '        <div className="story-eyebrow-dot"></div>',
      '        Our Story',
      '      </div>',
      '      <h2 className="story-headline">',
      '        Connecting Sri Lanka, One <span className="highlight">Home</span> at a Time',
      '      </h2>',
      '      <blockquote className="story-pull-quote">',
      '        <p className="story-pull-quote-text">',
      '          Finding a reliable, skilled and trustworthy home service worker in Sri Lanka has always been a challenge.',
      '        </p>',
      '      </blockquote>',
      '      <div className="story-body">',
      '        <p className="story-para">',
      '          DoorStep was built to change that. We are Sri Lanka&apos;s dedicated home services marketplace — a platform that connects homeowners and tenants across all 25 districts with verified, background-checked skilled professionals for every home service need.',
      '        </p>',
      '        <p className="story-para">',
      '          From plumbing and electrical work to English tutoring, home cleaning, painting and beyond — whether you need a plumber urgently, a painter for your living room or a tutor for your child, DoorStep brings the right professional to your door. Quickly, safely and transparently.',
      '        </p>',
      '      </div>',
      '      <div className="story-checkpoints">',
      '        <div className="story-checkpoint">',
      '          <div className="checkpoint-icon">✓</div>',
      '          <span>Verified professionals across all 25 districts</span>',
      '        </div>',
      '        <div className="story-checkpoint">',
      '          <div className="checkpoint-icon">✓</div>',
      '          <span>Transparent pricing — itemized quotes before work begins</span>',
      '        </div>',
      '        <div className="story-checkpoint">',
      '          <div className="checkpoint-icon">✓</div>',
      '          <span>Secure in-app communication — your number stays private</span>',
      '        </div>',
      '      </div>',
      '      <Link to="/how-it-works" className="story-cta-btn">',
      '        Learn How It Works ',
      '        <div className="cta-arrow">→</div>',
      '      </Link>',
      '    </div>',
      '    {/* Right Column - Image Side */}',
      '    <div className="story-right">',
      '      <div className="story-deco-circle"></div>',
      '      <div className="story-deco-dots"></div>',
      '      <div className="story-image-wrap">',
      '        <img src="/story-portrait.jpg" alt="Friendly DoorStep Professional at a modern Sri Lankan home entrance" />',
      '      </div>',
      '      <div className="story-stat-card-1">',
      '        <div className="stat-card-icon">🏘️</div>',
      '        <div className="stat-card-value">25</div>',
      '        <div className="stat-card-label">Districts covered<br/>island-wide</div>',
      '      </div>',
      '      <div className="story-stat-card-2">',
      '        <div className="stat-card-2-icon">✅</div>',
      '        <div className="stat-card-2-value">100%</div>',
      '        <div className="stat-card-2-label">NIC verified<br/>professionals</div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</section>',
      ''
    ];
              
    code = code.substring(0, startIdx) + lines.join('\\n') + code.substring(endIdx);
    fs.writeFileSync('frontend-web/src/pages/public/About.jsx', code);
    console.log("Successfully replaced the section!");
} else {
    console.log("Could not find boundaries");
}
