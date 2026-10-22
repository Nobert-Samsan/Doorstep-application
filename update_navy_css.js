const fs = require('fs');

let css = fs.readFileSync('frontend-web/src/index.css', 'utf8');

// The new CSS block provided by the user
const newCSS = `
:root {
  --navy-dark: #0F2247;
  --navy-mid: #1A3570;
  --navy-light: #1E4D8C;
  --navy-pale: #EEF3FC;
  --navy-border: #C5D4ED;
  --orange-deep: #EA580C;
  --orange-mid: #F97316;
  --orange-light: #FB923C;
  --orange-pale: #FFF7ED;
  --orange-gradient: linear-gradient(135deg, #F97316, #EA580C, #C2410C);
  --navy-gradient: linear-gradient(135deg, #0F2247, #1A3570, #1E4D8C);
  --hero-gradient: linear-gradient(135deg, #0F2247 0%, #1A3570 40%, #1565A0 70%, #1E4D8C 100%);
  --mixed-gradient: linear-gradient(135deg, #0F2247 0%, #1A3570 50%, #EA580C 100%);
}

.mission-section {
  padding: 88px 48px;
  background: white;
  position: relative;
  overflow: hidden;
}
.mission-section::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(26,53,112,0.04) 0%, transparent 70%);
  pointer-events: none;
}
.mission-inner {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.mission-hook-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #EEF3FC;
  border: 1px solid #C5D4ED;
  border-radius: 24px;
  padding: 6px 18px;
  font-size: 11px;
  font-weight: 700;
  color: #1A3570;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 22px;
}
.eyebrow-dot {
  width: 6px;
  height: 6px;
  background: #EA580C;
  border-radius: 50%;
}

.mission-hook-text {
  font-size: 40px;
  font-weight: 900;
  color: #0F2247;
  letter-spacing: -1.5px;
  line-height: 1.2;
  max-width: 780px;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 32px;
}
.mission-hook-text .orange {
  color: #EA580C;
  font-style: italic;
  position: relative;
  display: inline-block;
}
.mission-hook-text .orange::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #EA580C, #F97316, #FBBF24);
  border-radius: 2px;
  opacity: 0.6;
}

.mission-declaration {
  text-align: center;
  margin-bottom: 48px;
}
.declaration-card {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, #0F2247 0%, #1A3570 50%, #1E4D8C 100%);
  border-radius: 50px;
  padding: 15px 36px;
  box-shadow: 0 8px 32px rgba(26,53,112,0.3), 0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.08);
  position: relative;
  overflow: hidden;
}
.declaration-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -80%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
  transform: skewX(-20deg);
  animation: shine 3s infinite;
  pointer-events: none;
}
@keyframes shine {
  0% { left: -80%; }
  100% { left: 130%; }
}
.declaration-card::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #F97316, #EA580C);
  border-radius: 50px 0 0 50px;
}
.declaration-icon {
  font-size: 20px;
  flex-shrink: 0;
}
.declaration-text {
  font-size: 20px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.3px;
  white-space: nowrap;
}
.declaration-text .accent {
  background: linear-gradient(90deg, #F97316, #FBBF24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-style: italic;
}

.mission-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
.mission-col-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 30px 28px;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(26,53,112,0.06);
}
.mission-col-card:hover {
  border-color: #C5D4ED;
  box-shadow: 0 12px 32px rgba(26,53,112,0.1);
  transform: translateY(-3px);
}
.mission-col-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #1A3570, #1E4D8C, #EA580C);
  border-radius: 20px 20px 0 0;
}
.mission-col-card::after {
  content: '';
  position: absolute;
  bottom: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(26,53,112,0.04) 0%, transparent 70%);
  pointer-events: none;
}
.col-card-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #EEF3FC, #DCE8F8);
  border: 1px solid #C5D4ED;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 18px;
  box-shadow: 0 2px 8px rgba(26,53,112,0.1);
}
.col-card-title {
  font-size: 17px;
  font-weight: 800;
  color: #0F2247;
  letter-spacing: -0.4px;
  margin-bottom: 12px;
  line-height: 1.2;
}
.col-card-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.8;
  font-weight: 400;
}
.col-card-text strong {
  color: #0F2247;
  font-weight: 700;
}
.col-card-text .orange-text {
  color: #EA580C;
  font-weight: 700;
}

.mission-trust-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: linear-gradient(135deg, #0F2247 0%, #1A3570 35%, #1E4D8C 65%, #EA580C 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(15,34,71,0.25), 0 4px 16px rgba(234,88,12,0.1);
  position: relative;
}
.mission-trust-strip::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 18px 18px;
  pointer-events: none;
}
.mission-trust-strip::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -20%;
  width: 40%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
  transform: skewX(-15deg);
  pointer-events: none;
}
.trust-strip-item {
  padding: 32px 28px;
  text-align: center;
  border-right: 1px solid rgba(255,255,255,0.08);
  position: relative;
  z-index: 1;
  transition: background 0.2s;
}
.trust-strip-item:hover {
  background: rgba(255,255,255,0.05);
}
.trust-strip-item:last-child {
  border-right: none;
}
.trust-strip-icon {
  font-size: 28px;
  margin-bottom: 10px;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}
.trust-strip-value {
  font-size: 32px;
  font-weight: 900;
  color: white;
  letter-spacing: -1px;
  margin-bottom: 6px;
  line-height: 1;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.trust-strip-value.accent-orange {
  background: linear-gradient(90deg, #FBBF24, #F97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.trust-strip-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  line-height: 1.5;
  max-width: 130px;
  margin: 0 auto;
  letter-spacing: 0.02em;
}
.trust-strip-underline {
  width: 28px;
  height: 2px;
  background: linear-gradient(90deg, #F97316, #EA580C);
  border-radius: 1px;
  margin: 8px auto 10px;
  opacity: 0.7;
}

/* Base text/link overrides from prompt */
.mission-section h1, .mission-section h2, .mission-section h3 {
  color: #0F2247;
}
.mission-section a {
  color: #1A3570;
}
.mission-section a:hover {
  color: #EA580C;
}
.mission-section ::selection {
  background: #1A3570;
  color: white;
}
`;

// Append the new CSS overriding the old ones by using an ID or just loading last.
// Since CSS applies the latest rules, appending it to the end is perfect.
fs.appendFileSync('frontend-web/src/index.css', '\\n\\n/* --- NEW MISSION SECTION REDESIGN --- */\\n' + newCSS);

console.log('Appended new CSS to index.css');
