import React from "react";
import { motion } from "framer-motion";

function AnimationWrapper({
  children,
  initial = { opacity: 0, y: 50 },
  animate = { opacity: 1, y: 0 },
  exit = { opacity: 0, y: -50 },
  transition = { duration: 0.5, ease: "easeInOut" },
}) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      style={{ overflow: "hidden" }} // Prevents flickering during animations
    >
      {children}
    </motion.div>
  );
}

export default AnimationWrapper;
