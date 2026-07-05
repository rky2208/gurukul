export const dotVariants = {
  animate: (i: number) => ({
    y: [0, -5, 0],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 0.9,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.15,
    },
  }),
};
