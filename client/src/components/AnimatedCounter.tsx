import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
}

export function AnimatedCounter({ value, duration = 2 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Convert value to number, handle loading states
  const targetValue = typeof value === 'string' ? 
    (value === '...' ? 0 : parseInt(value) || 0) : 
    value;

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0
  });

  const display = useTransform(spring, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    spring.set(targetValue);
  }, [spring, targetValue]);

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      setDisplayValue(parseInt(latest.replace(/,/g, '')) || 0);
    });
    return unsubscribe;
  }, [display]);

  // Show loading state
  if (typeof value === 'string' && value === '...') {
    return <span className="animate-pulse">...</span>;
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
}
