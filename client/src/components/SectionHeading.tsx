/**
 * SectionHeading - Consistent section titles with route-inspired accent
 */
import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      <div className={`flex items-center gap-3 mb-4 ${centered ? "justify-center" : ""}`}>
        <div className="w-8 h-0.5 bg-gradient-to-r from-sky-brand to-mint-brand rounded-full" />
        <div className="w-2 h-2 rounded-full bg-sky-brand animate-pulse-waypoint" />
        <div className="w-8 h-0.5 bg-gradient-to-l from-sky-brand to-mint-brand rounded-full" />
      </div>
      <h2
        className={`text-3xl md:text-4xl font-bold font-[Readex_Pro] mb-4 ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg max-w-2xl leading-relaxed ${
            centered ? "mx-auto" : ""
          } ${light ? "text-white/70" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
