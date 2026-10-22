const fs = require('fs');

const css = `
.mission-section { padding: 80px 48px; background: white; position: relative; overflow: hidden; }
.mission-section::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(234,88,12,0.04) 0%, transparent 70%); pointer-events: none; }
.mission-inner { max-width: 1000px; margin: 0 auto; position: relative; z-index: 1; }
.mission-hook { text-align: center; margin-bottom: 32px; }
.mission-hook-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 24px; padding: 5px 16px; font-size: 11px; font-weight: 700; color: #C2410C; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
.mission-hook-text { font-size: 38px; font-weight: 900; color: #1C1917; letter-spacing: -1.5px; line-height: 1.2; max-width: 780px; margin: 0 auto; }
.mission-hook-text .orange { color: #EA580C; position: relative; display: inline-block; }
.mission-hook-text .orange::after { content: ''; position: absolute; bottom: -3px; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #EA580C, #FBBF24); border-radius: 2px; opacity: 0.5; }
.mission-declaration { text-align: center; margin-bottom: 48px; }
.declaration-card { display: inline-flex; align-items: center; gap: 14px; background: linear-gradient(135deg, #1C0A00, #7C2D00, #C2410C); border-radius: 50px; padding: 14px 32px; box-shadow: 0 8px 28px rgba(234,88,12,0.25), 0 2px 8px rgba(0,0,0,0.1); position: relative; overflow: hidden; }
.declaration-card::before { content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); transform: skewX(-20deg); pointer-events: none; }
.declaration-icon { font-size: 20px; flex-shrink: 0; }
.declaration-text { font-size: 20px; font-weight: 800; color: white; letter-spacing: -0.4px; white-space: nowrap; }
.declaration-text span { color: #FBBF24; }
.mission-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 48px; }
.mission-col-card { background: #FAFAF9; border: 1px solid #F0EDE9; border-radius: 20px; padding: 28px 28px; transition: all 0.2s; position: relative; overflow: hidden; }
.mission-col-card:hover { background: white; border-color: #FED7AA; box-shadow: 0 8px 24px rgba(234,88,12,0.08); transform: translateY(-2px); }
.mission-col-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #EA580C, #F97316); border-radius: 20px 20px 0 0; }
.col-card-icon { width: 48px; height: 48px; background: linear-gradient(135deg, #FFF7ED, #FFEDD5); border: 1px solid #FED7AA; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 16px; }
.col-card-title { font-size: 16px; font-weight: 800; color: #1C1917; letter-spacing: -0.3px; margin-bottom: 10px; line-height: 1.3; }
.col-card-text { font-size: 14px; color: #57534E; line-height: 1.8; font-weight: 400; }
.col-card-text strong { color: #1C1917; font-weight: 700; }
.mission-trust-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; background: linear-gradient(135deg, #1C0A00, #7C2D00, #EA580C); border-radius: 20px; overflow: hidden; box-shadow: 0 8px 28px rgba(234,88,12,0.2); position: relative; }
.mission-trust-strip::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 20px 20px; pointer-events: none; }
.trust-strip-item { padding: 28px 32px; text-align: center; border-right: 1px solid rgba(255,255,255,0.1); position: relative; z-index: 1; transition: background 0.15s; }
.trust-strip-item:hover { background: rgba(255,255,255,0.05); }
.trust-strip-item:last-child { border-right: none; }
.trust-strip-icon { font-size: 28px; margin-bottom: 8px; display: block; }
.trust-strip-value { font-size: 28px; font-weight: 900; color: white; letter-spacing: -0.8px; margin-bottom: 4px; line-height: 1; }
.trust-strip-label { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.6); line-height: 1.4; max-width: 140px; margin: 0 auto; }
`;

fs.appendFileSync('frontend-web/src/index.css', css);
console.log("Appended mission CSS successfully!");
