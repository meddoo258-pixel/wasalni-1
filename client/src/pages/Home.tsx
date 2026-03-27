/**
 * Home Page - Smart Route Futurism Design
 * Bilingual (AR/EN) with: employees, students, teachers, female drivers, airport service
 * Payment: Mada, Apple Pay, Tabby, Tamara
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";
import {
  MapPin,
  Route,
  Shield,
  Clock,
  Users,
  Building2,
  GraduationCap,
  Car,
  Bell,
  CreditCard,
  Smartphone,
  UserCheck,
  Navigation,
  CalendarCheck,
  ArrowLeft,
  ArrowRight,
  Plane,
  Wallet,
  CheckCircle,
  Store,
  Truck,
  Settings,
  Bus,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedCounter from "@/components/AnimatedCounter";
import SectionHeading from "@/components/SectionHeading";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { useOpenGraph } from "@/_core/hooks/useOpenGraph";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/hero-bg-iurdvN3JiN4tfwU5PHFivW.webp";
const ROUTES_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/smart-routes-DfSYqouJ3aiyDSU2QhPTDk.webp";
const SAFETY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/safety-feature-LmfQGAJxgD4QfRvqJHZtVv.webp";
const CORPORATE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/corporate-service-knTbV53ErucZzvRxQhtg64.webp";
const STUDENT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/student-transport-58CwfLs6voDSevQQk4crZr.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

export default function Home() {
  const { t, lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const ArrowIcon = lang === "ar" ? ArrowLeft : ArrowRight;

  useOpenGraph({
    title: "وصلني | نقل ذكي بالاشتراك الشهري",
    description: "منصة نقل ذكية متكاملة مع الاشتراك الشهري للموظفات والطالبات والمعلمات والشركات",
    url: typeof window !== "undefined" ? window.location.href : "",
    image: HERO_IMG,
    type: "website",
    siteName: "وصلني - Wasalni",
    locale: "ar_SA",
  });

  const handleCTA = () => {
    window.location.href = "/subscribe";
  };

  const handleDriverCTA = () => {
    window.location.href = "/drivers";
  };

  // SEO: Update document title and meta tags dynamically based on language
  useEffect(() => {
    if (lang === "ar") {
      document.title = "وصلني | نقل ذكي بالاشتراك الشهري في السعودية";
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', 'وصلني منصة نقل ذكي بالاشتراك الشهري في السعودية. توصيل موظفين ونقل طالبات ومعلمات بمسارات محسّنة. خدمات نقل مؤسسي واستقبال المطار وتأجير مركبات.');
      // Update meta keywords
      const metaKw = document.querySelector('meta[name="keywords"]');
      if (metaKw) metaKw.setAttribute('content', 'وصلني, نقل ذكي, اشتراك شهري, توصيل موظفين, نقل طالبات, تأجير مركبات, نقل مؤسسي, السعودية');
    } else {
      document.title = "Wasalni | Smart Monthly Transport in Saudi Arabia";
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', 'Wasalni - Smart transport platform with monthly subscription in Saudi Arabia. Employee transport, student transport, corporate mobility, airport pickup, and vehicle rental services.');
      // Update meta keywords
      const metaKw = document.querySelector('meta[name="keywords"]');
      if (metaKw) metaKw.setAttribute('content', 'Wasalni, smart transport, monthly subscription, employee transport, student transport, vehicle rental, corporate transport, Saudi Arabia');
    }
  }, [lang]);
  const ChevronIcon = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="وصلني - منصة النقل الذكي بالاشتراك الشهري في السعودية" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 ${lang === "ar" ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-white/95 via-white/80 to-white/40`} />
        </div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 1200 800" fill="none">
          <path d="M-50 400 Q200 200 400 400 T800 300 T1250 400" stroke="url(#routeGrad)" strokeWidth="3" strokeDasharray="1000" className="animate-draw-path" />
          <circle cx="400" cy="400" r="6" fill="#0EA5E9" className="animate-pulse-waypoint" />
          <circle cx="800" cy="300" r="6" fill="#10B981" className="animate-pulse-waypoint" style={{ animationDelay: "0.5s" }} />
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>

        <div className="container relative z-10 pt-24">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-brand/10 border border-sky-brand/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-mint-brand animate-pulse" />
                <span className="text-sm font-medium text-sky-brand">{t("hero.badge")}</span>
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="text-4xl md:text-5xl lg:text-6xl font-bold font-[Readex_Pro] leading-tight mb-6 text-foreground">
              {t("hero.title1")}{" "}
              <span className="gradient-text">{t("hero.title2")}</span>
              <br />
              {t("hero.title3")}{" "}
              <span className="gradient-text">{t("hero.title4")}</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              {t("hero.desc")}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }} className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-sky-brand to-mint-brand text-white border-0 shadow-xl shadow-sky-brand/25 hover:shadow-sky-brand/40 hover:scale-105 transition-all duration-300 text-base px-8 gap-2"
                onClick={handleCTA}
              >
                {isAuthenticated ? (lang === "ar" ? "لوحة التحكم" : "Dashboard") : (lang === "ar" ? "ابدأ الآن مجاناً" : "Get Started Free")}
                <ArrowIcon className="w-4 h-4" />
              </Button>
              <Link href="/services">
                <Button size="lg" variant="outline" className="border-sky-brand/30 text-sky-brand hover:bg-sky-brand/5 text-base px-8 gap-2">
                  {t("hero.services")}
                  <ChevronIcon className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="flex gap-8 mt-12 pt-8 border-t border-border/50">
              {[
                { value: 5000, suffix: "+", label: t("hero.stat1") },
                { value: 150, suffix: "+", label: t("hero.stat2") },
                { value: 98, suffix: "%", label: t("hero.stat3") },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold font-[Readex_Pro] gradient-text">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES OVERVIEW ===== */}
      <section className="py-24 bg-background relative">
        <div className="container">
          <SectionHeading title={t("services.title")} subtitle={t("services.subtitle")} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Store, title: t("services.marketplace.title"), desc: t("services.marketplace.desc"), color: "from-sky-500 to-blue-600", shadow: "shadow-sky-500/20", href: "/services" },
              { icon: Truck, title: t("services.rental.title"), desc: t("services.rental.desc"), color: "from-teal-500 to-cyan-600", shadow: "shadow-teal-500/20", href: "/rental" },
              { icon: Users, title: t("services.employees.title"), desc: t("services.employees.desc"), color: "from-indigo-500 to-blue-600", shadow: "shadow-indigo-500/20", href: "/services" },
              { icon: GraduationCap, title: t("services.students.title"), desc: t("services.students.desc"), color: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/20", href: "/services" },
              { icon: Building2, title: t("services.corporate.title"), desc: t("services.corporate.desc"), color: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/20", href: "/corporate" },
              { icon: Car, title: t("services.driver.title"), desc: t("services.driver.desc"), color: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/20", href: "/drivers" },
              { icon: Plane, title: t("services.airport.title"), desc: t("services.airport.desc"), color: "from-rose-500 to-pink-600", shadow: "shadow-rose-500/20", href: "/services" },
            ].map((service, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
                <Link href={service.href}>
                  <Card className="group h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white overflow-hidden cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} ${service.shadow} shadow-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold font-[Readex_Pro] mb-3 text-foreground">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                      <div className="mt-4 flex items-center gap-1 text-sky-brand text-sm font-medium">
                        <span>{lang === "ar" ? "اعرف المزيد" : "Learn more"}</span>
                        <ArrowIcon className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 bg-gradient-to-b from-secondary/50 to-background relative">
        <div className="container">
          <SectionHeading title={t("how.title")} subtitle={t("how.subtitle")} />

          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-1/2 right-0 left-0 h-0.5 bg-gradient-to-l from-sky-brand via-mint-brand to-sky-brand opacity-20 -translate-y-1/2" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Smartphone, title: t("how.step1.title"), desc: t("how.step1.desc"), color: "from-sky-500 to-blue-500" },
                { icon: MapPin, title: t("how.step2.title"), desc: t("how.step2.desc"), color: "from-emerald-500 to-teal-500" },
                { icon: CalendarCheck, title: t("how.step3.title"), desc: t("how.step3.desc"), color: "from-violet-500 to-purple-500" },
                { icon: Navigation, title: t("how.step4.title"), desc: t("how.step4.desc"), color: "from-amber-500 to-orange-500" },
              ].map((step, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-xl mx-auto flex items-center justify-center mb-5 relative z-10`}>
                    <step.icon className="w-8 h-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold text-sky-brand">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-base font-bold font-[Readex_Pro] mb-2 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SMART ROUTES ===== */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: lang === "ar" ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={ROUTES_IMG} alt={t("routes.title")} className="w-full h-[400px] object-cover" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: lang === "ar" ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-brand/10 border border-sky-brand/20 mb-6">
                <Route className="w-4 h-4 text-sky-brand" />
                <span className="text-sm font-medium text-sky-brand">{t("routes.optimize")}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] mb-6 text-foreground leading-tight">
                {t("routes.title")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{t("routes.desc")}</p>

              <div className="space-y-4">
                {[t("routes.feature1"), t("routes.feature2"), t("routes.feature3"), t("routes.feature4")].map((feature, i) => (
                  <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-brand to-mint-brand flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <div className="px-5 py-3 rounded-xl bg-sky-brand/10 border border-sky-brand/20">
                  <div className="text-2xl font-bold font-[Readex_Pro] gradient-text">40%</div>
                  <div className="text-xs text-muted-foreground">{t("routes.saving")}</div>
                </div>
                <div className="px-5 py-3 rounded-xl bg-mint-brand/10 border border-mint-brand/20">
                  <div className="text-2xl font-bold font-[Readex_Pro] gradient-text">AI</div>
                  <div className="text-xs text-muted-foreground">{t("routes.optimize")}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CORPORATE & STUDENT SECTIONS ===== */}
      <section className="py-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container">
          {/* Corporate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div initial={{ opacity: 0, x: lang === "ar" ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <Building2 className="w-4 h-4 text-violet-500" />
                <span className="text-sm font-medium text-violet-500">{t("corporate.badge")}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] mb-6 text-foreground leading-tight">{t("corporate.title")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{t("corporate.desc")}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Users, label: t("corporate.f1") },
                  { icon: Navigation, label: t("corporate.f2") },
                  { icon: CreditCard, label: t("corporate.f3") },
                  { icon: Route, label: t("corporate.f4") },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-border/50">
                    <f.icon className="w-5 h-5 text-violet-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{f.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/corporate">
                <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-lg hover:scale-105 transition-all gap-2">
                  {lang === "ar" ? "طلب عرض سعر" : "Request a Quote"}
                  <ArrowIcon className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: lang === "ar" ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={CORPORATE_IMG} alt={t("corporate.title")} className="w-full h-[400px] object-cover" />
              </div>
            </motion.div>
          </div>

          {/* Student & Teacher */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: lang === "ar" ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={STUDENT_IMG} alt={t("student.title")} className="w-full h-[400px] object-cover" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: lang === "ar" ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-500">{t("services.students.title")}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] mb-6 text-foreground leading-tight">{t("student.title")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{t("student.desc")}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Navigation, label: t("student.f1") },
                  { icon: Bell, label: t("student.f2") },
                  { icon: UserCheck, label: t("student.f3") },
                  { icon: Clock, label: t("student.f4") },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-border/50">
                    <f.icon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{f.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/services">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:scale-105 transition-all gap-2">
                  {lang === "ar" ? "اشتركي في خدمة الطالبات" : "Subscribe for Students"}
                  <ArrowIcon className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SAFETY SECTION ===== */}
      <section className="py-24 bg-navy-brand relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
            <path d="M0 300 Q300 100 600 300 T1200 300" stroke="white" strokeWidth="2" />
            <path d="M0 350 Q300 150 600 350 T1200 350" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: lang === "ar" ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={SAFETY_IMG} alt={t("safety.title")} className="w-full h-[400px] object-cover" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: lang === "ar" ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
                <Shield className="w-4 h-4 text-sky-brand" />
                <span className="text-sm font-medium text-sky-brand">{t("safety.badge")}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] mb-6 text-white leading-tight">
                {t("safety.title")}
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">{t("safety.desc")}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: UserCheck, title: t("safety.f1.title"), desc: t("safety.f1.desc") },
                  { icon: Navigation, title: t("safety.f2.title"), desc: t("safety.f2.desc") },
                  { icon: Bell, title: t("safety.f3.title"), desc: t("safety.f3.desc") },
                  { icon: Shield, title: t("safety.f4.title"), desc: t("safety.f4.desc") },
                ].map((item, i) => (
                  <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card !bg-white/5 !border-white/10 rounded-xl p-4">
                    <item.icon className="w-6 h-6 text-sky-brand mb-3" />
                    <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-white/60">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== PLATFORM MODEL ===== */}
      <section className="py-24 bg-gradient-to-b from-navy-brand to-[#0c1a2e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
            <path d="M0 300 Q300 100 600 300 T1200 300" stroke="white" strokeWidth="2" />
            <path d="M0 350 Q300 150 600 350 T1200 350" stroke="white" strokeWidth="1" />
          </svg>
        </div>
        <div className="container relative z-10">
          <SectionHeading title={t("platform.title")} subtitle={t("platform.subtitle")} light />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {[
              { icon: Store, title: t("platform.marketplace.title"), desc: t("platform.marketplace.desc"), color: "from-sky-400 to-blue-500" },
              { icon: Truck, title: t("platform.rental.title"), desc: t("platform.rental.desc"), color: "from-amber-400 to-orange-500" },
              { icon: Settings, title: t("platform.operations.title"), desc: t("platform.operations.desc"), color: "from-emerald-400 to-teal-500" },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="relative h-full p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg mx-auto flex items-center justify-center mb-6`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold font-[Readex_Pro] mb-3 text-white">{item.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-brand/20 to-mint-brand/20 border border-white/10">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium text-white/90">{t("platform.advantage")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FLEET SECTION ===== */}
      <section className="py-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container">
          <SectionHeading title={t("fleet.title")} subtitle={t("fleet.subtitle")} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: t("fleet.sedan"), desc: t("fleet.sedan.desc"), capacity: t("fleet.sedan.capacity"), icon: Car, color: "from-sky-500 to-blue-600" },
              { name: t("fleet.h1"), desc: t("fleet.h1.desc"), capacity: t("fleet.h1.capacity"), icon: Car, color: "from-emerald-500 to-teal-600" },
              { name: t("fleet.hiace"), desc: t("fleet.hiace.desc"), capacity: t("fleet.hiace.capacity"), icon: Bus, color: "from-violet-500 to-purple-600" },
              { name: t("fleet.coaster"), desc: t("fleet.coaster.desc"), capacity: t("fleet.coaster.capacity"), icon: Bus, color: "from-amber-500 to-orange-600" },
            ].map((vehicle, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white text-center">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${vehicle.color} shadow-lg mx-auto flex items-center justify-center mb-4`}>
                      <vehicle.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-base font-bold font-[Readex_Pro] mb-2 text-foreground">{vehicle.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{vehicle.desc}</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-brand/10 text-sky-brand text-xs font-medium">
                      <Users className="w-3 h-3" />
                      {vehicle.capacity}
                    </div>
                    <div className="flex gap-2 justify-center mt-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{t("fleet.rental")}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">{t("fleet.operational")}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DRIVER SECTION ===== */}
      <section className="py-24 bg-background">
        <div className="container">
          <SectionHeading title={t("driver.title")} subtitle={t("driver.subtitle")} />

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Car, title: t("driver.step1.title"), desc: t("driver.step1.desc"), color: "from-amber-500 to-orange-500" },
                { icon: Truck, title: t("driver.step2.title"), desc: t("driver.step2.desc"), color: "from-sky-500 to-blue-500" },
                { icon: Building2, title: t("driver.step3.title"), desc: t("driver.step3.desc"), color: "from-emerald-500 to-teal-500" },
              ].map((item, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white text-center">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg mx-auto flex items-center justify-center mb-6`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold font-[Readex_Pro] mb-3 text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-6">
              <p className="text-sm text-muted-foreground mb-6 px-4 py-3 rounded-xl bg-secondary/60 border border-border inline-block">
                {t("payment.note")}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 text-base px-8 gap-2"
                onClick={handleDriverCTA}
              >
                {t("driver.cta")}
                <ArrowIcon className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== PAYMENT METHODS ===== */}
      <section className="py-16 bg-background">
        <div className="container">
          <SectionHeading title={t("payment.title")} subtitle={t("payment.subtitle")} />
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {[
              { name: t("payment.mada"), icon: CreditCard, color: "from-blue-500 to-blue-700" },
              { name: t("payment.apple"), icon: Wallet, color: "from-gray-800 to-gray-900" },
              { name: t("payment.tabby"), icon: CreditCard, color: "from-teal-500 to-teal-700" },
              { name: t("payment.tamara"), icon: CreditCard, color: "from-pink-500 to-pink-700" },
            ].map((method, i) => (
              <motion.div key={method.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white shadow-md border border-border/50 hover:shadow-lg transition-shadow">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                    <method.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-foreground">{method.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-xs text-muted-foreground mt-6">
            {t("payment.note")}
          </motion.p>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-20 bg-gradient-to-r from-sky-brand to-mint-brand relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none">
            <path d="M0 150 Q300 50 600 150 T1200 150" stroke="white" strokeWidth="3" />
          </svg>
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 5000, suffix: "+", label: t("stats.users"), icon: Users },
              { value: 150, suffix: "+", label: t("stats.routes"), icon: Route },
              { value: 300, suffix: "+", label: t("stats.drivers"), icon: Car },
              { value: 50, suffix: "+", label: t("stats.companies"), icon: Building2 },
            ].map((stat, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <stat.icon className="w-8 h-8 text-white/80 mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold font-[Readex_Pro] text-white mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBSCRIPTION CTA SECTION ===== */}
      <section className="py-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Transport */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-xl">
                <Users className="w-12 h-12 mb-4 opacity-90" />
                <h3 className="text-2xl font-bold font-[Readex_Pro] mb-3">
                  {lang === "ar" ? "توصيل الموظفين بالاشتراك الشهري" : "Monthly Employee Transport"}
                </h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  {lang === "ar" ? "خدمة نقل موظفين منتظمة بمسارات ذكية وجداول ثابتة للشركات والمنشآت" : "Organized employee transport with smart routes and fixed schedules for companies"}
                </p>
                <Link href="/services">
                  <Button className="bg-white text-indigo-600 hover:bg-white/90 font-bold gap-2">
                    {lang === "ar" ? "اشترك الآن" : "Subscribe Now"}
                    <ArrowIcon className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>

              {/* Student Transport */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
                <GraduationCap className="w-12 h-12 mb-4 opacity-90" />
                <h3 className="text-2xl font-bold font-[Readex_Pro] mb-3">
                  {lang === "ar" ? "نقل الطالبات بالاشتراك الشهري" : "Monthly Student Transport"}
                </h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  {lang === "ar" ? "خدمة نقل آمنة وموثوقة للطالبات والمعلمات مع تتبع مباشر للأهالي" : "Safe and reliable transport for female students and teachers with live tracking for parents"}
                </p>
                <Link href="/services">
                  <Button className="bg-white text-emerald-600 hover:bg-white/90 font-bold gap-2">
                    {lang === "ar" ? "اشتركي الآن" : "Subscribe Now"}
                    <ArrowIcon className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 bg-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-brand/10 border border-sky-brand/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-mint-brand animate-pulse" />
              <span className="text-sm font-medium text-sky-brand">{t("cta.badge")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] mb-6 text-foreground">
              {t("cta.title")}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">{t("cta.desc")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-sky-brand to-mint-brand text-white border-0 shadow-xl shadow-sky-brand/25 hover:shadow-sky-brand/40 hover:scale-105 transition-all duration-300 text-base px-10 gap-2"
                onClick={handleCTA}
              >
                {isAuthenticated ? (lang === "ar" ? "لوحة التحكم" : "Dashboard") : (lang === "ar" ? "سجّل الآن مجاناً" : "Sign Up Free")}
                <Smartphone className="w-5 h-5" />
              </Button>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-sky-brand/30 text-sky-brand hover:bg-sky-brand/5 text-base px-10">
                  {t("cta.contact")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
