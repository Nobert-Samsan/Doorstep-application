const { execSync } = require('child_process');

const scripts = [
  'redesign_about_hero.js',
  'fix_about_hero.js',
  'update_about_fonts.js',
  'update_about_weights.js',
  'redesign_our_story.js',
  'remove_about_underline.js',
  'fix_about_safely.js'
];

for (const script of scripts) {
  console.log(`Running ${script}...`);
  try {
    const out = execSync(`node ${script}`);
    console.log(out.toString());
  } catch (e) {
    console.log(`Error running ${script}:`, e.message);
  }
}
