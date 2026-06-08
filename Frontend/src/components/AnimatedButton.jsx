import { motion } from "framer-motion";

// Variants for button animation
const buttonVariants = {
  hover: { scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" },
  tap: { scale: 0.95 },
};

/**
 * AnimatedButton – reusable button with subtle hover and click animations.
 * Props are passed through to the underlying button element.
 */
export default function AnimatedButton({ children, className = "", ...rest }) {
  return (
    <motion.button
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      className={
        `transition-all duration-200 ease-in-out ` +
        className
      }
      {...rest}
    >
      {children}
    </motion.button>
  );
}
