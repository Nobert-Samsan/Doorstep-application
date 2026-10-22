const { execSync } = require('child_process');

const scripts = [
  'restore_landing_final.js',
  'restore_missing_sections.js',
  'redesign_why_choose.js',
  'fix_icons.js',
  'redesign_hero.js',
  'simplify_hero.js',
  'remove_animations.js',
  'remove_floating.js',
  'fix_mask.js',
  'move_line.js',
  'update_hero_img.js',
  'update_object_pos.js',
  'increase_height.js',
  'replace_mission.js',
  'inject_animations.js',
  'decrease_spacing.js',
  'decrease_spacing_more.js',
  'adjust_spacing.js',
  'reduce_stats_height.js',
  'remove_nic.js',
  'align_stats.js',
  'align_western.js',
  
  // Scripts from today
  'remove_landing_underline.js',
  'remove_landing_dot.js',
  'remove_glow.js'
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
