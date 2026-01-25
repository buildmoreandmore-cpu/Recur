import React, { useState, useEffect, useRef } from 'react';

const stats = [
  { value: 500, suffix: "+", label: "Service Professionals" },
  { value: 2, prefix: "$", suffix: "M+", label: "Revenue Forecasted" },
  { value: 10, suffix: "K+", label: "No-Shows Prevented" }
];

interface CounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  isVisible: boolean;
}

const Counter: React.FC<CounterProps> = ({ target, prefix = '', suffix = '', duration = 2000, isVisible }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    hasAnimated.current = true;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return (
    <span className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
};

export const StatsCounter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-20 px-4 sm:px-6 bg-maroon">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`scroll-reveal delay-${index + 1}`}
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white mb-2">
                <Counter
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </div>
              <div className="text-sm sm:text-base text-white/70 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
