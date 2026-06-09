import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};

export default function AnimatedItem({ children, className = "", onClick = null }) {
  return (
    <motion.div
      variants={itemVariants}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
