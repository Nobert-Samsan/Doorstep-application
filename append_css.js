const fs = require('fs');

const css = `
.our-story-section { padding: 100px 48px; background: white; overflow: hidden; }
.our-story-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.story-left { }
.story-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 24px; padding: 6px 16px; font-size: 11px; font-weight: 700; color: #C2410C; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
.story-eyebrow-dot { width: 6px; height: 6px; background: #EA580C; border-radius: 50%; }
.story-headline { font-size: 42px; font-weight: 900; color: #1C1917; letter-spacing: -1.5px; line-height: 1.15; margin-bottom: 28px; }
.story-headline .highlight { color: #EA580C; position: relative; display: inline-block; }
.story-headline .highlight::after { content: ''; position: absolute; bottom: -3px; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #EA580C, #F97316, #FBBF24); border-radius: 2px; opacity: 0.6; }
.story-pull-quote { border-left: 4px solid #EA580C; padding: 16px 20px; background: linear-gradient(135deg, #FFF7ED, #FFFBF8); border-radius: 0 12px 12px 0; margin-bottom: 24px; position: relative; }
.story-pull-quote::before { content: '"'; position: absolute; top: -8px; left: 14px; font-size: 56px; color: #EA580C; opacity: 0.2; font-family: Georgia, serif; line-height: 1; }
.story-pull-quote-text { font-size: 15px; font-weight: 600; color: #C2410C; line-height: 1.6; font-style: italic; position: relative; z-index: 1; }
.story-body { display: flex; flex-direction: column; gap: 14px; margin-bottom: 32px; }
.story-para { font-size: 15px; color: #57534E; line-height: 1.8; font-weight: 400; }
.story-para strong { color: #1C1917; font-weight: 700; }
.story-checkpoints { display: flex; flex-direction: column; gap: 10px; margin-bottom: 36px; }
.story-checkpoint { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #44403C; font-weight: 500; }
.checkpoint-icon { width: 24px; height: 24px; background: linear-gradient(135deg, #EA580C, #C2410C); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: 700; flex-shrink: 0; box-shadow: 0 2px 8px rgba(234,88,12,0.3); }
.story-cta-btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; background: linear-gradient(135deg, #EA580C, #C2410C); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px rgba(234,88,12,0.35); text-decoration: none; letter-spacing: -0.2px; }
.story-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(234,88,12,0.45); }
.story-cta-btn:active { transform: translateY(0); }
.cta-arrow { width: 28px; height: 28px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; transition: transform 0.15s; }
.story-cta-btn:hover .cta-arrow { transform: translateX(3px); }
.story-right { position: relative; }
.story-image-wrap { position: relative; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 64px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08); aspect-ratio: 4/5; }
.story-image-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
.story-image-wrap::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(28,10,0,0.4) 100%); pointer-events: none; }
.story-stat-card-1 { position: absolute; top: -20px; left: -28px; background: white; border-radius: 16px; padding: 16px 20px; box-shadow: 0 8px 28px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #F0EDE9; z-index: 2; min-width: 150px; }
.stat-card-value { font-size: 28px; font-weight: 900; color: #EA580C; letter-spacing: -1px; line-height: 1; margin-bottom: 4px; }
.stat-card-label { font-size: 12px; font-weight: 500; color: #A8A29E; line-height: 1.3; }
.stat-card-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #FFF7ED, #FFEDD5); border: 1px solid #FED7AA; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 10px; }
.story-stat-card-2 { position: absolute; bottom: 24px; right: -28px; background: linear-gradient(135deg, #1C0A00, #C2410C); border-radius: 16px; padding: 16px 20px; box-shadow: 0 8px 28px rgba(234,88,12,0.25); z-index: 2; min-width: 160px; }
.stat-card-2-value { font-size: 26px; font-weight: 900; color: white; letter-spacing: -0.8px; line-height: 1; margin-bottom: 4px; }
.stat-card-2-label { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.65); line-height: 1.3; }
.stat-card-2-icon { width: 36px; height: 36px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 10px; }
.story-deco-circle { position: absolute; bottom: -40px; right: -40px; width: 200px; height: 200px; border-radius: 50%; background: linear-gradient(135deg, #FFF7ED, #FFEDD5); border: 2px solid #FED7AA; z-index: 0; }
.story-deco-dots { position: absolute; top: -20px; right: 20px; width: 80px; height: 80px; background-image: radial-gradient(circle, #FED7AA 1.5px, transparent 1.5px); background-size: 12px 12px; z-index: 0; opacity: 0.6; }
`;

fs.appendFileSync('frontend-web/src/index.css', css);
console.log("Appended CSS successfully!");
