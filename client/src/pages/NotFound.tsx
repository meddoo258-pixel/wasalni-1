/**
 * 404 Not Found Page - Bilingual
 */
import { motion } from "framer-motion";
import { MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { lang } = useLanguage();
  const ArrowIcon = lang === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/60 to-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center px-4"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand mx-auto flex items-center justify-center mb-8 shadow-xl">
          <MapPin className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-7xl font-bold font-[Readex_Pro] gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold font-[Readex_Pro] text-foreground mb-4">
          {lang === "ar" ? "الصفحة غير موجودة" : "Page Not Found"}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {lang === "ar"
            ? "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة للصفحة الرئيسية."
            : "Sorry, the page you're looking for doesn't exist or has been moved. You can return to the homepage."}
        </p>
        <Link href="/">
          <Button
            size="lg"
            className="bg-gradient-to-r from-sky-brand to-mint-brand text-white border-0 shadow-lg hover:scale-105 transition-all duration-300 gap-2"
          >
            <ArrowIcon className="w-4 h-4" />
            {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
