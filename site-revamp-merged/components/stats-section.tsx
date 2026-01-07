"use client";

import { useEffect, useState, useRef } from "react";
import { Box, Layers, Palette, Percent } from "lucide-react";

const stats = [
  {
    icon: Box,
    value: 200,
    suffix: "+",
    label: "Components",
    description: "Ready to use",
  },
  {
    icon: Layers,
    value: 95,
    suffix: "+",
    label: "Hooks",
    description: "Full control",
  },
  {
    icon: Palette,
    value: 15,
    suffix: "",
    label: "Themes",
    description: "Instant style",
  },
  {
    icon: Percent,
    value: 90,
    suffix: "%",
    label: "Cost Savings",
    description: "On AI inference",
  },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 sm:py-20 border-y border-border bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center space-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted mb-2 holographic-icon">
                <stat.icon className="w-6 h-6 text-[oklch(0.6_0.15_280)]" />
              </div>
              <div className="text-4xl sm:text-5xl font-bold gradient-text">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-lg font-semibold">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
