const fs = require('fs');

let code = fs.readFileSync('frontend-web/src/pages/public/Contact.jsx', 'utf8');

const fadeInCode = `
const useIntersectionObserver = (ref, options) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsIntersecting(true);
    }, options);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  return isIntersecting;
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
`;

code = code.replace("import FadeIn from '../../components/animations/FadeIn';", fadeInCode);

fs.writeFileSync('frontend-web/src/pages/public/Contact.jsx', code);
console.log('Added FadeIn code');
