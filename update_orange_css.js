const fs = require('fs');

let css = fs.readFileSync('frontend-web/src/index.css', 'utf8');

const newCSS = `
/* --- NEW ORANGE/BLACK MISSION SECTION REDESIGN --- */
:root {
  --black: #0A0A0A;
  --black-soft: #1C1917;
  --black-mid: #292524;
  --gray-text: #57534E;
  --gray-light: #F5F5F4;
  --orange-primary: #EA580C;
  --orange-mid: #F97316;
  --orange-light: #FB923C;
  --orange-pale: #FFF7ED;
  --orange-border: #FED7AA;
  --orange-gradient: linear-gradient(135deg, #EA580C, #F97316, #FB923C);
  --navy-accent: #1A3570;
  --white: #FFFFFF;
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
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(234,88,12,0.05) 0%, transparent 70%);
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
  background: #FFF7ED;
  border: 1px solid #FED7AA;
  border-radius: 24px;
  padding: 6px 18px;
  font-size: 11px;
  font-weight: 700;
  color: #EA580C;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 22px;
}
.eyebrow-dot {
  width: 6px;
  height: 6px;
  background: #EA580C;
  border-radius: 50%;
  animation: blink 2s infinite;
}
@keyframes blink {
  0%,100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.mission-hook-text {
  font-size: 40px;
  font-weight: 900;
  color: #0A0A0A;
  letter-spacing: -1.5px;
  line-height: 1.2;
  max-width: 780px;
  margin: 0 auto 32px;
  text-align: center;
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
  opacity: 0.55;
}

.mission-declaration {
  text-align: center;
  margin-bottom: 48px;
}
.declaration-card {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  background: #0A0A0A;
  border-radius: 50px;
  padding: 15px 36px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
}
.declaration-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #F97316, #EA580C);
  border-radius: 50px 0 0 50px;
}
.declaration-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -80%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
  transform: skewX(-20deg);
  animation: shine 4s infinite;
  pointer-events: none;
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
  border: 1px solid #E7E5E4;
  border-radius: 20px;
  padding: 30px 28px;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.mission-col-card:hover {
  border-color: #FED7AA;
  box-shadow: 0 12px 32px rgba(234,88,12,0.1);
  transform: translateY(-3px);
}
.mission-col-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #EA580C, #F97316, #0A0A0A);
  border-radius: 20px 20px 0 0;
}
.mission-col-card::after {
  content: '';
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(234,88,12,0.05) 0%, transparent 70%);
  pointer-events: none;
}

.col-card-icon {
  width: 50px;
  height: 50px;
  background: #0A0A0A;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.col-card-title {
  font-size: 17px;
  font-weight: 800;
  color: #0A0A0A;
  letter-spacing: -0.4px;
  margin-bottom: 12px;
  line-height: 1.2;
}

.col-card-text {
  font-size: 14px;
  color: #57534E;
  line-height: 1.8;
  font-weight: 400;
}
.col-card-text strong {
  color: #0A0A0A;
  font-weight: 700;
}
.col-card-text .orange-text {
  color: #EA580C;
  font-weight: 700;
}

.col-card-navy-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 16px;
  background: #EEF3FC;
  border: 1px solid #C5D4ED;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #1A3570;
}

.mission-trust-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: #0A0A0A;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.3);
  position: relative;
  border: 1px solid rgba(255,255,255,0.04);
}
.mission-trust-strip::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 18px 18px;
  pointer-events: none;
}
.mission-trust-strip::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 35%;
  background: linear-gradient(90deg, transparent, rgba(234,88,12,0.08));
  pointer-events: none;
}
.trust-strip-item {
  padding: 32px 28px;
  text-align: center;
  border-right: 1px solid rgba(255,255,255,0.06);
  position: relative;
  z-index: 1;
  transition: background 0.2s;
}
.trust-strip-item:hover {
  background: rgba(255,255,255,0.03);
}
.trust-strip-item:last-child {
  border-right: none;
}
.trust-strip-icon {
  font-size: 28px;
  margin-bottom: 10px;
  display: block;
}
.trust-strip-value {
  font-size: 36px;
  font-weight: 900;
  letter-spacing: -1px;
  margin-bottom: 0;
  line-height: 1;
  background: linear-gradient(135deg, #F97316, #EA580C);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.trust-strip-underline {
  width: 32px;
  height: 2px;
  background: linear-gradient(90deg, #EA580C, #F97316);
  border-radius: 1px;
  margin: 10px auto 10px;
  opacity: 0.6;
}
.trust-strip-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.45);
  line-height: 1.5;
  max-width: 130px;
  margin: 0 auto;
  letter-spacing: 0.02em;
}
`;

fs.appendFileSync('frontend-web/src/index.css', '\n\n' + newCSS);
console.log('Appended black/orange CSS to index.css');
