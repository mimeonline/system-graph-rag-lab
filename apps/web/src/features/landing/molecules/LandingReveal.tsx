"use client";

import { motion, useReducedMotion } from "framer-motion";

type LandingRevealProps = {
  children: React.ReactNode;
  className?: string;
};

export function LandingReveal({ children, className }: LandingRevealProps): React.JSX.Element {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
