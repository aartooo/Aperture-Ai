// FILE: frontend/components/ArticleGrid.tsx
// (This is a new file. Use this full code.)

"use client"; // This component uses Framer Motion

import { motion } from "framer-motion";
import { Article } from "../lib/types"; // Import our Article type
import { ArticleCard } from "./ArticleCard"; // Import the ArticleCard

// Define the Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface ArticleGridProps {
  articles: Article[]; // It accepts an array of articles
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {articles.map((article) => (
        <motion.div key={article.id} variants={itemVariants}>
          <ArticleCard article={article} />
        </motion.div>
      ))}
    </motion.div>
  );
}