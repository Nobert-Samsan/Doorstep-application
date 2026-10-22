const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/HowItWorks.jsx', 'utf8');

// 1. Remove the timeline lines
code = code.replace(
  '{/* Timeline lines */}\n          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0 border-l border-dashed border-[#FF7A00]/35 -translate-x-1/2 z-0"></div>\n          <div className="block lg:hidden absolute left-[32px] md:left-[40px] top-0 bottom-0 w-0 border-l border-dashed border-[#FF7A00]/35 z-0"></div>',
  ''
);

// 2. Find the start of the map loop and replace the whole step body up to Text Content
const mapStart = code.indexOf('customerSteps : workerSteps).map((step, idx) => {');
const textContentStart = code.indexOf('{/* Text Content */}');

if (mapStart !== -1 && textContentStart !== -1) {
  const newStepTop = `customerSteps : workerSteps).map((step, idx) => {
            const isLeft = idx % 2 === 0;
            const StepIcon = step.icon;
            
            return (
              <div key={idx} className={\`relative w-full \${idx % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#FFF8F1]'} py-14 lg:py-20 overflow-hidden\`}>
                <FadeIn delay={100}>
                <div className="max-w-[1100px] mx-auto px-6 md:px-8 relative z-10">

                  <div className={\`flex flex-col lg:flex-row items-center gap-12 lg:gap-[100px] xl:gap-[120px] \${!isLeft ? 'lg:flex-row-reverse' : ''}\`}>
                    
                    `;
  code = code.substring(0, mapStart) + newStepTop + code.substring(textContentStart);
}

// 3. Replace the Text Content to include the bubble
const textContentMarker = '{/* Text Content */}';
const h3Start = code.indexOf('<h3 className="text-[28px]', code.indexOf(textContentMarker));

if (h3Start !== -1) {
  const newTextContentTop = `{/* Text Content */}
                    <div className="flex-1 w-full relative">
                      
                      <div className="relative z-10 pt-4">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#FF9F0A] to-[#F94D1A] shadow-[0_0_0_6px_rgba(255,122,0,0.12)] flex flex-shrink-0 items-center justify-center">
                            <span className="text-white font-poppins font-bold text-[20px]">{idx + 1}</span>
                          </div>
                          <div className="text-[#FF7A00] uppercase text-[14px] font-semibold tracking-[0.12em]">
                            STEP {idx + 1}
                          </div>
                        </div>
                        `;
  // We need to cut out the old Step label:
  // <div className="relative z-10 pt-4">
  //   <div className="text-[#FF7A00] uppercase text-[13px] font-semibold tracking-[0.12em] mb-3">
  //     STEP {idx + 1}
  //   </div>
  const oldTextContentStart = code.indexOf('{/* Text Content */}');
  code = code.substring(0, oldTextContentStart) + newTextContentTop + code.substring(h3Start);
}

fs.writeFileSync('frontend-web/src/pages/public/HowItWorks.jsx', code);
console.log('Moved numbers to the top of the text block and removed center timeline');
