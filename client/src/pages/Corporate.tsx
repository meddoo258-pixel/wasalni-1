/**
 * Corporate Page - صفحة حلول نقل الشركات
 * Full corporate transport solutions with contract request form
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, Users, Route, CreditCard, BarChart3,
  CheckCircle, Shield, Clock, Phone, Mail, MapPin,
  ArrowLeft, ArrowRight, FileText, Target, Zap, Star,
  Navigation, Bell, UserCheck, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionHeading from "@/components/SectionHeading";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

const CORPORATE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/corporate-service-knTbV53ErucZzvRxQhtg64.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

export default function Corporate() {
  const { lang } = useLanguage();
  const ArrowIcon = lang === "ar" ? ArrowLeft : ArrowRight;
  const isAr = lang === "ar";

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    phone: "",
    email: "",
    employeeCount: "",
    serviceType: "" as "employees" | "students" | "mixed" | "airport" | "",
    city: "",
    requirements: "",
  });

  const corporateMutation = trpc.corporate.submitRequest.useMutation({
    onSuccess: () => {
      toast.success(isAr ? "تم إرسال طلبك بنجاح!" : "Request submitted successfully!", {
        description: isAr ? "سيتواصل معك فريق المبيعات خلال 24 ساعة." : "Our sales team will contact you within 24 hours.",
      });
      setFormData({ companyName: "", contactName: "", phone: "", email: "", employeeCount: "", serviceType: "", city: "", requirements: "" });
    },
    onError: (err: { message: string }) => {
      toast.error(isAr ? "حدث خطأ" : "Error occurred", { description: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactName || !formData.phone || !formData.email || !formData.serviceType) {
      toast.error(isAr ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }
    corporateMutation.mutate({
      companyName: formData.companyName,
      contactName: formData.contactName,
      phone: formData.phone,
      email: formData.email,
      employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : undefined,
      serviceType: formData.serviceType as "employees" | "students" | "mixed" | "airport",
      city: formData.city,
      requirements: formData.requirements,
    });
  };

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative py-24 bg-gradient-to-br from-violet-50 via-white to-sky-50/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: isAr ? 50 : -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <Building2 className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-medium text-violet-600">{isAr ? "حلول مؤسسية متكاملة" : "Integrated Corporate Solutions"}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-[Readex_Pro] mb-6 text-foreground leading-tight">
                {isAr ? (
                  <><span className="gradient-text">نقل موظفيك</span> بكفاءة واحترافية</>
                ) : (
                  <><span className="gradient-text">Transport Your Employees</span> Efficiently</>
                )}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {isAr
                  ? "حلول نقل مؤسسية شاملة مصممة خصيصاً لاحتياجات شركتك. من نقل الموظفين اليومي إلى الرحلات الخاصة، نوفر لك الراحة والدقة والأمان."
                  : "Comprehensive corporate transport solutions designed specifically for your company's needs. From daily employee commutes to special trips, we provide comfort, punctuality, and safety."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-xl shadow-violet-500/25 hover:scale-105 transition-all duration-300 gap-2"
                  onClick={() => document.getElementById("corporate-form")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {isAr ? "طلب عرض سعر" : "Request a Quote"}
                  <ArrowIcon className="w-4 h-4" />
                </Button>
                <a href="tel:0510660620">
                  <Button size="lg" variant="outline" className="border-violet-500/30 text-violet-600 hover:bg-violet-500/5 gap-2">
                    <Phone className="w-4 h-4" />
                    {isAr ? "اتصل بنا الآن" : "Call Us Now"}
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-border/50">
                {[
                  { value: "50+", label: isAr ? "شركة عميلة" : "Client Companies" },
                  { value: "5000+", label: isAr ? "موظف يومياً" : "Employees Daily" },
                  { value: "98%", label: isAr ? "رضا العملاء" : "Client Satisfaction" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold font-[Readex_Pro] gradient-text">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: isAr ? -50 : 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={CORPORATE_IMG} alt={isAr ? "حلول نقل الشركات - وصلني" : "Corporate Transport Solutions - Wasalni"} className="w-full h-[450px] object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-24 bg-background">
        <div className="container">
          <SectionHeading
            title={isAr ? "خدماتنا للشركات" : "Our Corporate Services"}
            subtitle={isAr ? "حلول متكاملة لكل احتياجات النقل المؤسسي" : "Comprehensive solutions for all corporate transport needs"}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: isAr ? "نقل الموظفين اليومي" : "Daily Employee Transport",
                desc: isAr ? "خدمة نقل منتظمة من وإلى مقر العمل مع مسارات محسّنة وجداول ثابتة لضمان وصول موظفيك في الوقت المحدد." : "Regular transport service to and from the workplace with optimized routes and fixed schedules.",
                features: [
                  isAr ? "مسارات ذكية محسّنة" : "Smart optimized routes",
                  isAr ? "جداول ثابتة ومرنة" : "Fixed and flexible schedules",
                  isAr ? "تتبع فوري للمركبات" : "Real-time vehicle tracking",
                  isAr ? "تقارير الحضور والانصراف" : "Attendance & departure reports",
                ],
                color: "from-sky-500 to-blue-600",
                shadow: "shadow-sky-500/20",
              },
              {
                icon: Building2,
                title: isAr ? "عقود الشركات السنوية" : "Annual Corporate Contracts",
                desc: isAr ? "عقود سنوية مرنة مع أسعار تنافسية وخدمة مخصصة لشركتك، مع مدير حساب متخصص لمتابعة احتياجاتك." : "Flexible annual contracts with competitive prices and dedicated service, with a specialized account manager.",
                features: [
                  isAr ? "أسعار تنافسية بالجملة" : "Competitive bulk pricing",
                  isAr ? "مدير حساب متخصص" : "Dedicated account manager",
                  isAr ? "فواتير شهرية مفصّلة" : "Detailed monthly invoices",
                  isAr ? "خدمة أولوية 24/7" : "Priority 24/7 service",
                ],
                color: "from-violet-500 to-purple-600",
                shadow: "shadow-violet-500/20",
              },
              {
                icon: Route,
                title: isAr ? "الرحلات الخاصة والمؤتمرات" : "Special Trips & Conferences",
                desc: isAr ? "خدمة نقل مخصصة للفعاليات والمؤتمرات والرحلات الخاصة مع أسطول فاخر وسائقين محترفين." : "Dedicated transport for events, conferences, and special trips with a luxury fleet and professional drivers.",
                features: [
                  isAr ? "أسطول فاخر متنوع" : "Diverse luxury fleet",
                  isAr ? "سائقون بزي رسمي" : "Formally dressed drivers",
                  isAr ? "تنسيق كامل للرحلة" : "Full trip coordination",
                  isAr ? "خدمة VIP للمسؤولين" : "VIP service for executives",
                ],
                color: "from-emerald-500 to-teal-600",
                shadow: "shadow-emerald-500/20",
              },
            ].map((service, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} ${service.shadow} shadow-lg flex items-center justify-center mb-6`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold font-[Readex_Pro] mb-4 text-foreground">{service.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{service.desc}</p>
                    <div className="space-y-2">
                      {service.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container">
          <SectionHeading
            title={isAr ? "مزايا حلول وصلني للشركات" : "Wasalni Corporate Advantages"}
            subtitle={isAr ? "ما يميزنا عن غيرنا من مزودي خدمات النقل" : "What sets us apart from other transport providers"}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: isAr ? "لوحة تحكم متقدمة" : "Advanced Dashboard", desc: isAr ? "تتبع جميع رحلات موظفيك وتقارير الحضور في الوقت الفعلي" : "Track all employee trips and attendance reports in real-time", color: "from-sky-500 to-blue-600" },
              { icon: CreditCard, title: isAr ? "فواتير مرنة" : "Flexible Billing", desc: isAr ? "خيارات دفع متعددة مع فواتير مفصّلة شهرية أو ربع سنوية" : "Multiple payment options with detailed monthly or quarterly invoices", color: "from-violet-500 to-purple-600" },
              { icon: Shield, title: isAr ? "أمان وموثوقية" : "Safety & Reliability", desc: isAr ? "جميع السائقين معتمدون ومؤمّنون مع نظام تتبع فوري" : "All drivers are certified and insured with real-time tracking", color: "from-emerald-500 to-teal-600" },
              { icon: Target, title: isAr ? "تخصيص كامل" : "Full Customization", desc: isAr ? "نصمم الحل المثالي لاحتياجات شركتك الخاصة" : "We design the perfect solution for your company's specific needs", color: "from-amber-500 to-orange-600" },
              { icon: Navigation, title: isAr ? "مسارات ذكية" : "Smart Routes", desc: isAr ? "خوارزميات AI لتحسين المسارات وتقليل وقت التنقل بنسبة 40%" : "AI algorithms to optimize routes and reduce commute time by 40%", color: "from-rose-500 to-pink-600" },
              { icon: Bell, title: isAr ? "إشعارات فورية" : "Instant Notifications", desc: isAr ? "إشعارات للموظفين عند وصول المركبة وتغيير المسار" : "Notifications for employees when vehicle arrives or route changes", color: "from-indigo-500 to-blue-600" },
              { icon: UserCheck, title: isAr ? "إدارة الحضور" : "Attendance Management", desc: isAr ? "تقارير تفصيلية عن حضور الموظفين وأوقات الوصول والمغادرة" : "Detailed reports on employee attendance, arrival and departure times", color: "from-teal-500 to-cyan-600" },
              { icon: Calendar, title: isAr ? "جدولة مرنة" : "Flexible Scheduling", desc: isAr ? "تعديل الجداول والمسارات بسهولة حسب احتياجات العمل" : "Easily adjust schedules and routes according to business needs", color: "from-sky-500 to-indigo-600" },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="p-5 rounded-2xl bg-white shadow-md border border-border/50 hover:shadow-lg transition-shadow h-full">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-md`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeading
            title={isAr ? "كيف نبدأ معك؟" : "How Do We Start With You?"}
            subtitle={isAr ? "أربع خطوات بسيطة للبدء في خدمة نقل موظفيك" : "Four simple steps to start your employee transport service"}
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: FileText, title: isAr ? "أرسل طلبك" : "Submit Request", desc: isAr ? "أرسل نموذج الطلب مع تفاصيل احتياجات شركتك" : "Submit the request form with your company's needs", color: "from-sky-500 to-blue-500" },
              { icon: Users, title: isAr ? "استشارة مجانية" : "Free Consultation", desc: isAr ? "يتواصل معك مستشارنا لفهم احتياجاتك بشكل كامل" : "Our consultant contacts you to fully understand your needs", color: "from-violet-500 to-purple-500" },
              { icon: Route, title: isAr ? "تصميم الحل" : "Solution Design", desc: isAr ? "نصمم مسارات وجداول مخصصة لموظفيك" : "We design custom routes and schedules for your employees", color: "from-emerald-500 to-teal-500" },
              { icon: Zap, title: isAr ? "البدء الفوري" : "Immediate Start", desc: isAr ? "نبدأ تشغيل الخدمة خلال 48 ساعة من توقيع العقد" : "We start the service within 48 hours of signing the contract", color: "from-amber-500 to-orange-500" },
            ].map((step, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} shadow-xl mx-auto flex items-center justify-center mb-5 relative`}>
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
      </section>

      {/* ===== CONTRACT REQUEST FORM ===== */}
      <section id="corporate-form" className="py-24 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              title={isAr ? "طلب عقد أو عرض سعر" : "Request a Contract or Quote"}
              subtitle={isAr ? "أرسل طلبك وسيتواصل معك فريق المبيعات خلال 24 ساعة" : "Submit your request and our sales team will contact you within 24 hours"}
            />
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-[Readex_Pro] text-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-violet-500" />
                  {isAr ? "بيانات الشركة والطلب" : "Company & Request Details"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">{isAr ? "اسم الشركة *" : "Company Name *"}</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={e => setFormData(p => ({ ...p, companyName: e.target.value }))}
                        placeholder={isAr ? "أدخل اسم شركتك" : "Enter company name"}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">{isAr ? "اسم جهة الاتصال *" : "Contact Person *"}</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={e => setFormData(p => ({ ...p, contactName: e.target.value }))}
                        placeholder={isAr ? "الاسم الكامل" : "Full name"}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="corpPhone">{isAr ? "رقم الجوال *" : "Phone Number *"}</Label>
                      <Input
                        id="corpPhone"
                        value={formData.phone}
                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        placeholder="05XXXXXXXX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="corpEmail">{isAr ? "البريد الإلكتروني *" : "Email Address *"}</Label>
                      <Input
                        id="corpEmail"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="company@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">{isAr ? "عدد الموظفين المقدّر" : "Estimated Employee Count"}</Label>
                      <Input
                        id="employeeCount"
                        type="number"
                        value={formData.employeeCount}
                        onChange={e => setFormData(p => ({ ...p, employeeCount: e.target.value }))}
                        placeholder={isAr ? "مثال: 50" : "e.g., 50"}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">{isAr ? "المدينة" : "City"}</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                        placeholder={isAr ? "مثال: الرياض" : "e.g., Riyadh"}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">{isAr ? "نوع الخدمة المطلوبة *" : "Required Service Type *"}</Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={v => setFormData(p => ({ ...p, serviceType: v as typeof formData.serviceType }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isAr ? "اختر نوع الخدمة" : "Select service type"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employees">{isAr ? "نقل موظفين" : "Employee Transport"}</SelectItem>
                        <SelectItem value="students">{isAr ? "نقل طلاب / طالبات" : "Student Transport"}</SelectItem>
                        <SelectItem value="mixed">{isAr ? "نقل مختلط (موظفين + طلاب)" : "Mixed Transport"}</SelectItem>
                        <SelectItem value="airport">{isAr ? "استقبال وتوديع المطار" : "Airport Pickup & Drop-off"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements">{isAr ? "متطلبات خاصة أو ملاحظات" : "Special Requirements or Notes"}</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={e => setFormData(p => ({ ...p, requirements: e.target.value }))}
                      placeholder={isAr ? "صف احتياجاتك بالتفصيل: المناطق، أوقات العمل، أي متطلبات خاصة..." : "Describe your needs in detail: areas, working hours, special requirements..."}
                      rows={4}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-violet-500/30 hover:scale-[1.02] transition-all duration-300 gap-2"
                    disabled={corporateMutation.isPending}
                  >
                    {corporateMutation.isPending
                      ? (isAr ? "جاري الإرسال..." : "Submitting...")
                      : (isAr ? "إرسال طلب العقد" : "Submit Contract Request")}
                    <ArrowIcon className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Phone, label: isAr ? "اتصل بنا" : "Call Us", value: "0510660620" },
                { icon: Mail, label: isAr ? "البريد الإلكتروني" : "Email", value: "corporate@wasalni.cam" },
                { icon: MapPin, label: isAr ? "الموقع" : "Location", value: isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border border-border/50">
                  <item.icon className="w-5 h-5 text-violet-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="text-sm font-medium text-foreground">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-violet-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none">
            <path d="M0 150 Q300 50 600 150 T1200 150" stroke="white" strokeWidth="3" />
          </svg>
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Star className="w-12 h-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold font-[Readex_Pro] text-white mb-4">
              {isAr ? "انضم إلى أكثر من 50 شركة تثق بوصلني" : "Join Over 50 Companies That Trust Wasalni"}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              {isAr ? "ابدأ رحلتك نحو نقل موظفين أكثر كفاءة وأقل تكلفة مع وصلني" : "Start your journey towards more efficient and cost-effective employee transport with Wasalni"}
            </p>
            <Button
              size="lg"
              className="bg-white text-violet-600 hover:bg-white/90 shadow-xl hover:scale-105 transition-all duration-300 gap-2 font-bold"
              onClick={() => document.getElementById("corporate-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              {isAr ? "ابدأ الآن مجاناً" : "Get Started Free"}
              <ArrowIcon className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
