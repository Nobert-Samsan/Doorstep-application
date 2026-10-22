const fs = require('fs');

let css = fs.readFileSync('frontend-web/src/index.css', 'utf8');

// Remove the previous orange/black block
const marker = '/* --- NEW ORANGE/BLACK MISSION SECTION REDESIGN --- */';
if (css.includes(marker)) {
  css = css.substring(0, css.indexOf(marker)).trim();
}

const newCSS = `
/* --- NEW LIGHT ORANGE/BLACK MISSION SECTION REDESIGN --- */
:root {
  --black: #111111;
  --black-soft: #222222;
  --gray-text: #57534E;
  --gray-light: #F5F5F4;
  --orange-primary: #EA580C;
  --orange-mid: #F97316;
  --orange-pale: #FFF7ED;
  --orange-border: #FED7AA;
  --orange-gradient: linear-gradient(135deg, #F97316, #EA580C);
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
  background: radial-gradient(ellipse, rgba(234,88,12,0.06) 0%, transparent 70%);
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
  background: var(--orange-pale);
  border: 1px solid var(--orange-border);
  border-radius: 24px;
  padding: 6px 18px;
  font-size: 11px;
  font-weight: 700;
  color: var(--orange-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 22px;
}
.eyebrow-dot {
  width: 6px;
  height: 6px;
  background: var(--orange-primary);
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
  color: var(--black);
  letter-spacing: -1.5px;
  line-height: 1.2;
  max-width: 780px;
  margin: 0 auto 32px;
  text-align: center;
}
.mission-hook-text .orange {
  color: var(--orange-primary);
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
  background: var(--orange-gradient);
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
  background: white;
  border-radius: 50px;
  padding: 15px 36px;
  box-shadow: 0 8px 32px rgba(234,88,12,0.1), 0 2px 8px rgba(0,0,0,0.04);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--orange-border);
}
.declaration-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--orange-gradient);
  border-radius: 50px 0 0 50px;
}
.declaration-icon {
  font-size: 20px;
  flex-shrink: 0;
}
.declaration-text {
  font-size: 20px;
  font-weight: 800;
  color: var(--black);
  letter-spacing: -0.3px;
  white-space: nowrap;
}
.declaration-text .accent {
  background: var(--orange-gradient);
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
  border-color: var(--orange-border);
  box-shadow: 0 12px 32px rgba(234,88,12,0.1);
  transform: translateY(-3px);
}
.mission-col-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--orange-gradient);
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
  background: var(--orange-pale);
  border: 1px solid var(--orange-border);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 18px;
  box-shadow: 0 4px 12px rgba(234,88,12,0.1);
  color: var(--orange-primary);
}

.col-card-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--black);
  letter-spacing: -0.4px;
  margin-bottom: 12px;
  line-height: 1.2;
}

.col-card-text {
  font-size: 14px;
  color: var(--gray-text);
  line-height: 1.8;
  font-weight: 400;
}
.col-card-text strong {
  color: var(--black);
  font-weight: 700;
}
.col-card-text .orange-text {
  color: var(--orange-primary);
  font-weight: 700;
}

/* Redesigned from navy to black/gray accent tags */
.col-card-navy-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 16px;
  background: #F5F5F4;
  border: 1px solid #E7E5E4;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 700;
  color: var(--black);
}

.mission-trust-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.06);
  position: relative;
  border: 1px solid #E7E5E4;
}
.mission-trust-strip::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 35%;
  background: linear-gradient(90deg, transparent, rgba(234,88,12,0.03));
  pointer-events: none;
}
.trust-strip-item {
  padding: 32px 28px;
  text-align: center;
  border-right: 1px solid #F5F5F4;
  position: relative;
  z-index: 1;
  transition: background 0.2s;
}
.trust-strip-item:hover {
  background: #FAFAFA;
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
  background: var(--orange-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.trust-strip-underline {
  width: 32px;
  height: 3px;
  background: var(--orange-gradient);
  border-radius: 2px;
  margin: 12px auto;
  opacity: 0.8;
}
.trust-strip-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-text);
  line-height: 1.5;
  max-width: 130px;
  margin: 0 auto;
  letter-spacing: 0.02em;
}
`;

fs.writeFileSync('frontend-web/src/index.css', css + '\n\n' + newCSS);
console.log("Updated index.css with light airy orange/black theme");
