import { useEffect, useRef, useState, ReactNode, CSSProperties } from "react";

export const Reveal = ({ children, delay = 0, style = {} }: { children: ReactNode; delay?: number; style?: CSSProperties }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
