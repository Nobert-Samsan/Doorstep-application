const fs = require('fs');

const mediaQueries = `
/* =========================================================
   RESPONSIVE DESIGN (MOBILE & TABLET)
   ========================================================= */

@media (max-width: 992px) {
  /* Our Story Section */
  .our-story-inner {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  
  /* Mission Section */
  .mission-hook-text {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  /* Our Story Section */
  .our-story-section {
    padding: 60px 24px;
  }
  .story-headline {
    font-size: 34px;
  }
  .story-image-wrap {
    aspect-ratio: auto;
  }
  .story-stat-card-1 {
    top: -10px;
    left: -10px;
    padding: 12px 16px;
    min-width: auto;
  }
  .stat-card-value {
    font-size: 22px;
  }
  .story-stat-card-2 {
    bottom: 10px;
    right: -10px;
    padding: 12px 16px;
    min-width: auto;
  }
  .stat-card-2-value {
    font-size: 22px;
  }
  
  /* Mission Section */
  .mission-section {
    padding: 60px 24px;
  }
  .mission-hook-text {
    font-size: 28px;
  }
  .declaration-card {
    padding: 12px 20px;
    border-radius: 30px;
  }
  .declaration-text {
    font-size: 16px;
    white-space: normal;
  }
  .mission-columns {
    grid-template-columns: 1fr;
  }
  .mission-trust-strip {
    grid-template-columns: 1fr;
  }
  .trust-strip-item {
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding: 24px;
  }
  .trust-strip-item:last-child {
    border-bottom: none;
  }
}

@media (max-width: 480px) {
  /* Our Story Section */
  .story-headline {
    font-size: 28px;
  }
  .story-stat-card-1 {
    top: 10px;
    left: 10px;
  }
  .story-stat-card-2 {
    bottom: 10px;
    right: 10px;
  }
  
  /* Mission Section */
  .mission-hook-text {
    font-size: 24px;
  }
  .declaration-card {
    flex-direction: column;
    text-align: center;
    border-radius: 20px;
    gap: 8px;
  }
  .mission-col-card {
    padding: 20px;
  }
}
`;

fs.appendFileSync('frontend-web/src/index.css', mediaQueries);
console.log("Appended responsive media queries successfully!");
