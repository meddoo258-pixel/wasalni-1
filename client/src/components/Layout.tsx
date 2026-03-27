/**
 * Layout Component - Smart Route Futurism Design
 * Wraps all pages with consistent Navbar and Footer
 * Supports RTL (Arabic) and LTR (English) layouts
 */
import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { dir, lang } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col" dir={dir} lang={lang}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
