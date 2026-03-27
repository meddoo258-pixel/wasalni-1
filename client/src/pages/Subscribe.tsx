/**
 * Subscribe Page - Monthly Subscription Form
 * Allows users to submit monthly transport subscription requests
 * Bilingual AR/EN
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useOpenGraph } from "@/_core/hooks/useOpenGraph";
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Send,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Shield,
  Navigation,
  Bell,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

const serviceTypes = [
  { value: "employee" as const, icon: Users, colorFrom: "from-sky-500", colorTo: "to-blue-600", bgFrom: "from-sky-100", bgTo: "to-blue-100", iconColor: "text-sky-600" },
  { value: "student" as const, icon: GraduationCap, colorFrom: "from-emerald-500", colorTo: "to-teal-600", bgFrom: "from-emerald-100", bgTo: "to-teal-100", iconColor: "text-emerald-600" },
  { value: "teacher" as const, icon: BookOpen, colorFrom: "from-violet-500", colorTo: "to-purple-600", bgFrom: "from-violet-100", bgTo: "to-purple-100", iconColor: "text-violet-600" },
  { value: "corporate" as const, icon: Building2, colorFrom: "from-amber-500", colorTo: "to-orange-600", bgFrom: "from-amber-100", bgTo: "to-orange-100", iconColor: "text-amber-600" },
];

const cities = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الظهران",
  "تبوك", "أبها", "الطائف", "بريدة", "حائل", "نجران", "جازان", "ينبع", "الجبيل",
];

export default function Subscribe() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const ArrowIcon = ar ? ArrowLeft : ArrowRight;

  useOpenGraph({
    title: "اشترك الآن | وصلني",
    description: "اشترك بالاشتراك الشهري للنقل الآمن والموثوق. اختر نوع الخدمة المناسبة لك وابدأ الرحلة",
    url: typeof window !== "undefined" ? window.location.href : "",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/hero-bg-iurdvN3JiN4tfwU5PHFivW.webp",
    type: "website",
    siteName: "وصلني - Wasalni",
    locale: "ar_SA",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    serviceType: "" as "" | "employee" | "student" | "teacher" | "corporate",
    city: "",
    pickupAddress: "",
    dropoffAddress: "",
    preferredTime: "",
    numberOfPassengers: 1,
    notes: "",
  });

  const submitSubscription = trpc.subscriptions.submit.useMutation({
    onSuccess: () => {
      toast.success(ar ? "تم إرسال طلب الاشتراك بنجاح!" : "Subscription request submitted successfully!", {
        description: ar ? "سنتواصل معك خلال 24 ساعة لتأكيد الاشتراك" : "We'll contact you within 24 hours to confirm",
      });
      setFormData({
        fullName: "", phone: "", email: "", serviceType: "", city: "",
        pickupAddress: "", dropoffAddress: "", preferredTime: "", numberOfPassengers: 1, notes: "",
      });
    },
    onError: (err) => {
      toast.error(ar ? "حدث خطأ في إرسال الطلب" : "Failed to submit request", {
        description: err.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.serviceType || !formData.city || !formData.pickupAddress || !formData.dropoffAddress) {
      toast.error(ar ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }
    submitSubscription.mutate({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email || "",
      serviceType: formData.serviceType as "employee" | "student" | "teacher" | "corporate",
      city: formData.city,
      pickupAddress: formData.pickupAddress,
      dropoffAddress: formData.dropoffAddress,
      preferredTime: formData.preferredTime || "",
      numberOfPassengers: formData.numberOfPassengers,
      notes: formData.notes || "",
    });
  };

  const labels: Record<string, Record<string, string>> = {
    employee: { ar: "توصيل الموظفات", en: "Female Employee Transport" },
    student: { ar: "نقل الطالبات", en: "Student Transport" },
    teacher: { ar: "نقل المعلمات", en: "Teacher Transport" },
    corporate: { ar: "نقل الشركات", en: "Corporate Transport" },
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
              <CreditCard className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-semibold text-sky-700">
                {ar ? "اشتراك شهري مرن" : "Flexible Monthly Subscription"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-[Readex_Pro] mb-6 text-gray-900">
              {ar ? (
                <>اشتركي في <span className="gradient-text">خدمة النقل الشهري</span></>
              ) : (
                <>Subscribe to <span className="gradient-text">Monthly Transport</span></>
              )}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {ar
                ? "سجّلي بياناتك وسنتواصل معك خلال 24 ساعة لتأكيد الاشتراك وتحديد المسار المناسب. بدون التزام مسبق."
                : "Register your details and we'll contact you within 24 hours to confirm subscription and set the best route. No upfront commitment."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Shield, label: ar ? "سائقات معتمدات" : "Certified Drivers", color: "text-sky-600 bg-sky-50" },
              { icon: Navigation, label: ar ? "تتبع مباشر" : "Live Tracking", color: "text-emerald-600 bg-emerald-50" },
              { icon: Bell, label: ar ? "إشعارات فورية" : "Instant Alerts", color: "text-violet-600 bg-violet-50" },
              { icon: Clock, label: ar ? "مواعيد دقيقة" : "Precise Timing", color: "text-amber-600 bg-amber-50" },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className={`flex flex-col items-center gap-2 p-4 rounded-xl ${item.color.split(" ")[1]} text-center`}>
                  <item.icon className={`w-6 h-6 ${item.color.split(" ")[0]}`} />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBSCRIPTION FORM ===== */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card className="border-0 shadow-2xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-sky-500 via-emerald-500 to-violet-500" />
                <CardContent className="p-8 md:p-10">
                  <h2 className="text-2xl font-bold font-[Readex_Pro] text-gray-900 mb-2 text-center">
                    {ar ? "نموذج طلب الاشتراك الشهري" : "Monthly Subscription Request Form"}
                  </h2>
                  <p className="text-gray-500 text-sm text-center mb-8">
                    {ar ? "جميع الحقول المميزة بـ * مطلوبة" : "All fields marked with * are required"}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Service Type Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {ar ? "نوع الخدمة *" : "Service Type *"}
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {serviceTypes.map((st) => (
                          <button
                            key={st.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, serviceType: st.value })}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                              formData.serviceType === st.value
                                ? `border-sky-500 bg-sky-50 shadow-md scale-105`
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${st.bgFrom} ${st.bgTo} flex items-center justify-center mx-auto mb-2`}>
                              <st.icon className={`w-5 h-5 ${st.iconColor}`} />
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {labels[st.value]?.[ar ? "ar" : "en"]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 inline ml-1" />
                          {ar ? "الاسم الكامل *" : "Full Name *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all outline-none"
                          placeholder={ar ? "مثال: نورة أحمد" : "e.g. Noura Ahmed"}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline ml-1" />
                          {ar ? "رقم الجوال *" : "Phone Number *"}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all outline-none"
                          placeholder="05XXXXXXXX"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="w-4 h-4 inline ml-1" />
                          {ar ? "البريد الإلكتروني" : "Email"}
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all outline-none"
                          placeholder={ar ? "example@email.com" : "example@email.com"}
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 inline ml-1" />
                          {ar ? "المدينة *" : "City *"}
                        </label>
                        <select
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all outline-none"
                        >
                          <option value="">{ar ? "اختاري المدينة" : "Select City"}</option>
                          {cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 inline ml-1 text-emerald-500" />
                          {ar ? "عنوان الانطلاق *" : "Pickup Address *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.pickupAddress}
                          onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all outline-none"
                          placeholder={ar ? "مثال: حي النرجس، شارع الأمير سلطان" : "e.g. Al Narjis, Prince Sultan St."}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="w-4 h-4 inline ml-1 text-red-500" />
                          {ar ? "عنوان الوصول *" : "Dropoff Address *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.dropoffAddress}
                          onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all outline-none"
                          placeholder={ar ? "مثال: جامعة الملك سعود" : "e.g. King Saud University"}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Clock className="w-4 h-4 inline ml-1" />
                          {ar ? "الوقت المفضل" : "Preferred Time"}
                        </label>
                        <select
                          value={formData.preferredTime}
                          onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all outline-none"
                        >
                          <option value="">{ar ? "اختاري الوقت" : "Select Time"}</option>
                          <option value="6:00">{ar ? "6:00 صباحاً" : "6:00 AM"}</option>
                          <option value="6:30">{ar ? "6:30 صباحاً" : "6:30 AM"}</option>
                          <option value="7:00">{ar ? "7:00 صباحاً" : "7:00 AM"}</option>
                          <option value="7:30">{ar ? "7:30 صباحاً" : "7:30 AM"}</option>
                          <option value="8:00">{ar ? "8:00 صباحاً" : "8:00 AM"}</option>
                          <option value="8:30">{ar ? "8:30 صباحاً" : "8:30 AM"}</option>
                          <option value="9:00">{ar ? "9:00 صباحاً" : "9:00 AM"}</option>
                          <option value="custom">{ar ? "وقت آخر (حدديه في الملاحظات)" : "Other (specify in notes)"}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Users className="w-4 h-4 inline ml-1" />
                          {ar ? "عدد الركاب" : "Number of Passengers"}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={formData.numberOfPassengers}
                          onChange={(e) => setFormData({ ...formData, numberOfPassengers: parseInt(e.target.value) || 1 })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {ar ? "ملاحظات إضافية" : "Additional Notes"}
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all outline-none resize-none"
                        placeholder={ar ? "أي تفاصيل إضافية تودين مشاركتها..." : "Any additional details you'd like to share..."}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitSubscription.isPending}
                      className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white border-0 shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] transition-all duration-300 gap-2 text-base py-6"
                    >
                      {submitSubscription.isPending ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> {ar ? "جاري إرسال الطلب..." : "Submitting..."}</>
                      ) : (
                        <>{ar ? "إرسال طلب الاشتراك" : "Submit Subscription Request"} <Send className="w-5 h-5" /></>
                      )}
                    </Button>

                    <p className="text-xs text-gray-400 text-center">
                      {ar
                        ? "بإرسال هذا النموذج، أنتِ توافقين على شروط الخدمة وسياسة الخصوصية. سنتواصل معك خلال 24 ساعة."
                        : "By submitting this form, you agree to our terms of service and privacy policy. We'll contact you within 24 hours."}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold font-[Readex_Pro] text-gray-900 mb-10 text-center">
            {ar ? "كيف يعمل الاشتراك الشهري؟" : "How Does Monthly Subscription Work?"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: 1, icon: Send, title: ar ? "أرسلي طلبك" : "Submit Request", desc: ar ? "سجّلي بياناتك ومسارك المفضل" : "Register your details and preferred route" },
              { step: 2, icon: Phone, title: ar ? "نتواصل معك" : "We Contact You", desc: ar ? "فريقنا يتواصل معك خلال 24 ساعة" : "Our team contacts you within 24 hours" },
              { step: 3, icon: Navigation, title: ar ? "تحديد المسار" : "Route Setup", desc: ar ? "نحدد أفضل مسار ومواعيد" : "We set the best route and schedule" },
              { step: 4, icon: CheckCircle2, title: ar ? "ابدئي رحلتك" : "Start Your Ride", desc: ar ? "استمتعي بنقل يومي آمن ومنتظم" : "Enjoy safe, regular daily transport" },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 shadow-lg mx-auto flex items-center justify-center mb-4 relative">
                  <item.icon className="w-7 h-7 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold text-sky-600">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-sm font-bold font-[Readex_Pro] mb-1 text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-12 bg-gradient-to-r from-sky-500 to-teal-500">
        <div className="container text-center">
          <h2 className="text-2xl font-bold font-[Readex_Pro] text-white mb-4">
            {ar ? "لديك استفسار؟ تواصلي معنا" : "Have questions? Contact us"}
          </h2>
          <p className="text-white/80 mb-6">
            {ar ? "فريقنا جاهز لمساعدتك في اختيار الباقة المناسبة" : "Our team is ready to help you choose the right plan"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-sky-600 hover:bg-gray-100 gap-2">
                <Phone className="w-4 h-4" />
                {ar ? "تواصلي معنا" : "Contact Us"}
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                {ar ? "تعرّفي على خدماتنا" : "Explore Services"}
                <ArrowIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
