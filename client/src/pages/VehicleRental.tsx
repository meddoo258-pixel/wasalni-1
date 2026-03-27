/**
 * Vehicle Rental Page - صفحة تأجير المركبات
 * Displays available vehicles with rental request form
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Car, Users, CheckCircle, Phone, Mail, MapPin,
  Calendar, Star, Shield, Clock, Fuel, Settings,
  ArrowLeft, ArrowRight, ChevronRight
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

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

const vehicles = {
  ar: [
    {
      id: "sedan",
      name: "سيدان",
      model: "تويوتا كامري / هيونداي سوناتا",
      capacity: 4,
      features: ["مكيف هواء", "GPS", "مقاعد جلدية", "شاشة ترفيه"],
      ideal: "الرحلات الفردية والعائلية الصغيرة",
      color: "from-sky-500 to-blue-600",
      icon: Car,
    },
    {
      id: "h1",
      name: "هيونداي H1",
      model: "هيونداي H1 2023",
      capacity: 8,
      features: ["مكيف هواء مزدوج", "GPS", "مقاعد فاخرة", "تلفزيون"],
      ideal: "نقل الموظفين والمجموعات الصغيرة",
      color: "from-emerald-500 to-teal-600",
      icon: Car,
    },
    {
      id: "hiace",
      name: "تويوتا هايس",
      model: "تويوتا هايس 2023",
      capacity: 14,
      features: ["مكيف هواء قوي", "GPS", "مقاعد مريحة", "تهوية ممتازة"],
      ideal: "نقل الفرق والمجموعات المتوسطة",
      color: "from-violet-500 to-purple-600",
      icon: Car,
    },
    {
      id: "coaster",
      name: "كوستر",
      model: "تويوتا كوستر 2023",
      capacity: 30,
      features: ["مكيف هواء مركزي", "GPS", "مقاعد مبطنة", "نوافذ بانورامية"],
      ideal: "نقل الموظفين والطلاب بالجملة",
      color: "from-amber-500 to-orange-600",
      icon: Car,
    },
  ],
  en: [
    {
      id: "sedan",
      name: "Sedan",
      model: "Toyota Camry / Hyundai Sonata",
      capacity: 4,
      features: ["Air Conditioning", "GPS", "Leather Seats", "Entertainment Screen"],
      ideal: "Individual and small family trips",
      color: "from-sky-500 to-blue-600",
      icon: Car,
    },
    {
      id: "h1",
      name: "Hyundai H1",
      model: "Hyundai H1 2023",
      capacity: 8,
      features: ["Dual AC", "GPS", "Luxury Seats", "TV"],
      ideal: "Employee transport and small groups",
      color: "from-emerald-500 to-teal-600",
      icon: Car,
    },
    {
      id: "hiace",
      name: "Toyota Hiace",
      model: "Toyota Hiace 2023",
      capacity: 14,
      features: ["Powerful AC", "GPS", "Comfortable Seats", "Excellent Ventilation"],
      ideal: "Teams and medium-sized groups",
      color: "from-violet-500 to-purple-600",
      icon: Car,
    },
    {
      id: "coaster",
      name: "Coaster",
      model: "Toyota Coaster 2023",
      capacity: 30,
      features: ["Central AC", "GPS", "Padded Seats", "Panoramic Windows"],
      ideal: "Bulk employee and student transport",
      color: "from-amber-500 to-orange-600",
      icon: Car,
    },
  ],
};

export default function VehicleRental() {
  const { lang } = useLanguage();
  const ArrowIcon = lang === "ar" ? ArrowLeft : ArrowRight;
  const isAr = lang === "ar";
  const vehicleList = vehicles[lang as "ar" | "en"] || vehicles.ar;

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    vehicleType: "",
    rentalPurpose: "",
    startDate: "",
    endDate: "",
    pickupLocation: "",
    notes: "",
  });

  const rentalMutation = trpc.rental.submitRequest.useMutation({
    onSuccess: () => {
      toast.success(isAr ? "تم إرسال طلبك بنجاح!" : "Request submitted successfully!", {
        description: isAr ? "سيتواصل معك فريقنا خلال 24 ساعة." : "Our team will contact you within 24 hours.",
      });
      setFormData({ fullName: "", phone: "", email: "", vehicleType: "", rentalPurpose: "", startDate: "", endDate: "", pickupLocation: "", notes: "" });
      setSelectedVehicle("");
    },
    onError: (err) => {
      toast.error(isAr ? "حدث خطأ" : "Error occurred", { description: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.vehicleType || !formData.startDate || !formData.endDate) {
      toast.error(isAr ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }
    rentalMutation.mutate(formData as Parameters<typeof rentalMutation.mutate>[0]);
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    setFormData(prev => ({ ...prev, vehicleType: vehicleId }));
    document.getElementById("rental-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative py-24 bg-gradient-to-br from-sky-50 via-white to-amber-50/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Car className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-600">{isAr ? "أسطول متنوع ومعتمد" : "Diverse & Certified Fleet"}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-[Readex_Pro] mb-6 text-foreground leading-tight">
              {isAr ? (
                <><span className="gradient-text">تأجير المركبات</span> بأعلى معايير الجودة</>
              ) : (
                <><span className="gradient-text">Vehicle Rental</span> with Highest Quality Standards</>
              )}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {isAr
                ? "أسطول متنوع من المركبات المعتمدة لتلبية احتياجاتك سواء كانت رحلة فردية أو نقل جماعي للموظفين والطلاب."
                : "A diverse fleet of certified vehicles to meet your needs, whether for individual trips or bulk transport for employees and students."}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: Shield, label: isAr ? "مركبات مؤمّنة" : "Insured Vehicles" },
                { icon: Star, label: isAr ? "سائقون معتمدون" : "Certified Drivers" },
                { icon: Clock, label: isAr ? "خدمة 24/7" : "24/7 Service" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="w-4 h-4 text-sky-brand" />
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== VEHICLES GRID ===== */}
      <section className="py-24 bg-background">
        <div className="container">
          <SectionHeading
            title={isAr ? "أسطولنا من المركبات" : "Our Vehicle Fleet"}
            subtitle={isAr ? "اختر المركبة المناسبة لاحتياجاتك" : "Choose the right vehicle for your needs"}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicleList.map((vehicle, i) => (
              <motion.div key={vehicle.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Card
                  className={`h-full border-2 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer bg-white ${selectedVehicle === vehicle.id ? "border-sky-brand" : "border-transparent"}`}
                  onClick={() => handleVehicleSelect(vehicle.id)}
                >
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${vehicle.color} shadow-lg flex items-center justify-center mb-5`}>
                      <vehicle.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold font-[Readex_Pro] mb-1 text-foreground">{vehicle.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{vehicle.model}</p>
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-sky-brand/10">
                      <Users className="w-4 h-4 text-sky-brand" />
                      <span className="text-sm font-medium text-sky-brand">{isAr ? `${vehicle.capacity} راكب` : `${vehicle.capacity} Passengers`}</span>
                    </div>
                    <div className="space-y-2 mb-5">
                      {vehicle.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-3">{isAr ? "مثالي لـ:" : "Ideal for:"} {vehicle.ideal}</p>
                      <Button
                        size="sm"
                        className={`w-full gap-2 ${selectedVehicle === vehicle.id ? "bg-gradient-to-r from-sky-brand to-mint-brand text-white border-0" : ""}`}
                        variant={selectedVehicle === vehicle.id ? "default" : "outline"}
                      >
                        {selectedVehicle === vehicle.id ? (isAr ? "تم الاختيار ✓" : "Selected ✓") : (isAr ? "اختر هذه المركبة" : "Select Vehicle")}
                        {selectedVehicle !== vehicle.id && <ChevronRight className="w-3 h-3" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY WASALNI RENTAL ===== */}
      <section className="py-20 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container">
          <SectionHeading
            title={isAr ? "لماذا تأجير وصلني؟" : "Why Wasalni Rental?"}
            subtitle={isAr ? "مزايا تجعل تجربة التأجير استثنائية" : "Benefits that make your rental experience exceptional"}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: isAr ? "تأمين شامل" : "Full Insurance", desc: isAr ? "جميع مركباتنا مؤمّنة تأميناً شاملاً لضمان سلامتك وراحة بالك" : "All our vehicles are fully insured for your safety and peace of mind", color: "from-sky-500 to-blue-600" },
              { icon: Star, title: isAr ? "سائقون محترفون" : "Professional Drivers", desc: isAr ? "سائقون معتمدون بخبرة واسعة وسجل نظيف وتدريب على خدمة العملاء" : "Certified drivers with extensive experience and customer service training", color: "from-emerald-500 to-teal-600" },
              { icon: Clock, title: isAr ? "الدقة في المواعيد" : "Punctuality", desc: isAr ? "نلتزم بالمواعيد المحددة مع نظام تتبع فوري لضمان وصولك في الوقت المناسب" : "We commit to scheduled times with real-time tracking to ensure timely arrival", color: "from-violet-500 to-purple-600" },
              { icon: Fuel, title: isAr ? "مركبات حديثة" : "Modern Vehicles", desc: isAr ? "أسطول من المركبات الحديثة المُصانة بانتظام لضمان أعلى مستوى من الراحة" : "Fleet of modern, regularly maintained vehicles for maximum comfort", color: "from-amber-500 to-orange-600" },
              { icon: Settings, title: isAr ? "خدمة مخصصة" : "Customized Service", desc: isAr ? "نصمم حلول النقل وفق احتياجاتك الخاصة سواء كانت يومية أو أسبوعية أو شهرية" : "We design transport solutions tailored to your specific needs", color: "from-rose-500 to-pink-600" },
              { icon: Phone, title: isAr ? "دعم على مدار الساعة" : "24/7 Support", desc: isAr ? "فريق دعم متاح على مدار الساعة للتعامل مع أي طارئ أو استفسار" : "Support team available 24/7 to handle any emergency or inquiry", color: "from-indigo-500 to-blue-600" },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="flex gap-4 p-5 rounded-2xl bg-white shadow-md border border-border/50 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RENTAL REQUEST FORM ===== */}
      <section id="rental-form" className="py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              title={isAr ? "طلب تأجير مركبة" : "Vehicle Rental Request"}
              subtitle={isAr ? "أرسل طلبك وسيتواصل معك فريقنا خلال 24 ساعة" : "Submit your request and our team will contact you within 24 hours"}
            />
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-[Readex_Pro] text-foreground">
                  {isAr ? "بيانات طلب التأجير" : "Rental Request Details"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{isAr ? "الاسم الكامل *" : "Full Name *"}</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                        placeholder={isAr ? "أدخل اسمك الكامل" : "Enter your full name"}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{isAr ? "رقم الجوال *" : "Phone Number *"}</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        placeholder="05XXXXXXXX"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{isAr ? "البريد الإلكتروني" : "Email Address"}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      placeholder={isAr ? "example@email.com" : "example@email.com"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">{isAr ? "نوع المركبة *" : "Vehicle Type *"}</Label>
                    <Select
                      value={formData.vehicleType}
                      onValueChange={v => setFormData(p => ({ ...p, vehicleType: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isAr ? "اختر نوع المركبة" : "Select vehicle type"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedan">{isAr ? "سيدان (4 ركاب)" : "Sedan (4 passengers)"}</SelectItem>
                        <SelectItem value="h1">{isAr ? "هيونداي H1 (8 ركاب)" : "Hyundai H1 (8 passengers)"}</SelectItem>
                        <SelectItem value="hiace">{isAr ? "تويوتا هايس (14 راكب)" : "Toyota Hiace (14 passengers)"}</SelectItem>
                        <SelectItem value="coaster">{isAr ? "كوستر (30 راكب)" : "Coaster (30 passengers)"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rentalPurpose">{isAr ? "الغرض من التأجير" : "Rental Purpose"}</Label>
                    <Input
                      id="rentalPurpose"
                      value={formData.rentalPurpose}
                      onChange={e => setFormData(p => ({ ...p, rentalPurpose: e.target.value }))}
                      placeholder={isAr ? "مثال: نقل موظفين، رحلة مدرسية..." : "e.g., employee transport, school trip..."}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">{isAr ? "تاريخ البدء *" : "Start Date *"}</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">{isAr ? "تاريخ الانتهاء *" : "End Date *"}</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">{isAr ? "موقع الاستلام" : "Pickup Location"}</Label>
                    <Input
                      id="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={e => setFormData(p => ({ ...p, pickupLocation: e.target.value }))}
                      placeholder={isAr ? "أدخل عنوان الاستلام" : "Enter pickup address"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">{isAr ? "ملاحظات إضافية" : "Additional Notes"}</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                      placeholder={isAr ? "أي متطلبات خاصة أو ملاحظات..." : "Any special requirements or notes..."}
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-sky-brand to-mint-brand text-white border-0 shadow-lg hover:shadow-sky-brand/30 hover:scale-[1.02] transition-all duration-300 gap-2"
                    disabled={rentalMutation.isPending}
                  >
                    {rentalMutation.isPending
                      ? (isAr ? "جاري الإرسال..." : "Submitting...")
                      : (isAr ? "إرسال طلب التأجير" : "Submit Rental Request")}
                    <ArrowIcon className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Phone, label: isAr ? "اتصل بنا" : "Call Us", value: "0510660620" },
                { icon: Mail, label: isAr ? "البريد الإلكتروني" : "Email", value: "rental@wasalni.cam" },
                { icon: MapPin, label: isAr ? "الموقع" : "Location", value: isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border border-border/50">
                  <item.icon className="w-5 h-5 text-sky-brand flex-shrink-0" />
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
    </div>
  );
}
