import { ALL_SERVICES } from '../constants/allServices';

// Extract clean flat list of all individual job items across all categories
export const ALL_JOBS = (() => {
  const jobList = [];
  const seen = new Set();

  ALL_SERVICES.forEach(cat => {
    // Clean category name without leading emoji
    const cleanCategory = cat.category.replace(/^[^\w\s]+/, '').trim();

    cat.jobs.forEach(rawJob => {
      // e.g. "Plumbing (pipe repairs, leaks, tap fitting, drain cleaning, water pump)"
      const match = rawJob.match(/^(.*?)\s*\((.*?)\)$/);
      let title = rawJob.trim();
      let details = '';

      if (match) {
        title = match[1].trim();
        details = match[2].trim();
      }

      const key = title.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        jobList.push({
          fullText: rawJob,
          title,
          details,
          category: cleanCategory,
          rawCategory: cat.category
        });
      }
    });
  });

  return jobList;
})();

/**
 * Filter jobs according to user typed letters.
 * Strictly prioritizes:
 * 1. Title starts with query (e.g. "p" -> "Plumbing", "Painting & Decorating", etc.)
 * 2. Any individual word in the title starts with query (e.g. "Home Painting" for "p")
 * 3. Details/keywords starting with query
 */
export const filterJobsByPrefix = (query, limit = 8) => {
  if (!query) return [];
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];

  const titlePrefix = [];
  const wordPrefix = [];
  const detailsPrefix = [];

  ALL_JOBS.forEach(job => {
    const titleLower = job.title.toLowerCase();
    
    // Check 1: Title starts directly with query
    if (titleLower.startsWith(q)) {
      titlePrefix.push(job);
      return;
    }

    // Check 2: Word inside title starts with query
    const words = titleLower.split(/[\s/&,-]+/);
    if (words.some(w => w.startsWith(q))) {
      wordPrefix.push(job);
      return;
    }

    // Check 3: Details have a word starting with query
    if (job.details) {
      const detailWords = job.details.toLowerCase().split(/[\s/&,-]+/);
      if (detailWords.some(w => w.startsWith(q))) {
        detailsPrefix.push(job);
      }
    }
  });

  // Sort each group alphabetically
  titlePrefix.sort((a, b) => a.title.localeCompare(b.title));
  wordPrefix.sort((a, b) => a.title.localeCompare(b.title));
  detailsPrefix.sort((a, b) => a.title.localeCompare(b.title));

  return [...titlePrefix, ...wordPrefix, ...detailsPrefix].slice(0, limit);
};
