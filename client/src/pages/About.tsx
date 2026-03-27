/**
 * About Page - Smart Route Futurism Design
 * Bilingual: Story, Mission, Vision, Values, Stats, Expansion
 */
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Lightbulb,
  MapPin,
  Users,
  Shield,
  Leaf,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Route,
  Car,
  Building2,
  Store,
  Truck,
  Settings,
  TrendingUp,
  DollarSign,
  FileText,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeading from "@/components/SectionHeading";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

const ROUTES_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/smart-routes-DfSYqouJ3aiyDSU2QhPTDk.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

export default function About() {
  const { t, lang } = useLanguage();
  const ArrowIcon = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-secondary/60 to-background relative">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 400" fill="none">
            <path d="M0 200 Q300 100 600 200 T1200 200" stroke="#0EA5E9" strokeWidth="2" />
          </svg>
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-brand/10 border border-sky-brand/20 mb-6">
              <BookOpen className="w-4 h-4 text-sky-brand" />
              <span className="text-sm font-medium text-sky-brand">{t("about.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-[Readex_Pro] mb-6 text-foreground">
              <span className="gradient-text">{t("about.title")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("about.desc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: lang === "ar" ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h2 className="text-3xl font-bold font-[Readex_Pro] mb-6 text-foreground">
                {t("about.story.title")}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t("about.story.p1")}</p>
                <p>{t("about.story.p2")}</p>
                <p>{t("about.story.p3")}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: lang === "ar" ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-sky-brand/10">
                <img src={ROUTES_IMG} alt={t("about.story.title")} className="w-full h-[400px] object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold font-[Readex_Pro] mb-4 text-foreground">{t("about.mission.title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("about.mission.desc")}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg flex items-center justify-center mb-6">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold font-[Readex_Pro] mb-4 text-foreground">{t("about.vision.title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("about.vision.desc")}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-background">
        <div className="container">
          <SectionHeading
            title={lang === "ar" ? "قيمنا" : "Our Values"}
            subtitle={lang === "ar" ? "المبادئ التي تقود كل قرار نتخذه" : "The principles that guide every decision we make"}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: lang === "ar" ? "السلامة أولاً" : "Safety First", desc: lang === "ar" ? "نضع سلامة الركاب والسائقين في صدارة أولوياتنا" : "Passenger and driver safety is our top priority", color: "from-sky-500 to-blue-600" },
              { icon: Lightbulb, title: lang === "ar" ? "الابتكار" : "Innovation", desc: lang === "ar" ? "نستخدم أحدث التقنيات لتحسين تجربة النقل" : "We use the latest technology to improve transport", color: "from-amber-500 to-orange-600" },
              { icon: Heart, title: lang === "ar" ? "المجتمع" : "Community", desc: lang === "ar" ? "نبني مجتمعاً من الثقة بين الركاب والسائقين" : "We build a community of trust between riders and drivers", color: "from-rose-500 to-pink-600" },
              { icon: Leaf, title: lang === "ar" ? "الاستدامة" : "Sustainability", desc: lang === "ar" ? "نساهم في تقليل الازدحام والانبعاثات الكربونية" : "We help reduce congestion and carbon emissions", color: "from-emerald-500 to-teal-600" },
            ].map((value, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white text-center">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} shadow-lg mx-auto flex items-center justify-center mb-5`}>
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-base font-bold font-[Readex_Pro] mb-3 text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Business Model */}
      <section className="py-24 bg-navy-brand relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 600" fill="none">
            <path d="M0 300 Q300 100 600 300 T1200 300" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        <div className="container relative z-10">
          <SectionHeading
            title={t("business.title")}
            subtitle={lang === "ar" ? "نموذج أعمال متنوع يضمن استدامة المنصة ونموها" : "A diversified business model ensuring platform sustainability and growth"}
            light
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            {[
              { icon: TrendingUp, title: t("business.commission"), desc: lang === "ar" ? "عمولة على كل رحلة يتم تنفيذها" : "Commission on every completed trip", color: "from-sky-400 to-blue-500" },
              { icon: Truck, title: t("business.rental"), desc: lang === "ar" ? "دخل من تأجير المركبات للسائقين" : "Revenue from vehicle rental to drivers", color: "from-amber-400 to-orange-500" },
              { icon: FileText, title: t("business.contracts"), desc: lang === "ar" ? "عقود نقل مع الشركات والمؤسسات" : "Transport contracts with companies", color: "from-emerald-400 to-teal-500" },
              { icon: DollarSign, title: t("business.subscriptions"), desc: lang === "ar" ? "رسوم اشتراكات شهرية من العملاء" : "Monthly subscription fees from clients", color: "from-violet-400 to-purple-500" },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="h-full p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg mx-auto flex items-center justify-center mb-4`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base font-bold font-[Readex_Pro] text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-white/60">{item.desc}</p>
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

      {/* Expansion Plan */}
      <section className="py-24 bg-background">
        <div className="container">
          <SectionHeading
            title={lang === "ar" ? "خطة التوسع" : "Expansion Plan"}
            subtitle={lang === "ar" ? "نعمل على توسيع خدماتنا لتغطية المزيد من المدن" : "We're expanding our services to cover more cities"}
          />

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className={`absolute top-0 bottom-0 ${lang === "ar" ? "right-6" : "left-6"} w-0.5 bg-gradient-to-b from-sky-brand via-mint-brand to-sky-brand`} />

              {[
                {
                  phase: lang === "ar" ? "المرحلة الأولى" : "Phase 1",
                  title: lang === "ar" ? "الرياض والدمام" : "Riyadh & Dammam",
                  desc: lang === "ar" ? "إطلاق الخدمة في المدينتين الرئيسيتين مع تغطية شاملة" : "Launch in the two main cities with comprehensive coverage",
                  status: lang === "ar" ? "جاري التنفيذ" : "In Progress",
                  color: "from-sky-500 to-blue-600",
                },
                {
                  phase: lang === "ar" ? "المرحلة الثانية" : "Phase 2",
                  title: lang === "ar" ? "جدة ومكة المكرمة" : "Jeddah & Makkah",
                  desc: lang === "ar" ? "التوسع للمنطقة الغربية وتغطية المدن الكبرى" : "Expansion to the western region covering major cities",
                  status: lang === "ar" ? "قريباً" : "Coming Soon",
                  color: "from-emerald-500 to-teal-600",
                },
                {
                  phase: lang === "ar" ? "المرحلة الثالثة" : "Phase 3",
                  title: lang === "ar" ? "جميع مدن المملكة" : "All Saudi Cities",
                  desc: lang === "ar" ? "تغطية شاملة لجميع المدن الرئيسية في المملكة" : "Comprehensive coverage of all major cities in the Kingdom",
                  status: lang === "ar" ? "مخطط" : "Planned",
                  color: "from-violet-500 to-purple-600",
                },
              ].map((item, i) => (
                <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`relative ${lang === "ar" ? "pr-16" : "pl-16"} mb-12 last:mb-0`}>
                  <div className={`absolute ${lang === "ar" ? "right-0" : "left-0"} top-0 w-12 h-12 rounded-full bg-gradient-to-br ${item.color} shadow-lg flex items-center justify-center`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-sky-brand bg-sky-brand/10 px-3 py-1 rounded-full">{item.phase}</span>
                        <span className="text-xs text-muted-foreground">{item.status}</span>
                      </div>
                      <h3 className="text-lg font-bold font-[Readex_Pro] mb-2 text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-sky-brand to-mint-brand relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none">
            <path d="M0 150 Q300 50 600 150 T1200 150" stroke="white" strokeWidth="3" />
          </svg>
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] text-white mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">{t("cta.desc")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-sky-brand hover:bg-white/90 shadow-xl hover:scale-105 transition-all duration-300 text-base px-8 gap-2 font-bold">
                  {t("cta.contact")}
                  <ArrowIcon className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8">
                  {t("nav.services")}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
