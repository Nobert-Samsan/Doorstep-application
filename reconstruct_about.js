const { execSync } = require('child_process');

// Revert to Git HEAD first
console.log('Restoring from Git...');
execSync('git checkout src/pages/public/About.jsx', { cwd: 'frontend-web' });

const scripts = [
  'fix_about_hero_font.js',
  'redesign_about_hero.js',
  'fix_about_hero.js',
  'remove_elements.js',
  'fix_jsx.js',
  'fix_gradient.js',
  'update_about_fonts.js',
  'update_about_weights.js',
  'remove_floating_card.js',
  'fix_jsx_2.js',
  'redesign_our_story.js',
  'update_buttons.js',
  'update_bg_white.js',
  'update_quote_card_bg.js',
  'remove_checklist.js',
  'redesign_mission.js',
  'update_mission_bg.js',
  'remove_stat_card.js',
  'fix_jsx_3.js',
  'remove_cta_underline.js',
  'remove_about_underline.js'
];

for (const script of scripts) {
  console.log(`\n=== Running ${script} ===`);
  try {
    const out = execSync(`node ${script}`);
    console.log(out.toString());
  } catch (e) {
    console.log(`Error running ${script}:`, e.message);
  }
}
