/**
 * Contact Page - Smart Route Futurism Design
 * Bilingual: Contact form, info cards, FAQ, phone 0510660620
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useOpenGraph } from "@/_core/hooks/useOpenGraph";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  Building2,
  Users,
  Car,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SectionHeading from "@/components/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

export default function Contact() {
  const { t, lang } = useLanguage();

  useOpenGraph({
    title: "تواصل معنا | وصلني",
    description: "تواصل معنا لأي استفسارات أو مقترحات. فريقنا مستعد للمساعدة عبر البريد الإلكتروني أو الهاتف",
    url: typeof window !== "undefined" ? window.location.href : "",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663327968909/2CeN73P7VTXehgcpCp8Awy/hero-bg-iurdvN3JiN4tfwU5PHFivW.webp",
    type: "website",
    siteName: "وصلني - Wasalni",
    locale: "ar_SA",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "individual",
    message: "",
  });

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success(t("contact.form.success"), {
        description: t("contact.form.successDesc"),
      });
      setFormData({ name: "", email: "", phone: "", type: "individual", message: "" });
    },
    onError: (err) => {
      toast.error(lang === "ar" ? "حدث خطأ في إرسال الرسالة" : "Failed to send message", {
        description: err.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }
    const typeToSubject: Record<string, string> = {
      individual: lang === "ar" ? "استفسار فردي" : "Individual Inquiry",
      corporate: lang === "ar" ? "استفسار شركة" : "Corporate Inquiry",
      student: lang === "ar" ? "استفسار طالبة" : "Student Inquiry",
      driver: lang === "ar" ? "استفسار سائق" : "Driver Inquiry",
      airport: lang === "ar" ? "استفسار مطار" : "Airport Inquiry",
      other: lang === "ar" ? "استفسار عام" : "General Inquiry",
    };
    submitContact.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      subject: typeToSubject[formData.type] || typeToSubject.other,
      message: formData.message,
    });
  };

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
              <MessageCircle className="w-4 h-4 text-sky-brand" />
              <span className="text-sm font-medium text-sky-brand">{t("contact.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-[Readex_Pro] mb-6 text-foreground">
              <span className="gradient-text">{t("contact.title")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("contact.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Phone, title: t("contact.phone.title"), info: t("contact.phone.info"), desc: t("contact.phone.desc"), color: "from-sky-500 to-blue-600" },
              { icon: Mail, title: t("contact.email.title"), info: t("contact.email.info"), desc: t("contact.email.desc"), color: "from-emerald-500 to-teal-600" },
              { icon: MessageCircle, title: t("contact.whatsapp.title"), info: t("contact.whatsapp.info"), desc: t("contact.whatsapp.desc"), color: "from-green-500 to-emerald-600" },
              { icon: Clock, title: t("contact.hours.title"), info: t("contact.hours.info"), desc: t("contact.hours.desc"), color: "from-amber-500 to-orange-500" },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white text-center">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} mx-auto flex items-center justify-center mb-4 shadow-lg`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-bold font-[Readex_Pro] mb-2 text-foreground">{item.title}</h3>
                    <p className="text-sm font-medium text-foreground/80 mb-1" dir="ltr">{item.info}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Side Info */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: lang === "ar" ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold font-[Readex_Pro] mb-2 text-foreground">{t("contact.form.title")}</h2>
                  <p className="text-sm text-muted-foreground mb-8">{t("contact.form.subtitle")}</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">{t("contact.form.name")}</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand transition-all outline-none"
                        placeholder={t("contact.form.namePh")}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t("contact.form.email")}</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand transition-all outline-none"
                          placeholder={t("contact.form.emailPh")}
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">{t("contact.form.phone")}</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand transition-all outline-none"
                          placeholder={t("contact.form.phonePh")}
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">{t("contact.form.type")}</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand transition-all outline-none"
                      >
                        <option value="individual">{t("contact.form.type.individual")}</option>
                        <option value="corporate">{t("contact.form.type.corporate")}</option>
                        <option value="student">{t("contact.form.type.student")}</option>
                        <option value="driver">{t("contact.form.type.driver")}</option>
                        <option value="airport">{t("contact.form.type.airport")}</option>
                        <option value="other">{t("contact.form.type.other")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">{t("contact.form.message")}</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand transition-all outline-none resize-none"
                        placeholder={t("contact.form.messagePh")}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitContact.isPending}
                      className="w-full bg-gradient-to-r from-sky-brand to-mint-brand text-white border-0 shadow-lg shadow-sky-brand/25 hover:shadow-sky-brand/40 transition-all duration-300 gap-2"
                    >
                      {submitContact.isPending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {lang === "ar" ? "جاري الإرسال..." : "Sending..."}</>
                      ) : (
                        <>{t("contact.form.submit")} <Send className="w-4 h-4" /></>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Side info */}
            <motion.div initial={{ opacity: 0, x: lang === "ar" ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-[Readex_Pro] mb-4 text-foreground">{t("contact.help.title")}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{t("contact.help.desc")}</p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Users, title: t("contact.help.individuals"), desc: t("contact.help.individualsDesc"), color: "from-sky-500 to-blue-600" },
                  { icon: Building2, title: t("contact.help.companies"), desc: t("contact.help.companiesDesc"), color: "from-violet-500 to-purple-600" },
                  { icon: Car, title: t("contact.help.drivers"), desc: t("contact.help.driversDesc"), color: "from-amber-500 to-orange-500" },
                ].map((item, i) => (
                  <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} shadow-lg flex items-center justify-center flex-shrink-0`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold font-[Readex_Pro] mb-1 text-foreground">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* HQ Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-sky-brand to-mint-brand text-white overflow-hidden">
                <CardContent className="p-6">
                  <MapPin className="w-8 h-8 text-white/80 mb-3" />
                  <h3 className="text-lg font-bold font-[Readex_Pro] mb-2">{t("contact.hq")}</h3>
                  <p className="text-sm text-white/80">{t("contact.hqAddress")}</p>
                  <p className="text-sm text-white/80 mt-2" dir="ltr">0510660620</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="container">
          <SectionHeading title={t("faq.title")} subtitle={t("faq.subtitle")} />

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <AccordionItem key={n} value={`q${n}`} className="border border-border rounded-xl px-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <AccordionTrigger className="text-sm font-bold font-[Readex_Pro] text-foreground hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-sky-brand flex-shrink-0" />
                      {t(`faq.q${n}`)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                    {t(`faq.a${n}`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
