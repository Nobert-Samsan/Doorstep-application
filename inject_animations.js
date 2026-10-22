const fs = require('fs');
let code = fs.readFileSync('frontend-web/src/pages/public/Landing.jsx', 'utf8');

if (!code.includes('const CountUp =')) {
  const components = `
// --- Animations for Landing Page ---
const useIntersectionObserver = (ref, options) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  return isIntersecting;
};

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  React.useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const FadeIn = ({ children, delay = 0 }) => {
  const ref = React.useRef(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: \`opacity 0.6s ease-out \${delay}ms, transform 0.6s ease-out \${delay}ms\`
      }}
    >
      {children}
    </div>
  );
};
// ------------------------------------
`;

  code = code.replace('const Landing = () => {', components + '\nconst Landing = () => {');
}

// Replace the static stats with animated ones
code = code.replace(
  '<div className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] font-bold text-[44px] md:text-[52px] leading-none mb-4 font-poppins tabular-nums">\n                  100%\n                </div>',
  '<div className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] font-bold text-[44px] md:text-[52px] leading-none mb-4 font-poppins tabular-nums">\n                  <CountUp end={100} suffix="%" />\n                </div>'
);

code = code.replace(
  '<div className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] font-bold text-[44px] md:text-[52px] leading-none mb-4 font-poppins tabular-nums">\n                  50+\n                </div>',
  '<div className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F0A] to-[#F94D1A] font-bold text-[44px] md:text-[52px] leading-none mb-4 font-poppins tabular-nums">\n                  <CountUp end={50} suffix="+" />\n                </div>'
);

// Wrap header area
code = code.replace(
  '<div className="flex flex-col items-center text-center mb-16">',
  '<FadeIn delay={100}><div className="flex flex-col items-center text-center mb-16">'
);
code = code.replace(
  '</svg>\n              </span>\n            </h2>\n          </div>',
  '</svg>\n              </span>\n            </h2>\n          </div></FadeIn>'
);

// Wrap cards grid
code = code.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">',
  '<FadeIn delay={200}><div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">'
);
code = code.replace(
  '</div>\n            </div>\n\n          </div>',
  '</div>\n            </div>\n\n          </div></FadeIn>'
);

// Wrap stats bar
code = code.replace(
  '{/* Stats Bar */}\n          <div className="relative bg-[#000000] rounded-[24px] p-8 md:p-10 overflow-hidden shadow-xl">',
  '{/* Stats Bar */}\n          <FadeIn delay={300}><div className="relative bg-[#000000] rounded-[24px] p-8 md:p-10 overflow-hidden shadow-xl">'
);
code = code.replace(
  '</p>\n              </div>\n\n            </div>\n          </div>\n\n        </div>',
  '</p>\n              </div>\n\n            </div>\n          </div></FadeIn>\n\n        </div>'
);


fs.writeFileSync('frontend-web/src/pages/public/Landing.jsx', code);
console.log('Injected animations!');
