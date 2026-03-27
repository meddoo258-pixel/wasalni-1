/**
 * Services Page - Monthly Subscription Transport
 * Focused on: Employee Transport, Female Student Transport, Corporate Solutions
 * All buttons functional - redirect to login/signup or booking form
 */
import { motion } from "framer-motion";
import { useOpenGraph } from "@/_core/hooks/useOpenGraph";
import {
  Users,
  Building2,
  GraduationCap,
  Car,
  Shield,
  Clock,
  Bell,
  MapPin,
  UserCheck,
  Navigation,
  CalendarCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Plane,
  Star,
  Phone,
  ChevronRight,
  BadgeCheck,
  Repeat,
  CreditCard,
  Bus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const STUDENT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/student-transport-58CwfLs6voDSevQQk4crZr.webp";
const CORPORATE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/corporate-service-knTbV53ErucZzvRxQhtg64.webp";
const SAFETY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/safety-feature-LmfQGAJxgD4QfRvqJHZtVv.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

export default function Services() {
  const { lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const ArrowIcon = lang === "ar" ? ArrowLeft : ArrowRight;
  const ar = lang === "ar";

  useOpenGraph({
    title: "خدماتنا | وصلني",
    description: "خدمات نقل متعددة: اشتراكات شهرية للموظفات والطالبات، تأجير مركبات، وخدمات شركاتية",
    url: typeof window !== "undefined" ? window.location.href : "",
    image: STUDENT_IMG,
    type: "website",
    siteName: "وصلني - Wasalni",
    locale: "ar_SA",
  });

  const handleSubscribe = () => {
    window.location.href = "/subscribe";
  };

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-sky-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 400" fill="none">
            <path d="M0 200 Q300 100 600 200 T1200 200" stroke="#0EA5E9" strokeWidth="2" />
          </svg>
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 border border-sky-200 mb-6">
              <Repeat className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-sky-700">
                {ar ? "اشتراك شهري مرن" : "Flexible Monthly Subscription"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-[Readex_Pro] mb-6 text-gray-900">
              {ar ? (
                <>خدمات <span className="gradient-text">النقل الذكي</span> بالاشتراك الشهري</>
              ) : (
                <>Smart <span className="gradient-text">Transport Services</span> Monthly Subscription</>
              )}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              {ar
                ? "نوفر حلول نقل متكاملة وآمنة للموظفات والطالبات والمعلمات بنظام الاشتراك الشهري. مسارات محسّنة، سائقات معتمدات، وتتبع فوري."
                : "We provide comprehensive, safe transport solutions for female employees, students, and teachers via monthly subscription. Optimized routes, certified drivers, and live tracking."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-sky-500 to-teal-500 text-white border-0 shadow-lg hover:scale-105 transition-all duration-300 gap-2 text-base px-8"
                onClick={handleSubscribe}
              >
                {ar ? "اشتركي الآن مجاناً" : "Subscribe Now Free"}
                <ArrowIcon className="w-4 h-4" />
              </Button>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-sky-300 text-sky-700 hover:bg-sky-50 gap-2 text-base px-8">
                  <Phone className="w-4 h-4" />
                  {ar ? "تواصلي معنا" : "Contact Us"}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== MAIN SERVICES - 3 CARDS ===== */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] text-gray-900 mb-4">
              {ar ? "خدماتنا الرئيسية" : "Our Core Services"}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {ar
                ? "ثلاث خدمات متكاملة مصممة خصيصاً لاحتياجات المرأة السعودية"
                : "Three integrated services designed specifically for Saudi women's needs"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service 1: Employee Transport */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group">
                <div className="h-2 bg-gradient-to-r from-sky-400 to-blue-600" />
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-sky-600" />
                  </div>
                  <h3 className="text-xl font-bold font-[Readex_Pro] text-gray-900 mb-3">
                    {ar ? "توصيل الموظفات" : "Female Employee Transport"}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {ar
                      ? "خدمة توصيل يومية منتظمة للموظفات من المنزل إلى العمل والعودة. مسارات ثابتة بجداول زمنية دقيقة واشتراك شهري مريح."
                      : "Regular daily transport for female employees from home to work and back. Fixed routes with precise schedules and convenient monthly subscription."}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {(ar
                      ? ["مسارات يومية ثابتة", "جدول زمني دقيق", "سائقات معتمدات", "تتبع مباشر للرحلة", "اشتراك شهري مرن"]
                      : ["Fixed daily routes", "Precise schedule", "Certified female drivers", "Live ride tracking", "Flexible monthly plan"]
                    ).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white border-0 hover:opacity-90 gap-2"
                    onClick={handleSubscribe}
                  >
                    {ar ? "اشتركي الآن" : "Subscribe Now"}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service 2: Student Transport - FEATURED */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="h-full border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group relative">
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {ar ? "الأكثر طلباً" : "Most Popular"}
                  </span>
                </div>
                <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-600" />
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold font-[Readex_Pro] text-gray-900 mb-3">
                    {ar ? "نقل الطالبات والمعلمات" : "Student & Teacher Transport"}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {ar
                      ? "خدمة نقل آمنة ومنظمة للطالبات والمعلمات من وإلى المدارس والجامعات. إشعارات فورية لأولياء الأمور وتتبع مستمر."
                      : "Safe and organized transport for female students and teachers to and from schools and universities. Instant notifications for parents and continuous tracking."}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {(ar
                      ? ["إشعارات فورية لولي الأمر", "تتبع مستمر للرحلة", "سائقات معتمدات ومدرّبات", "جداول متوافقة مع الدراسة", "خدمة الذهاب والإياب"]
                      : ["Instant parent notifications", "Continuous ride tracking", "Certified trained drivers", "School-aligned schedules", "Round-trip service"]
                    ).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 hover:opacity-90 gap-2"
                    onClick={handleSubscribe}
                  >
                    {ar ? "اشتركي الآن" : "Subscribe Now"}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service 3: Corporate */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group">
                <div className="h-2 bg-gradient-to-r from-violet-400 to-purple-600" />
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Building2 className="w-8 h-8 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold font-[Readex_Pro] text-gray-900 mb-3">
                    {ar ? "النقل المؤسسي للشركات" : "Corporate Transport Solutions"}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {ar
                      ? "حلول نقل متكاملة للشركات والمؤسسات. عقود سنوية أو شهرية مع إدارة مركزية وتقارير تفصيلية."
                      : "Comprehensive transport solutions for companies and organizations. Annual or monthly contracts with centralized management and detailed reports."}
                  </p>
                  <ul className="space-y-2 mb-8">
                    {(ar
                      ? ["إدارة مركزية للرحلات", "تقارير تفصيلية شهرية", "أسطول مخصص للشركة", "فواتير موحدة", "دعم فني على مدار الساعة"]
                      : ["Centralized trip management", "Detailed monthly reports", "Dedicated company fleet", "Unified invoicing", "24/7 technical support"]
                    ).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/corporate">
                    <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 hover:opacity-90 gap-2">
                      {ar ? "طلب عرض سعر" : "Request a Quote"}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] text-gray-900 mb-4">
              {ar ? "كيف يعمل الاشتراك الشهري؟" : "How Does the Monthly Subscription Work?"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: UserCheck, title: ar ? "سجّلي حسابك" : "Create Account", desc: ar ? "أنشئي حسابك مجاناً في دقيقة واحدة" : "Create your free account in one minute", color: "from-sky-400 to-blue-500", num: "1" },
              { icon: MapPin, title: ar ? "حددي موقعك" : "Set Your Location", desc: ar ? "أدخلي عنوان منزلك ووجهتك اليومية" : "Enter your home address and daily destination", color: "from-emerald-400 to-teal-500", num: "2" },
              { icon: CalendarCheck, title: ar ? "اختاري الخطة" : "Choose Your Plan", desc: ar ? "اختاري الاشتراك المناسب لاحتياجاتك" : "Choose the subscription that fits your needs", color: "from-violet-400 to-purple-500", num: "3" },
              { icon: Navigation, title: ar ? "استمتعي بالرحلة" : "Enjoy Your Ride", desc: ar ? "سيصلك السائق في الموعد المحدد يومياً" : "Your driver arrives on time every day", color: "from-amber-400 to-orange-500", num: "4" },
            ].map((step, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-xl mx-auto flex items-center justify-center mb-4 relative`}>
                  <step.icon className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold text-gray-700">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-base font-bold font-[Readex_Pro] text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-sky-500 to-teal-500 text-white border-0 shadow-lg hover:scale-105 transition-all duration-300 gap-2 text-base px-10"
              onClick={handleSubscribe}
            >
              {ar ? "ابدئي الاشتراك الآن" : "Start Subscription Now"}
              <ArrowIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== STUDENT TRANSPORT DETAILED ===== */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: ar ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={STUDENT_IMG} alt={ar ? "نقل الطالبات والمعلمات" : "Student and teacher transport"} className="w-full h-[400px] object-cover" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: ar ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 mb-6">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">{ar ? "الخدمة الأكثر طلباً" : "Most Requested Service"}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] text-gray-900 mb-6 leading-tight">
                {ar ? "نقل آمن للطالبات والمعلمات" : "Safe Transport for Students & Teachers"}
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                {ar
                  ? "نفهم أن أمان ابنتك هو أولويتك. لذلك صممنا خدمة نقل متكاملة تشمل سائقات معتمدات، تتبع مباشر، وإشعارات فورية لك عند كل محطة."
                  : "We understand your daughter's safety is your priority. That's why we designed a complete transport service with certified female drivers, live tracking, and instant notifications at every stop."}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Shield, label: ar ? "سائقات معتمدات" : "Certified Drivers" },
                  { icon: Bell, label: ar ? "إشعارات لولي الأمر" : "Parent Notifications" },
                  { icon: Navigation, label: ar ? "تتبع مباشر" : "Live Tracking" },
                  { icon: Clock, label: ar ? "مواعيد دقيقة" : "Precise Timing" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <f.icon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{f.label}</span>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:scale-105 transition-all duration-300 gap-2"
                onClick={handleSubscribe}
              >
                {ar ? "اشتركي في خدمة نقل الطالبات" : "Subscribe to Student Transport"}
                <ArrowIcon className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CORPORATE SECTION ===== */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: ar ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 border border-violet-200 mb-6">
                <Building2 className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-semibold text-violet-700">{ar ? "حلول مؤسسية" : "Corporate Solutions"}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] text-gray-900 mb-6 leading-tight">
                {ar ? "نقل موظفاتك بكفاءة واحترافية" : "Transport Your Female Employees Efficiently"}
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                {ar
                  ? "وفّري على شركتك تكاليف النقل وارفعي إنتاجية موظفاتك. نقدم عقوداً مؤسسية مرنة مع إدارة مركزية وتقارير شهرية تفصيلية."
                  : "Save your company transport costs and boost employee productivity. We offer flexible corporate contracts with centralized management and detailed monthly reports."}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: BadgeCheck, label: ar ? "عقود مرنة" : "Flexible Contracts" },
                  { icon: Users, label: ar ? "أسطول مخصص" : "Dedicated Fleet" },
                  { icon: CreditCard, label: ar ? "فواتير موحدة" : "Unified Billing" },
                  { icon: Star, label: ar ? "دعم VIP" : "VIP Support" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 border border-violet-100">
                    <f.icon className="w-5 h-5 text-violet-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">{f.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/corporate">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-lg hover:scale-105 transition-all duration-300 gap-2"
                >
                  {ar ? "طلب عرض سعر للشركة" : "Request Corporate Quote"}
                  <ArrowIcon className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: ar ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={CORPORATE_IMG} alt={ar ? "نقل موظفات الشركات" : "Corporate employee transport"} className="w-full h-[400px] object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ADDITIONAL SERVICES ===== */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold font-[Readex_Pro] text-gray-900 mb-4">
              {ar ? "خدمات إضافية" : "Additional Services"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Plane, title: ar ? "استقبال وتوديع المطار" : "Airport Pickup & Drop", desc: ar ? "خدمة استقبال وتوديع من وإلى المطار بمواعيد دقيقة" : "Airport pickup and drop-off with precise timing", color: "from-rose-400 to-pink-600", link: "/contact" },
              { icon: Car, title: ar ? "تأجير المركبات" : "Vehicle Rental", desc: ar ? "تأجير سيارات وحافلات بسائق لجميع المناسبات" : "Car and bus rental with driver for all occasions", color: "from-amber-400 to-orange-600", link: "/rental" },
              { icon: Shield, title: ar ? "النقل الآمن للسيدات" : "Safe Women's Transport", desc: ar ? "سائقات معتمدات ومدرّبات على أعلى معايير الأمان" : "Certified drivers trained to the highest safety standards", color: "from-sky-400 to-blue-600", link: "/drivers" },
              { icon: Bus, title: ar ? "تغطية واسعة" : "Wide Coverage", desc: ar ? "نغطي الرياض والدمام مع خطط للتوسع لجميع المدن" : "We cover Riyadh and Dammam with expansion plans", color: "from-teal-400 to-green-600", link: "/contact" },
            ].map((s, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Link href={s.link}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} shadow-lg mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <s.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-base font-bold font-[Readex_Pro] text-gray-900 mb-2">{s.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SAFETY SECTION ===== */}
      <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: ar ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={SAFETY_IMG} alt={ar ? "أمان وسلامة الركاب" : "Passenger safety"} className="w-full h-[400px] object-cover" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: ar ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
                <Shield className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-semibold text-sky-400">{ar ? "الأمان أولاً" : "Safety First"}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] text-white mb-6 leading-tight">
                {ar ? "معايير أمان لا تُساوم عليها" : "Uncompromising Safety Standards"}
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                {ar
                  ? "كل سائقة تمر بفحص أمني شامل وتدريب مكثف. مركباتنا مجهزة بكاميرات وأجهزة تتبع GPS لضمان سلامتك في كل رحلة."
                  : "Every driver undergoes a comprehensive security check and intensive training. Our vehicles are equipped with cameras and GPS tracking to ensure your safety on every trip."}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: UserCheck, title: ar ? "فحص أمني شامل" : "Full Security Check" },
                  { icon: Navigation, title: ar ? "تتبع GPS مستمر" : "Continuous GPS Tracking" },
                  { icon: Bell, title: ar ? "إشعارات فورية" : "Instant Notifications" },
                  { icon: Shield, title: ar ? "تأمين شامل" : "Full Insurance" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <item.icon className="w-5 h-5 text-sky-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-white">{item.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-sky-500 to-teal-500">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] text-white mb-6">
              {ar ? "ابدئي رحلتك مع وصلني اليوم" : "Start Your Journey with Wasalni Today"}
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              {ar
                ? "انضمي لآلاف الموظفات والطالبات اللواتي يثقن بوصلني يومياً"
                : "Join thousands of employees and students who trust Wasalni daily"}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-sky-600 hover:bg-gray-50 border-0 shadow-xl hover:scale-105 transition-all duration-300 gap-2 text-base px-10 font-bold"
                onClick={handleSubscribe}
              >
                {ar ? "اشتركي مجاناً الآن" : "Subscribe Free Now"}
                <ArrowIcon className="w-4 h-4" />
              </Button>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2 text-base px-10">
                  <Phone className="w-4 h-4" />
                  {ar ? "تواصلي معنا" : "Contact Us"}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
