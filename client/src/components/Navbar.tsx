/**
 * Navbar - Smart Route Futurism Design
 * Full multi-page navigation with 8 pages
 * Supports RTL (Arabic) and LTR (English)
 */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, MapPin, Globe, LayoutDashboard, Car, User, Shield, ChevronDown, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [location] = useLocation();
  const { t, lang, toggleLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/", label: lang === "ar" ? "الرئيسية" : "Home" },
    { href: "/about", label: lang === "ar" ? "من نحن" : "About Us" },
    { href: "/services", label: lang === "ar" ? "الخدمات" : "Services" },
    { href: "/drivers", label: lang === "ar" ? "السائقون" : "Drivers" },
    { href: "/rental", label: lang === "ar" ? "تأجير المركبات" : "Vehicle Rental" },
    { href: "/corporate", label: lang === "ar" ? "الشركات" : "Corporate" },
    { href: "/contact", label: lang === "ar" ? "تواصل معنا" : "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDashboardOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-sky-brand/5 border-b border-sky-brand/10"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-brand to-mint-brand flex items-center justify-center shadow-lg shadow-sky-brand/30 group-hover:shadow-sky-brand/50 transition-shadow">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold font-[Readex_Pro] gradient-text leading-tight">
                  وصلني
                </span>
                <span className="text-[9px] text-muted-foreground tracking-wider font-medium">
                  WASALNI
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav - scrollable on medium screens */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    location === link.href
                      ? "text-sky-brand bg-sky-brand/10"
                      : scrolled
                        ? "text-foreground/70 hover:text-foreground hover:bg-muted"
                        : "text-foreground/70 hover:text-foreground hover:bg-white/30"
                  }`}
                >
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gradient-to-r from-sky-brand to-mint-brand rounded-full"
                    />
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-all duration-300"
              title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
            >
              <Globe className="w-4 h-4" />
              <span>{lang === "ar" ? "EN" : "عربي"}</span>
            </button>

            {/* Notification Bell (only when authenticated) */}
            {isAuthenticated && <NotificationBell />}

            {/* Dashboard Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDashboardOpen(!dashboardOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-all duration-300"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{lang === "ar" ? "لوحة التحكم" : "Dashboard"}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${dashboardOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {dashboardOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-gray-100 w-52 z-50 overflow-hidden"
                  >
                    {isAuthenticated ? (
                      <>
                        <Link href="/passenger">
                          <span onClick={() => setDashboardOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors cursor-pointer">
                            <User className="w-4 h-4 text-sky-500" />
                            {lang === "ar" ? "لوحة الراكب" : "Passenger Dashboard"}
                          </span>
                        </Link>
                        <Link href="/driver">
                          <span onClick={() => setDashboardOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors cursor-pointer">
                            <Car className="w-4 h-4 text-amber-500" />
                            {lang === "ar" ? "لوحة السائق" : "Driver Dashboard"}
                          </span>
                        </Link>
                        {user?.role === "admin" && (
                          <Link href="/admin">
                            <span onClick={() => setDashboardOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors cursor-pointer">
                              <Shield className="w-4 h-4 text-violet-500" />
                              {lang === "ar" ? "لوحة الإدارة" : "Admin Dashboard"}
                            </span>
                          </Link>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => { setDashboardOpen(false); window.location.href = getLoginUrl(); }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full"
                      >
                        <LogIn className="w-4 h-4 text-gray-400" />
                        {lang === "ar" ? "تسجيل الدخول" : "Login"}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login/Signup Button */}
            {!isAuthenticated && (
              <Button
                className="bg-gradient-to-r from-sky-brand to-mint-brand text-white border-0 shadow-lg shadow-sky-brand/25 hover:shadow-sky-brand/40 hover:scale-105 transition-all duration-300 font-medium text-sm px-4"
                onClick={() => { window.location.href = getLoginUrl(); }}
              >
                {lang === "ar" ? "تسجيل الدخول" : "Login / Signup"}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              <Globe className="w-5 h-5" />
            </button>
            {isAuthenticated && <NotificationBell />}
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/97 backdrop-blur-xl border-t border-border overflow-hidden shadow-xl"
          >
            <div className="container py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location === link.href
                        ? "text-sky-brand bg-sky-brand/10 font-semibold"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}

              <div className="pt-2 border-t border-border/50 space-y-1">
                {isAuthenticated ? (
                  <>
                    <Link href="/passenger">
                      <span onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors cursor-pointer">
                        <User className="w-4 h-4 text-sky-500" />
                        {lang === "ar" ? "لوحة الراكب" : "Passenger Dashboard"}
                      </span>
                    </Link>
                    <Link href="/driver">
                      <span onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-colors cursor-pointer">
                        <Car className="w-4 h-4 text-amber-500" />
                        {lang === "ar" ? "لوحة السائق" : "Driver Dashboard"}
                      </span>
                    </Link>
                    {user?.role === "admin" && (
                      <Link href="/admin">
                        <span onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 rounded-lg transition-colors cursor-pointer">
                          <Shield className="w-4 h-4 text-violet-500" />
                          {lang === "ar" ? "لوحة الإدارة" : "Admin Dashboard"}
                        </span>
                      </Link>
                    )}
                  </>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-sky-brand to-mint-brand text-white border-0 shadow-lg gap-2"
                    onClick={() => { setIsOpen(false); window.location.href = getLoginUrl(); }}
                  >
                    <LogIn className="w-4 h-4" />
                    {lang === "ar" ? "تسجيل الدخول / إنشاء حساب" : "Login / Signup"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
