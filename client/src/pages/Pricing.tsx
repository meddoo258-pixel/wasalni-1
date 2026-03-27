/**
 * Pricing Page - Smart Route Futurism Design
 * Subscription plans with Tabby/Tamara installment options
 * Note: Avoid mentioning specific prices per user preference
 */
import { motion } from "framer-motion";
import { useOpenGraph } from "@/_core/hooks/useOpenGraph";
import {
  Users,
  GraduationCap,
  Building2,
  Plane,
  Check,
  CreditCard,
  Wallet,
  ArrowLeft,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Route,
  MapPin,
  Bell,
  Car,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

export default function Pricing() {
  const { t, lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const ArrowIcon = lang === "ar" ? ArrowLeft : ArrowRight;

  useOpenGraph({
    title: "التسعير | وصلني",
    description: "اطلع على خطط الاشتراك الشهرية المرنة للموظفات والطالبات والمعلمات والشركات",
    url: typeof window !== "undefined" ? window.location.href : "",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/corporate-service-knTbV53ErucZzvRxQhtg64.webp",
    type: "website",
    siteName: "وصلني - Wasalni",
    locale: "ar_SA",
  });

  const handleSubscribe = () => {
    window.location.href = "/subscribe";
  };

  const plans = [
    {
      key: "individual",
      icon: Users,
      title: t("pricing.individual"),
      desc: t("pricing.individual.desc"),
      color: "from-sky-500 to-blue-600",
      shadow: "shadow-sky-500/20",
      borderColor: "border-sky-500/20",
      popular: false,
      features: [
        t("how.step2.desc"),
        t("routes.feature3"),
        t("safety.f2.title"),
        t("safety.f3.title"),
        t("routes.feature1"),
        t("srvPage.emp.f6"),
      ],
    },
    {
      key: "student",
      icon: GraduationCap,
      title: t("pricing.student"),
      desc: t("pricing.student.desc"),
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
      borderColor: "border-emerald-500/30",
      popular: true,
      features: [
        t("srvPage.stu.f1"),
        t("srvPage.stu.f2"),
        t("srvPage.stu.f3"),
        t("srvPage.stu.f4"),
        t("srvPage.stu.f5"),
        t("srvPage.stu.f6"),
      ],
    },
    {
      key: "corporate",
      icon: Building2,
      title: t("pricing.corporate"),
      desc: t("pricing.corporate.desc"),
      color: "from-violet-500 to-purple-600",
      shadow: "shadow-violet-500/20",
      borderColor: "border-violet-500/20",
      popular: false,
      features: [
        t("corporate.f1"),
        t("corporate.f2"),
        t("corporate.f3"),
        t("corporate.f4"),
        t("routes.feature2"),
        t("srvPage.emp.f6"),
      ],
    },
    {
      key: "airport",
      icon: Plane,
      title: t("pricing.airport"),
      desc: t("pricing.airport.desc"),
      color: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/20",
      borderColor: "border-amber-500/20",
      popular: false,
      features: [
        t("airport.f1"),
        t("airport.f2"),
        t("airport.f3"),
        t("airport.f4"),
        t("srvPage.airport.f5"),
        t("srvPage.airport.f6"),
      ],
    },
    {
      key: "rental",
      icon: Truck,
      title: lang === "ar" ? "تأجير المركبات" : "Vehicle Rental",
      desc: lang === "ar" ? "للسائقين الراغبين في استئجار مركبة" : "For drivers who want to rent a vehicle",
      color: "from-teal-500 to-cyan-600",
      shadow: "shadow-teal-500/20",
      borderColor: "border-teal-500/20",
      popular: false,
      features: [
        t("fleet.sedan") + " - " + t("fleet.sedan.capacity"),
        t("fleet.h1") + " - " + t("fleet.h1.capacity"),
        t("fleet.hiace") + " - " + t("fleet.hiace.capacity"),
        t("fleet.coaster") + " - " + t("fleet.coaster.capacity"),
        lang === "ar" ? "عقود يومية / أسبوعية / شهرية" : "Daily / Weekly / Monthly contracts",
        lang === "ar" ? "دعم فني وصيانة شاملة" : "Full technical support & maintenance",
      ],
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/60 to-background relative">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 400" fill="none">
            <path d="M0 200 Q300 100 600 200 T1200 200" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <div className="container relative z-10">
          <SectionHeading
            title={t("pricing.title")}
            subtitle={t("pricing.subtitle")}
          />
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.key}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-lg">
                      <Star className="w-3 h-3" />
                      {t("pricing.popular")}
                    </span>
                  </div>
                )}
                <Card
                  className={`h-full border-2 ${plan.popular ? plan.borderColor : "border-border"} shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white overflow-hidden`}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} ${plan.shadow} shadow-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <plan.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-[Readex_Pro] text-foreground">
                          {plan.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{plan.desc}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border my-4" />

                    {/* Features */}
                    <div className="mb-6 flex-1">
                      <p className="text-sm font-semibold text-foreground mb-3">{t("pricing.features")}</p>
                      <ul className="space-y-2.5">
                        {plan.features.map((feature, fi) => (
                          <li key={fi} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-mint-brand flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Installment badge */}
                    <div className="mb-4 px-3 py-2 rounded-lg bg-secondary/60 border border-border">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-sky-brand" />
                        <span className="text-xs text-muted-foreground">{t("pricing.installment")}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    {plan.key === "corporate" ? (
                      <Link href="/contact">
                        <Button
                          className="w-full border-sky-brand/30 text-sky-brand hover:bg-sky-brand/5"
                          variant="outline"
                        >
                          {t("pricing.contactUs")}
                          <ArrowIcon className="w-4 h-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className={`w-full bg-gradient-to-r ${plan.color} text-white border-0 shadow-lg hover:scale-[1.02] transition-all duration-300`}
                        onClick={handleSubscribe}
                      >
                        {isAuthenticated
                          ? (lang === "ar" ? "اشترك الآن" : "Subscribe Now")
                          : (lang === "ar" ? "سجّل وابدأ الاشتراك" : "Sign Up & Subscribe")}
                        <ArrowIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container">
          <SectionHeading
            title={t("payment.title")}
            subtitle={t("payment.subtitle")}
          />

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: t("payment.mada"), icon: CreditCard, color: "from-blue-500 to-blue-700" },
                { name: t("payment.apple"), icon: Wallet, color: "from-gray-800 to-gray-900" },
                { name: t("payment.tabby"), icon: CreditCard, color: "from-teal-500 to-teal-700" },
                { name: t("payment.tamara"), icon: CreditCard, color: "from-pink-500 to-pink-700" },
              ].map((method, i) => (
                <motion.div
                  key={method.name}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} shadow-lg mx-auto flex items-center justify-center mb-3`}
                      >
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-bold text-foreground">{method.name}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-sm text-muted-foreground mt-8 px-4 py-3 rounded-xl bg-secondary/60 border border-border"
            >
              {t("payment.note")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeading
            title={lang === "ar" ? "لماذا وصلني؟" : "Why Wasalni?"}
            subtitle={lang === "ar" ? "مميزات تجعلنا الخيار الأفضل لنقلك اليومي" : "Features that make us the best choice for your daily commute"}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: lang === "ar" ? "أمان شامل" : "Complete Safety",
                desc: lang === "ar" ? "سائقون وسائقات موثقون مع تتبع مباشر ونظام طوارئ" : "Verified drivers with live tracking and emergency system",
                color: "from-sky-500 to-blue-600",
              },
              {
                icon: Route,
                title: lang === "ar" ? "مسارات ذكية" : "Smart Routes",
                desc: lang === "ar" ? "مسارات محسّنة تقلل الوقت والتكلفة مقارنة بالتطبيقات التقليدية" : "Optimized routes that reduce time and cost vs traditional apps",
                color: "from-emerald-500 to-teal-600",
              },
              {
                icon: Clock,
                title: lang === "ar" ? "مواعيد دقيقة" : "Precise Timing",
                desc: lang === "ar" ? "جدولة يومية ثابتة مع إشعارات فورية عند كل مرحلة" : "Fixed daily scheduling with instant notifications at every stage",
                color: "from-amber-500 to-orange-600",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white text-center">
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg mx-auto flex items-center justify-center mb-5`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold font-[Readex_Pro] mb-3 text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] text-white mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">{t("cta.desc")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-sky-brand hover:bg-white/90 shadow-xl hover:scale-105 transition-all duration-300 text-base px-8 gap-2 font-bold"
                onClick={handleSubscribe}
              >
                {isAuthenticated
                  ? (lang === "ar" ? "لوحة التحكم" : "Dashboard")
                  : (lang === "ar" ? "ابدأ الآن مجاناً" : "Get Started Free")}
              </Button>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-base px-8"
                >
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
