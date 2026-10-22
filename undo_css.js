const fs = require('fs');
let css = fs.readFileSync('frontend-web/src/index.css', 'utf8');

// Remove the light theme
const lightMarker = '/* --- NEW LIGHT ORANGE/BLACK MISSION SECTION REDESIGN --- */';
if (css.includes(lightMarker)) {
  css = css.substring(0, css.indexOf(lightMarker)).trim();
  fs.writeFileSync('frontend-web/src/index.css', css);
}

console.log("Removed light theme CSS.");
