import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Language = "ar" | "en";

interface LanguageContextType {
  lang: Language;
  dir: "rtl" | "ltr";
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

/* ─── Arabic translations ─── */
const ar: Record<string, string> = {
  // Navbar
  "nav.home": "الرئيسية",
  "nav.services": "خدماتنا",
  "nav.pricing": "الباقات",
  "nav.about": "من نحن",
  "nav.contact": "تواصل معنا",
  "nav.download": "حمّل التطبيق",
  "nav.drivers": "سجّل كسائق",
  "nav.coverage": "مناطق التغطية",

  // Hero
  "hero.badge": "منصة نقل ذكية بالاشتراك الشهري - السوق الإلكتروني + تأجير مركبات + تشغيل خدمات",
  "hero.title1": "نقل ذكي",
  "hero.title2": "وآمن",
  "hero.title3": "مع منصة",
  "hero.title4": "وصلني",
  "hero.desc": "منصة نقل ذكية متكاملة في السعودية تجمع بين السوق الإلكتروني وأسطول مركبات وتشغيل خدمات نقل احترافية. اشترك شهرياً واستمتع بخدمة نقل يومية منظمة وآمنة للموظفين والموظفات والطالبات والمعلمات والشركات.",
  "hero.cta": "ابدأ الآن",
  "hero.services": "تعرّف على خدماتنا",
  "hero.stat1": "مستخدم نشط",
  "hero.stat2": "مسار يومي",
  "hero.stat3": "رضا العملاء",

  // Services section
  "services.title": "خدمات نقل ذكية متكاملة",
  "services.subtitle": "منصة نقل شاملة تجمع بين السوق الإلكتروني وتأجير المركبات وتشغيل خدمات النقل الاحترافية",
  "services.employees.title": "توصيل الموظفين والموظفات",
  "services.employees.desc": "نقل يومي منظم للموظفين والموظفات من وإلى مقر العمل بمسارات محسّنة",
  "services.students.title": "نقل الطالبات والمعلمات",
  "services.students.desc": "توصيل آمن ومراقب للطالبات والمعلمات مع إشعارات فورية لأولياء الأمور",
  "services.corporate.title": "خدمات الشركات والمجموعات",
  "services.corporate.desc": "حلول نقل متكاملة للشركات مع لوحة تحكم وتقارير شاملة ونظام مطابقة ذكي",
  "services.driver.title": "انضم كسائق/سائقة",
  "services.driver.desc": "سجّل بسيارتك أو استأجر مركبة من الشركة واحصل على دخل ثابت",
  "services.airport.title": "استقبال وتوديع المطار",
  "services.airport.desc": "خدمة استقبال وتوديع من وإلى المطار بمواعيد دقيقة وأسعار مناسبة",
  "services.marketplace.title": "السوق الإلكتروني",
  "services.marketplace.desc": "ربط السائقين بالعملاء مباشرة عبر منصة ذكية مع نظام مطابقة متقدم",
  "services.rental.title": "تأجير المركبات",
  "services.rental.desc": "نوفر مركبات متنوعة للسائقين: سيدان، H1، هايس، كوستر",

  // How it works
  "how.title": "كيف تبدأ مع منصة النقل الذكية؟",
  "how.subtitle": "أربع خطوات بسيطة للانضمام لخدمة النقل الذكية بالاشتراك الشهري",
  "how.step1.title": "سجّل حسابك",
  "how.step1.desc": "أنشئ حسابك عبر التطبيق أو الموقع",
  "how.step2.title": "حدد مواقعك",
  "how.step2.desc": "أضف موقع منزلك ومقر عملك أو دراستك",
  "how.step3.title": "اختر جدولك",
  "how.step3.desc": "حدد أيام وأوقات التوصيل المناسبة لك",
  "how.step4.title": "استمتع بالرحلة",
  "how.step4.desc": "تتبع رحلتك مباشرة واصل بأمان",

  // Smart Routes
  "routes.title": "مسارات ذكية محسّنة لتقليل التكاليف والوقت",
  "routes.desc": "منصة وصلني تستخدم نظام مسارات ذكية متقدم يجمع الركاب تلقائياً حسب الموقع والوقت، وينشئ مسارات مشتركة محسّنة تقلل التكاليف والوقت مقارنة بتطبيقات النقل التقليدية.",
  "routes.feature1": "تجميع تلقائي للركاب حسب الموقع",
  "routes.feature2": "مسارات مشتركة محسّنة يومياً",
  "routes.feature3": "نقاط توقف محددة وجدولة ثابتة",
  "routes.feature4": "تحسين مستمر باستخدام الخرائط الذكية",
  "routes.saving": "توفير في التكلفة",
  "routes.optimize": "تحسين المسار",

  // Corporate
  "corporate.badge": "حلول نقل للشركات",
  "corporate.title": "نقل مؤسسي ذكي متكامل",
  "corporate.desc": "منصة نقل مؤسسية توفر للشركات حلول نقل شاملة مع لوحة تحكم ذكية لإدارة موظفيها ومتابعة الرحلات وتقارير الاستخدام والفواتير المركزية.",
  "corporate.f1": "إدارة الموظفين",
  "corporate.f2": "متابعة الرحلات",
  "corporate.f3": "فوترة مركزية",
  "corporate.f4": "تقارير شاملة",

  // Student
  "student.title": "نقل آمن للطالبات والمعلمات",
  "student.desc": "خدمة نقل آمنة ومنظمة للطالبات والمعلمات من وإلى المدارس والجامعات مع نظام تتبع مباشر وإشعارات فورية لأولياء الأمور عند كل مرحلة من رحلة الطالبة.",
  "student.f1": "تتبع مباشر",
  "student.f2": "إشعارات الأهل",
  "student.f3": "سائقون/سائقات موثقون",
  "student.f4": "مواعيد دقيقة",

  // Airport
  "airport.badge": "خدمة استقبال المطار",
  "airport.title": "استقبال وتوديع مريح من المطار",
  "airport.desc": "خدمة نقل مميزة لاستقبال وتوديع المسافرين من وإلى المطار بمواعيد دقيقة وراحة تامة. احجز خدمة المطار مسبقاً واستمتع برحلة مريحة.",
  "airport.f1": "حجز مسبق",
  "airport.f2": "متابعة الرحلات الجوية",
  "airport.f3": "سائقون/سائقات محترفون",
  "airport.f4": "أسعار تنافسية",

  // Safety
  "safety.badge": "أمان الراكبين أولاً",
  "safety.title": "أمان وسلامة الراكبين",
  "safety.desc": "نركز على أمان الراكبين من خلال نظام أمان متكامل يشمل توثيق السائقين والسائقات وسياراتهم الخاصة، والتتبع المباشر، ونظام الطوارئ، وإشعارات فورية لأولياء الأمور.",
  "safety.f1.title": "سائقون/سائقات موثقون",
  "safety.f1.desc": "فحص شامل وتوثيق كامل لكل سائق/سائقة وسيارته",
  "safety.f2.title": "تتبع مباشر",
  "safety.f2.desc": "تتبع الرحلة لحظة بلحظة على الخريطة",
  "safety.f3.title": "إشعارات فورية",
  "safety.f3.desc": "تنبيهات عند الانطلاق والوصول والتأخير",
  "safety.f4.title": "نظام طوارئ",
  "safety.f4.desc": "زر طوارئ مباشر وتواصل فوري مع الدعم",

  // Driver
  "driver.title": "انضم كسائق/سائقة في وصلني",
  "driver.subtitle": "ثلاث طرق للانضمام: بسيارتك الخاصة، أو استأجر مركبة، أو اعمل على سيارات الشركة",
  "driver.step1.title": "سائق بسيارته",
  "driver.step1.desc": "سجّل بسيارتك الخاصة واحصل على مسارات يومية ودخل ثابت",
  "driver.step2.title": "سائق مستأجر",
  "driver.step2.desc": "استأجر مركبة من الشركة (سيدان، H1، هايس، كوستر) بعقد يومي أو أسبوعي أو شهري",
  "driver.step3.title": "سائق الشركة",
  "driver.step3.desc": "اعمل على مركبات أسطول الشركة بعقد تشغيلي مع راتب ثابت",
  "driver.cta": "سجّل كسائق/سائقة الآن",

  // Stats
  "stats.users": "مستخدم نشط",
  "stats.routes": "مسار يومي",
  "stats.drivers": "سائق/سائقة معتمد",
  "stats.companies": "شركة شريكة",

  // CTA
  "cta.badge": "ابدأ رحلتك اليوم",
  "cta.title": "جاهز لتجربة نقل أذكى وأوفر؟",
  "cta.desc": "انضم لآلاف المستخدمين الذين اختاروا وصلني لتنقلهم اليومي. اشترك الآن واستمتع بخدمة نقل منظمة وآمنة.",
  "cta.download": "حمّل التطبيق الآن",
  "cta.contact": "تواصل معنا",

  // Payment
  "payment.title": "وسائل دفع متعددة",
  "payment.subtitle": "ندعم وسائل الدفع المحلية والتقسيط لتسهيل عملية الاشتراك",
  "payment.note": "الشركة المؤسسة هي التي تحاسب السائقين والسائقات",
  "payment.mada": "مدى",
  "payment.apple": "Apple Pay",
  "payment.tabby": "تابي",
  "payment.tamara": "تمارا",

  // Footer
  "footer.desc": "منصة نقل ذكية بالاشتراك الشهري في المملكة العربية السعودية. نوفر خدمات توصيل آمنة ومنظمة بتكلفة مناسبة.",
  "footer.services": "خدماتنا",
  "footer.links": "روابط سريعة",
  "footer.contact": "تواصل معنا",
  "footer.employees": "توصيل الموظفين والموظفات",
  "footer.students": "نقل الطالبات والمعلمات",
  "footer.corporate": "خدمات الشركات",
  "footer.airport": "استقبال وتوديع المطار",
  "footer.joinDriver": "انضم كسائق/سائقة",
  "footer.whatsapp": "واتساب: متاح على مدار الساعة",
  "footer.rights": "جميع الحقوق محفوظة",
  "footer.privacy": "سياسة الخصوصية",
  "footer.terms": "الشروط والأحكام",

  // Pricing page
  "pricing.badge": "الباقات والأسعار",
  "pricing.title": "باقات مرنة تناسب الجميع",
  "pricing.subtitle": "اختر الباقة المناسبة لاحتياجاتك مع خيارات تقسيط عبر تابي وتمارا",
  "pricing.individual": "الباقة الفردية",
  "pricing.individual.desc": "مثالية للموظفين والموظفات",
  "pricing.student": "باقة الطالبات والمعلمات",
  "pricing.student.desc": "مخصصة للمدارس والجامعات",
  "pricing.corporate": "باقة الشركات",
  "pricing.corporate.desc": "حلول نقل مؤسسية متكاملة",
  "pricing.airport": "باقة المطار",
  "pricing.airport.desc": "استقبال وتوديع المسافرين",
  "pricing.subscribe": "اشترك الآن",
  "pricing.contactUs": "تواصل معنا",
  "pricing.monthly": "شهرياً",
  "pricing.perTrip": "للرحلة",
  "pricing.popular": "الأكثر طلباً",
  "pricing.installment": "متاح التقسيط عبر تابي وتمارا",
  "pricing.features": "المميزات",

  // Services page
  "srvPage.badge": "خدماتنا",
  "srvPage.title": "حلول نقل ذكية ومتنوعة",
  "srvPage.subtitle": "نوفر خدمات نقل متكاملة تناسب احتياجات الأفراد والشركات والمؤسسات التعليمية عبر نظام المسارات الذكية",
  "srvPage.emp.badge": "توصيل الموظفين والموظفات",
  "srvPage.emp.title": "نقل يومي منظم للموظفين والموظفات",
  "srvPage.emp.desc": "خدمة توصيل شهرية منظمة من وإلى مقر العمل عبر مسارات ذكية محسّنة. وفّر وقتك وجهدك واستمتع برحلة مريحة كل يوم.",
  "srvPage.emp.f1": "تحديد موقع المنزل والعمل بدقة",
  "srvPage.emp.f2": "جدول مرن يناسب أوقات عملك",
  "srvPage.emp.f3": "مسارات محسّنة تقلل وقت الرحلة",
  "srvPage.emp.f4": "تتبع مباشر لموقع المركبة",
  "srvPage.emp.f5": "إشعارات بوقت الوصول والانطلاق",
  "srvPage.emp.f6": "اشتراك شهري بسيط ومناسب",
  "srvPage.stu.badge": "نقل الطالبات والمعلمات",
  "srvPage.stu.title": "توصيل آمن للطالبات والمعلمات",
  "srvPage.stu.desc": "نقل آمن ومنظم للطالبات والمعلمات من وإلى المدارس والجامعات مع أعلى معايير السلامة. يتلقى أولياء الأمور إشعارات فورية عند كل مرحلة من الرحلة.",
  "srvPage.stu.f1": "أعلى معايير الأمان والسلامة",
  "srvPage.stu.f2": "إشعارات فورية لأولياء الأمور",
  "srvPage.stu.f3": "تتبع مباشر لموقع المركبة",
  "srvPage.stu.f4": "سائقون/سائقات موثقون ومعتمدون",
  "srvPage.stu.f5": "مواعيد دقيقة ومنتظمة",
  "srvPage.stu.f6": "تطبيق سهل لمتابعة الرحلة",
  "srvPage.airport.badge": "خدمة المطار",
  "srvPage.airport.title": "استقبال وتوديع المطار",
  "srvPage.airport.desc": "خدمة مميزة لاستقبال وتوديع المسافرين من وإلى المطار. نوفر سائقين وسائقات محترفين مع متابعة حالة الرحلات الجوية لضمان الوصول في الوقت المناسب.",
  "srvPage.airport.f1": "حجز مسبق سهل عبر التطبيق",
  "srvPage.airport.f2": "متابعة حالة الرحلات الجوية",
  "srvPage.airport.f3": "سائقون/سائقات محترفون",
  "srvPage.airport.f4": "انتظار مجاني عند التأخير",
  "srvPage.airport.f5": "مركبات مريحة ونظيفة",
  "srvPage.airport.f6": "خدمة على مدار الساعة",
  "srvPage.driver.badge": "انضم كسائق/سائقة",
  "srvPage.driver.title": "سجّل بسيارتك الخاصة واربح معنا",
  "srvPage.driver.desc": "انضم لفريق سائقي وسائقات وصلني واحصل على دخل شهري ثابت. كل ما تحتاجه هو سيارتك الخاصة ورخصة قيادة سارية. نوفر لك مسارات يومية منظمة ودعم مستمر.",
  "srvPage.driver.payNote": "الشركة المؤسسة هي التي تحاسب السائقين والسائقات عبر نظام دفع شفاف",
  "srvPage.driver.cta": "سجّل كسائق/سائقة الآن",
  "srvPage.driver.req1": "رخصة قيادة سارية المفعول",
  "srvPage.driver.req2": "سيارة خاصة بحالة جيدة",
  "srvPage.driver.req3": "تأمين ساري على المركبة",
  "srvPage.driver.req4": "استمارة سارية المفعول",
  "srvPage.driver.req5": "هوية وطنية أو إقامة",
  "srvPage.driver.req6": "اجتياز الفحص الأمني",

  // About page
  "about.badge": "من نحن",
  "about.title": "نعيد تعريف النقل اليومي",
  "about.desc": "وصلني منصة نقل ذكية سعودية تهدف لتوفير بديل منظم وآمن وبتكلفة مناسبة لتطبيقات النقل التقليدية، من خلال نظام الاشتراك الشهري والمسارات الذكية.",
  "about.story.title": "قصتنا",
  "about.story.p1": "انطلقت فكرة وصلني من إدراك الحاجة الماسة لنظام نقل يومي منظم وبتكلفة معقولة في المملكة العربية السعودية. لاحظنا أن كثيراً من الموظفين والموظفات والطالبات والمعلمات يعانون من ارتفاع تكاليف التنقل اليومي عبر تطبيقات النقل التقليدية.",
  "about.story.p2": "قررنا بناء منصة تعتمد على مفهوم مختلف تماماً: بدلاً من الطلب الفوري المكلف، نقدم نظام اشتراك شهري مع مسارات ذكية مُحسّنة تجمع الركاب حسب مواقعهم وأوقاتهم، مما يقلل التكلفة بشكل كبير مع الحفاظ على جودة الخدمة والأمان.",
  "about.story.p3": "يعمل سائقونا وسائقاتنا بسياراتهم الخاصة بعد اجتياز فحوصات أمنية شاملة، مما يضمن مرونة عالية وتغطية واسعة مع الحفاظ على أعلى معايير السلامة.",
  "about.mission.title": "رسالتنا",
  "about.mission.desc": "توفير خدمة نقل يومي ذكية وآمنة وبتكلفة مناسبة لجميع شرائح المجتمع في المملكة العربية السعودية، من خلال تقنيات المسارات الذكية والاشتراك الشهري المنظم.",
  "about.vision.title": "رؤيتنا",
  "about.vision.desc": "أن نكون المنصة الرائدة في مجال النقل المجدول بالمملكة العربية السعودية، ونساهم في تحقيق رؤية 2030 من خلال تقديم حلول نقل مستدامة تخدم ملايين المستخدمين.",

  // Contact page
  "contact.badge": "تواصل معنا",
  "contact.title": "نحن هنا لمساعدتك",
  "contact.subtitle": "لديك سؤال أو استفسار؟ فريقنا جاهز لمساعدتك على مدار الساعة",
  "contact.phone.title": "اتصل بنا",
  "contact.phone.info": "0510660620",
  "contact.phone.desc": "متاح من 8 صباحاً - 10 مساءً",
  "contact.email.title": "البريد الإلكتروني",
  "contact.email.info": "info@wasalni.sa",
  "contact.email.desc": "نرد خلال 24 ساعة",
  "contact.whatsapp.title": "واتساب",
  "contact.whatsapp.info": "0510660620",
  "contact.whatsapp.desc": "دعم فوري على مدار الساعة",
  "contact.hours.title": "ساعات العمل",
  "contact.hours.info": "الأحد - الخميس",
  "contact.hours.desc": "8:00 صباحاً - 6:00 مساءً",
  "contact.form.title": "أرسل لنا رسالة",
  "contact.form.subtitle": "املأ النموذج التالي وسنتواصل معك في أقرب وقت",
  "contact.form.name": "الاسم الكامل",
  "contact.form.namePh": "أدخل اسمك الكامل",
  "contact.form.email": "البريد الإلكتروني",
  "contact.form.emailPh": "example@email.com",
  "contact.form.phone": "رقم الجوال",
  "contact.form.phonePh": "05XXXXXXXX",
  "contact.form.type": "نوع الاستفسار",
  "contact.form.type.individual": "اشتراك فردي",
  "contact.form.type.corporate": "خدمات الشركات",
  "contact.form.type.student": "نقل الطالبات والمعلمات",
  "contact.form.type.driver": "التسجيل كسائق/سائقة",
  "contact.form.type.airport": "خدمة المطار",
  "contact.form.type.other": "استفسار آخر",
  "contact.form.message": "الرسالة",
  "contact.form.messagePh": "اكتب رسالتك هنا...",
  "contact.form.submit": "إرسال الرسالة",
  "contact.form.success": "تم إرسال رسالتك بنجاح!",
  "contact.form.successDesc": "سنتواصل معك في أقرب وقت ممكن",
  "contact.help.title": "كيف يمكننا مساعدتك؟",
  "contact.help.desc": "فريقنا مستعد لمساعدتك في أي استفسار. سواء كنت تريد الاشتراك كفرد أو شركة أو الانضمام كسائق/سائقة بسيارتك الخاصة.",
  "contact.help.individuals": "للأفراد",
  "contact.help.individualsDesc": "استفسارات الاشتراك الشهري والمسارات المتاحة",
  "contact.help.companies": "للشركات",
  "contact.help.companiesDesc": "عروض خاصة وحلول نقل مؤسسية متكاملة",
  "contact.help.drivers": "للسائقين والسائقات",
  "contact.help.driversDesc": "التسجيل بسيارتك الخاصة والانضمام لفريقنا",
  "contact.hq": "المقر الرئيسي",
  "contact.hqAddress": "الرياض، المملكة العربية السعودية",

  // FAQ
  "faq.title": "الأسئلة الشائعة",
  "faq.subtitle": "إجابات على أكثر الأسئلة شيوعاً حول خدمات وصلني",
  "faq.q1": "كيف يعمل نظام الاشتراك الشهري؟",
  "faq.a1": "يمكنك الاشتراك شهرياً عبر التطبيق أو الموقع. بعد تحديد مواقعك وجدولك، يتم تخصيص مسار يومي لك مع مجموعة من الركاب في نفس المنطقة. الاشتراك يشمل جميع الرحلات اليومية خلال الشهر.",
  "faq.q2": "هل الخدمة متاحة في جميع مدن السعودية؟",
  "faq.a2": "حالياً نعمل في الرياض والدمام، ونخطط للتوسع لتغطية جدة والمدن الرئيسية الأخرى قريباً. يمكنك التسجيل في قائمة الانتظار لمدينتك.",
  "faq.q3": "كيف يمكنني التسجيل كسائق/سائقة؟",
  "faq.a3": "يمكنك التسجيل كسائق أو سائقة بسيارتك الخاصة عبر التطبيق. تحتاج إلى رخصة قيادة سارية، سيارة بحالة جيدة مع تأمين ساري، واجتياز الفحص الأمني. الشركة المؤسسة هي التي تحاسب السائقين والسائقات.",
  "faq.q4": "ما هي وسائل الدفع المتاحة؟",
  "faq.a4": "ندعم الدفع عبر مدى وApple Pay، بالإضافة إلى خيارات التقسيط عبر تابي وتمارا. يتم خصم الاشتراك الشهري تلقائياً.",
  "faq.q5": "كيف يتم ضمان أمان الرحلات؟",
  "faq.a5": "نضمن الأمان من خلال: توثيق شامل لجميع السائقين والسائقات وسياراتهم، تتبع مباشر لجميع الرحلات، نظام طوارئ فوري، وإشعارات مستمرة لأولياء الأمور.",
  "faq.q6": "هل يمكن للشركات الاشتراك لموظفيها؟",
  "faq.a6": "نعم، نوفر حلول نقل متكاملة للشركات تشمل لوحة تحكم لإدارة الموظفين، تقارير الاستخدام، فوترة مركزية، ومتابعة الرحلات في الوقت الفعلي.",
  "faq.q7": "هل تتوفر خدمة استقبال وتوديع المطار؟",
  "faq.a7": "نعم، نوفر خدمة استقبال وتوديع من وإلى المطار بمواعيد دقيقة مع متابعة حالة الرحلات الجوية. يمكنك الحجز مسبقاً عبر التطبيق.",

  // Platform Model
  "platform.badge": "النموذج المتكامل",
  "platform.title": "منظومة نقل ثلاثية الأبعاد",
  "platform.subtitle": "نمتلك العرض والطلب ونُنظّم السوق في منصة واحدة",
  "platform.marketplace.title": "السوق الإلكتروني",
  "platform.marketplace.desc": "ربط السائقين بالعملاء مباشرة مع نظام مطابقة ذكي يُوزّع الطلبات حسب الموقع والمسار",
  "platform.rental.title": "تأجير المركبات",
  "platform.rental.desc": "نوفر مركبات متنوعة للسائقين بعقود يومية وأسبوعية وشهرية مرنة",
  "platform.operations.title": "تشغيل النقل",
  "platform.operations.desc": "إدارة عقود نقل الشركات والمجموعات بأسطول الشركة وسائقيها المعتمدين",
  "platform.advantage": "الميزة التنافسية: امتلاك العرض (المركبات) والطلب (العملاء) وتنظيم السوق في منصة واحدة",

  // Fleet
  "fleet.badge": "أسطول المركبات",
  "fleet.title": "مركبات متنوعة لكل احتياج",
  "fleet.subtitle": "نوفر مركبات حديثة ومريحة تناسب جميع أنواع الخدمات",
  "fleet.sedan": "سيارة سيدان",
  "fleet.sedan.desc": "مثالية للتوصيل الفردي والموظفين",
  "fleet.sedan.capacity": "4 ركاب",
  "fleet.h1": "هيونداي H1",
  "fleet.h1.desc": "مناسبة للمجموعات الصغيرة والعائلات",
  "fleet.h1.capacity": "8 ركاب",
  "fleet.hiace": "تويوتا هايس",
  "fleet.hiace.desc": "مثالية لنقل الطالبات والموظفين",
  "fleet.hiace.capacity": "14 راكب",
  "fleet.coaster": "كوستر",
  "fleet.coaster.desc": "الأمثل لنقل المجموعات الكبيرة والشركات",
  "fleet.coaster.capacity": "30 راكب",
  "fleet.rental": "متاح للتأجير",
  "fleet.operational": "متاح للتشغيل",

  // Matching System
  "matching.badge": "نظام المطابقة",
  "matching.title": "مطابقة ذكية بين السائقين والطلبات",
  "matching.subtitle": "نظام متقدم يربط بين السائقين والعملاء بأفضل طريقة ممكنة",
  "matching.f1": "مطابقة تلقائية حسب الموقع والمسار",
  "matching.f2": "أولوية لمركبات الشركة عند الحاجة",
  "matching.f3": "توزيع ذكي يقلل التكلفة والوقت",
  "matching.f4": "تحسين مستمر للمسارات والتخصيص",

  // Business Model
  "business.badge": "نموذج الربح",
  "business.title": "نموذج أعمال مستدام",
  "business.commission": "عمولة من السائقين",
  "business.rental": "إيرادات تأجير المركبات",
  "business.contracts": "عقود الشركات",
  "business.subscriptions": "رسوم الاشتراكات",

  // Common
  "common.comingSoon": "قريباً!",
  "common.comingSoonDesc": "سيتم إطلاق التطبيق قريباً",
  "common.driverComingSoon": "سيتم فتح التسجيل للسائقين والسائقات قريباً",
  "common.learnMore": "اعرف المزيد",
  "common.daily": "يومي",
  "common.weekly": "أسبوعي",
  "common.monthly": "شهري",
  "common.passengers": "ركاب",

  // Driver Registration Page
  "driverReg.personalInfo": "البيانات الشخصية",
  "driverReg.selectCity": "اختر المدينة",
  "driverReg.selectVehicle": "اختر نوع المركبة",
  "driverReg.uploadHint": "اضغط لرفع الملف (PDF, JPG, PNG)",
  "driverReg.submitting": "جاري الإرسال...",
  "driverReg.successDesc": "سيتم التواصل معك قريباً",

  // Coverage Map Page
  "coverage.expansion": "خطة التوسع المستقبلية",
  "coverage.expansionDesc": "نحن نعمل على توسيع خدماتنا لتغطية جميع مدن المملكة. يمكنك الاشتراك في قائمة الانتظار للمدن القادمة قريباً",
};

/* ─── English translations ─── */
const en: Record<string, string> = {
  // Navbar
  "nav.home": "Home",
  "nav.services": "Services",
  "nav.pricing": "Pricing",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.download": "Download App",
  "nav.drivers": "Register as Driver",
  "nav.coverage": "Coverage Areas",

  // Hero
  "hero.badge": "Integrated Smart Transport Ecosystem in Saudi Arabia",
  "hero.title1": "Your Daily Commute",
  "hero.title2": "Smarter",
  "hero.title3": "& Cheaper with",
  "hero.title4": "Wasalni",
  "hero.desc": "An integrated transport ecosystem combining marketplace, vehicle fleet, and transport operations. Subscribe monthly and enjoy organized daily transport for employees, students, and teachers.",
  "hero.cta": "Get Started",
  "hero.services": "Explore Services",
  "hero.stat1": "Active Users",
  "hero.stat2": "Daily Routes",
  "hero.stat3": "Satisfaction",

  // Services section
  "services.title": "Integrated Transport Ecosystem",
  "services.subtitle": "Combining marketplace, vehicle fleet, and transport operations in one platform",
  "services.employees.title": "Employee Transportation",
  "services.employees.desc": "Organized daily transport for employees to and from work via optimized routes",
  "services.students.title": "Student & Teacher Transport",
  "services.students.desc": "Safe and monitored transport for students and teachers with real-time notifications",
  "services.corporate.title": "Corporate & Group Solutions",
  "services.corporate.desc": "Comprehensive transport solutions for companies with dashboard, reports, and smart matching",
  "services.driver.title": "Join as Driver",
  "services.driver.desc": "Register with your car or rent a vehicle from us and earn a steady income",
  "services.airport.title": "Airport Pickup & Drop-off",
  "services.airport.desc": "Airport pickup and drop-off service with precise timing and competitive prices",
  "services.marketplace.title": "Driver Marketplace",
  "services.marketplace.desc": "Connect drivers with clients directly through a smart platform with advanced matching",
  "services.rental.title": "Vehicle Rental",
  "services.rental.desc": "We provide diverse vehicles for drivers: Sedan, H1, Hiace, Coaster",

  // How it works
  "how.title": "How Wasalni Works?",
  "how.subtitle": "Four simple steps to start using the smart transport service",
  "how.step1.title": "Create Account",
  "how.step1.desc": "Sign up via the app or website",
  "how.step2.title": "Set Locations",
  "how.step2.desc": "Add your home and work or school location",
  "how.step3.title": "Choose Schedule",
  "how.step3.desc": "Select your preferred days and times",
  "how.step4.title": "Enjoy the Ride",
  "how.step4.desc": "Track your trip live and arrive safely",

  // Smart Routes
  "routes.title": "Optimized Routes Reduce Cost & Time",
  "routes.desc": "Wasalni uses a smart routing system that automatically groups passengers by location and time, creating optimized shared routes that reduce distance and cost compared to traditional ride-hailing apps.",
  "routes.feature1": "Automatic passenger grouping by location",
  "routes.feature2": "Daily optimized shared routes",
  "routes.feature3": "Fixed stops and scheduling",
  "routes.feature4": "Continuous optimization using smart maps",
  "routes.saving": "Cost Savings",
  "routes.optimize": "Route Optimization",

  // Corporate
  "corporate.badge": "Corporate Solutions",
  "corporate.title": "Integrated Corporate Transport",
  "corporate.desc": "We provide companies and institutions with comprehensive transport solutions including an advanced dashboard for employee management, trip tracking, usage reports, and invoicing.",
  "corporate.f1": "Employee Management",
  "corporate.f2": "Trip Tracking",
  "corporate.f3": "Centralized Billing",
  "corporate.f4": "Comprehensive Reports",

  // Student
  "student.title": "Safe & Monitored Transport",
  "student.desc": "Safe and organized transport for students and teachers to and from schools and universities with live tracking and instant notifications for parents at every stage of the trip.",
  "student.f1": "Live Tracking",
  "student.f2": "Parent Notifications",
  "student.f3": "Verified Drivers",
  "student.f4": "Precise Timing",

  // Airport
  "airport.badge": "Airport Service",
  "airport.title": "Airport Pickup & Drop-off",
  "airport.desc": "Premium airport pickup and drop-off service for travelers with precise timing and complete comfort. Book in advance and enjoy a comfortable ride.",
  "airport.f1": "Easy Pre-booking",
  "airport.f2": "Flight Status Tracking",
  "airport.f3": "Professional Drivers",
  "airport.f4": "Competitive Prices",

  // Safety
  "safety.badge": "Safety First",
  "safety.title": "Your Safety is Our Priority",
  "safety.desc": "We prioritize safety through a comprehensive system including driver verification, live tracking, emergency system, and instant notifications for parents.",
  "safety.f1.title": "Verified Drivers",
  "safety.f1.desc": "Thorough background checks for every driver and vehicle",
  "safety.f2.title": "Live Tracking",
  "safety.f2.desc": "Track the trip moment by moment on the map",
  "safety.f3.title": "Instant Notifications",
  "safety.f3.desc": "Alerts on departure, arrival, and delays",
  "safety.f4.title": "Emergency System",
  "safety.f4.desc": "Direct emergency button and instant support contact",

  // Driver
  "driver.title": "Join Wasalni as a Driver",
  "driver.subtitle": "Three ways to join: your own car, rent a vehicle, or work on company fleet",
  "driver.step1.title": "Own Car Driver",
  "driver.step1.desc": "Register with your own car and get daily routes with steady income",
  "driver.step2.title": "Rental Driver",
  "driver.step2.desc": "Rent a vehicle from us (Sedan, H1, Hiace, Coaster) on daily, weekly, or monthly plans",
  "driver.step3.title": "Company Driver",
  "driver.step3.desc": "Work on company fleet vehicles with an operational contract and fixed salary",
  "driver.cta": "Register as Driver Now",

  // Stats
  "stats.users": "Active Users",
  "stats.routes": "Daily Routes",
  "stats.drivers": "Verified Drivers",
  "stats.companies": "Partner Companies",

  // CTA
  "cta.badge": "Start Your Journey Today",
  "cta.title": "Ready for Smarter & Cheaper Transport?",
  "cta.desc": "Join thousands of users who chose Wasalni for their daily commute. Subscribe now and enjoy organized, safe transportation.",
  "cta.download": "Download App Now",
  "cta.contact": "Contact Us",

  // Payment
  "payment.title": "Multiple Payment Methods",
  "payment.subtitle": "We support local payment methods and installments for easy subscription",
  "payment.note": "The founding company handles all driver payments",
  "payment.mada": "Mada",
  "payment.apple": "Apple Pay",
  "payment.tabby": "Tabby",
  "payment.tamara": "Tamara",

  // Footer
  "footer.desc": "A smart monthly subscription transport platform in Saudi Arabia. We provide safe and organized transportation services at affordable costs.",
  "footer.services": "Our Services",
  "footer.links": "Quick Links",
  "footer.contact": "Contact Us",
  "footer.employees": "Employee Transportation",
  "footer.students": "Student & Teacher Transport",
  "footer.corporate": "Corporate Solutions",
  "footer.airport": "Airport Pickup & Drop-off",
  "footer.joinDriver": "Join as Driver",
  "footer.whatsapp": "WhatsApp: Available 24/7",
  "footer.rights": "All rights reserved",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms & Conditions",

  // Pricing page
  "pricing.badge": "Plans & Pricing",
  "pricing.title": "Flexible Plans for Everyone",
  "pricing.subtitle": "Choose the right plan for your needs with installment options via Tabby and Tamara",
  "pricing.individual": "Individual Plan",
  "pricing.individual.desc": "Perfect for employees",
  "pricing.student": "Student & Teacher Plan",
  "pricing.student.desc": "Designed for schools and universities",
  "pricing.corporate": "Corporate Plan",
  "pricing.corporate.desc": "Integrated corporate transport solutions",
  "pricing.airport": "Airport Plan",
  "pricing.airport.desc": "Traveler pickup and drop-off",
  "pricing.subscribe": "Subscribe Now",
  "pricing.contactUs": "Contact Us",
  "pricing.monthly": "Monthly",
  "pricing.perTrip": "Per Trip",
  "pricing.popular": "Most Popular",
  "pricing.installment": "Installments available via Tabby & Tamara",
  "pricing.features": "Features",

  // Services page
  "srvPage.badge": "Our Services",
  "srvPage.title": "Smart & Diverse Transport Solutions",
  "srvPage.subtitle": "We provide comprehensive transport services for individuals, companies, and educational institutions through smart routing",
  "srvPage.emp.badge": "Employee Transportation",
  "srvPage.emp.title": "Organized Daily Employee Transport",
  "srvPage.emp.desc": "Monthly organized transport to and from work via optimized smart routes. Save time and effort and enjoy a comfortable ride every day.",
  "srvPage.emp.f1": "Precise home and work location",
  "srvPage.emp.f2": "Flexible schedule for your work hours",
  "srvPage.emp.f3": "Optimized routes reduce trip time",
  "srvPage.emp.f4": "Live vehicle tracking",
  "srvPage.emp.f5": "Arrival and departure notifications",
  "srvPage.emp.f6": "Simple monthly subscription",
  "srvPage.stu.badge": "Student & Teacher Transport",
  "srvPage.stu.title": "Safe Transport for Students & Teachers",
  "srvPage.stu.desc": "Safe and organized transport for students and teachers to and from schools and universities with the highest safety standards. Parents receive instant notifications at every stage.",
  "srvPage.stu.f1": "Highest safety and security standards",
  "srvPage.stu.f2": "Instant parent notifications",
  "srvPage.stu.f3": "Live vehicle tracking",
  "srvPage.stu.f4": "Verified and approved drivers",
  "srvPage.stu.f5": "Precise and regular timing",
  "srvPage.stu.f6": "Easy app for trip tracking",
  "srvPage.airport.badge": "Airport Service",
  "srvPage.airport.title": "Airport Pickup & Drop-off",
  "srvPage.airport.desc": "Premium airport pickup and drop-off service. We provide professional drivers with flight status tracking to ensure timely arrival.",
  "srvPage.airport.f1": "Easy pre-booking via app",
  "srvPage.airport.f2": "Flight status tracking",
  "srvPage.airport.f3": "Professional drivers",
  "srvPage.airport.f4": "Free waiting on delays",
  "srvPage.airport.f5": "Comfortable and clean vehicles",
  "srvPage.airport.f6": "24/7 service",
  "srvPage.driver.badge": "Join as Driver",
  "srvPage.driver.title": "Register Your Car & Earn with Us",
  "srvPage.driver.desc": "Join the Wasalni driver team and earn a steady monthly income. All you need is your own car and a valid driving license. We provide organized daily routes and continuous support.",
  "srvPage.driver.payNote": "The founding company handles all driver payments through a transparent system",
  "srvPage.driver.cta": "Register as Driver Now",
  "srvPage.driver.req1": "Valid driving license",
  "srvPage.driver.req2": "Car in good condition",
  "srvPage.driver.req3": "Valid vehicle insurance",
  "srvPage.driver.req4": "Valid vehicle registration",
  "srvPage.driver.req5": "National ID or residency",
  "srvPage.driver.req6": "Pass security check",

  // About page
  "about.badge": "About Us",
  "about.title": "Redefining Daily Transportation",
  "about.desc": "Wasalni is a Saudi smart transport platform that aims to provide an organized, safe, and affordable alternative to traditional ride-hailing apps through monthly subscriptions and smart routes.",
  "about.story.title": "Our Story",
  "about.story.p1": "Wasalni was born from recognizing the urgent need for an organized and affordable daily transport system in Saudi Arabia. We noticed that many employees, students, and teachers suffer from high daily commuting costs through traditional ride-hailing apps.",
  "about.story.p2": "We decided to build a platform based on a completely different concept: instead of expensive on-demand rides, we offer a monthly subscription with optimized smart routes that group passengers by location and time, significantly reducing costs while maintaining service quality and safety.",
  "about.story.p3": "Our drivers work with their own cars after passing comprehensive security checks, ensuring high flexibility and wide coverage while maintaining the highest safety standards.",
  "about.mission.title": "Our Mission",
  "about.mission.desc": "To provide a smart, safe, and affordable daily transport service for all segments of society in Saudi Arabia through smart routing technology and organized monthly subscriptions.",
  "about.vision.title": "Our Vision",
  "about.vision.desc": "To be the leading platform in scheduled transportation in Saudi Arabia, contributing to Vision 2030 by providing sustainable transport solutions serving millions of users.",

  // Contact page
  "contact.badge": "Contact Us",
  "contact.title": "We're Here to Help",
  "contact.subtitle": "Have a question? Our team is ready to help you around the clock",
  "contact.phone.title": "Call Us",
  "contact.phone.info": "0510660620",
  "contact.phone.desc": "Available 8 AM - 10 PM",
  "contact.email.title": "Email",
  "contact.email.info": "info@wasalni.sa",
  "contact.email.desc": "We reply within 24 hours",
  "contact.whatsapp.title": "WhatsApp",
  "contact.whatsapp.info": "0510660620",
  "contact.whatsapp.desc": "Instant support 24/7",
  "contact.hours.title": "Working Hours",
  "contact.hours.info": "Sunday - Thursday",
  "contact.hours.desc": "8:00 AM - 6:00 PM",
  "contact.form.title": "Send Us a Message",
  "contact.form.subtitle": "Fill the form below and we'll get back to you soon",
  "contact.form.name": "Full Name",
  "contact.form.namePh": "Enter your full name",
  "contact.form.email": "Email",
  "contact.form.emailPh": "example@email.com",
  "contact.form.phone": "Phone Number",
  "contact.form.phonePh": "05XXXXXXXX",
  "contact.form.type": "Inquiry Type",
  "contact.form.type.individual": "Individual Subscription",
  "contact.form.type.corporate": "Corporate Services",
  "contact.form.type.student": "Student & Teacher Transport",
  "contact.form.type.driver": "Register as Driver",
  "contact.form.type.airport": "Airport Service",
  "contact.form.type.other": "Other Inquiry",
  "contact.form.message": "Message",
  "contact.form.messagePh": "Write your message here...",
  "contact.form.submit": "Send Message",
  "contact.form.success": "Message sent successfully!",
  "contact.form.successDesc": "We'll get back to you as soon as possible",
  "contact.help.title": "How Can We Help?",
  "contact.help.desc": "Our team is ready to help with any inquiry. Whether you want to subscribe, join as a driver, or need corporate solutions.",
  "contact.help.individuals": "For Individuals",
  "contact.help.individualsDesc": "Monthly subscription and route inquiries",
  "contact.help.companies": "For Companies",
  "contact.help.companiesDesc": "Special offers and corporate transport solutions",
  "contact.help.drivers": "For Drivers",
  "contact.help.driversDesc": "Register with your car and join our team",
  "contact.hq": "Headquarters",
  "contact.hqAddress": "Riyadh, Saudi Arabia",

  // FAQ
  "faq.title": "Frequently Asked Questions",
  "faq.subtitle": "Answers to the most common questions about Wasalni services",
  "faq.q1": "How does the monthly subscription work?",
  "faq.a1": "You can subscribe monthly via the app or website. After setting your locations and schedule, a daily route is assigned with a group of passengers in your area. The subscription covers all daily trips during the month.",
  "faq.q2": "Is the service available in all Saudi cities?",
  "faq.a2": "Currently we operate in Riyadh and Dammam, with plans to expand to Jeddah and other major cities soon. You can join the waitlist for your city.",
  "faq.q3": "How can I register as a driver?",
  "faq.a3": "You can register as a driver with your own car via the app. You need a valid driving license, a car in good condition with valid insurance, and pass the security check. The founding company handles all driver payments.",
  "faq.q4": "What payment methods are available?",
  "faq.a4": "We support Mada and Apple Pay, plus installment options through Tabby and Tamara. The monthly subscription is charged automatically.",
  "faq.q5": "How is trip safety ensured?",
  "faq.a5": "We ensure safety through comprehensive driver and vehicle verification, live tracking for all trips, instant emergency system, and continuous notifications for parents.",
  "faq.q6": "Can companies subscribe for their employees?",
  "faq.a6": "Yes, we provide comprehensive corporate transport solutions including employee management dashboard, usage reports, centralized billing, and real-time trip tracking.",
  "faq.q7": "Is airport pickup & drop-off available?",
  "faq.a7": "Yes, we provide airport pickup and drop-off service with precise timing and flight status tracking. You can book in advance via the app.",

  // Platform Model
  "platform.badge": "Integrated Model",
  "platform.title": "Three-Dimensional Transport Ecosystem",
  "platform.subtitle": "We own supply and demand, organizing the market in one platform",
  "platform.marketplace.title": "Marketplace",
  "platform.marketplace.desc": "Connect drivers with clients directly through a smart matching system by location and route",
  "platform.rental.title": "Vehicle Rental",
  "platform.rental.desc": "Diverse vehicles for drivers with flexible daily, weekly, and monthly rental plans",
  "platform.operations.title": "Transport Operations",
  "platform.operations.desc": "Managing corporate and group transport contracts with company fleet and certified drivers",
  "platform.advantage": "Competitive Advantage: Owning supply (vehicles) and demand (customers) while organizing the market in one platform",

  // Fleet
  "fleet.badge": "Vehicle Fleet",
  "fleet.title": "Diverse Vehicles for Every Need",
  "fleet.subtitle": "Modern and comfortable vehicles for all service types",
  "fleet.sedan": "Sedan Car",
  "fleet.sedan.desc": "Ideal for individual and employee transport",
  "fleet.sedan.capacity": "4 Passengers",
  "fleet.h1": "Hyundai H1",
  "fleet.h1.desc": "Perfect for small groups and families",
  "fleet.h1.capacity": "8 Passengers",
  "fleet.hiace": "Toyota Hiace",
  "fleet.hiace.desc": "Ideal for student and employee transport",
  "fleet.hiace.capacity": "14 Passengers",
  "fleet.coaster": "Coaster Bus",
  "fleet.coaster.desc": "Best for large groups and corporate transport",
  "fleet.coaster.capacity": "30 Passengers",
  "fleet.rental": "Available for Rental",
  "fleet.operational": "Available for Operations",

  // Matching System
  "matching.badge": "Matching System",
  "matching.title": "Smart Driver-Request Matching",
  "matching.subtitle": "Advanced system connecting drivers with clients in the best possible way",
  "matching.f1": "Automatic matching by location and route",
  "matching.f2": "Priority for company vehicles when needed",
  "matching.f3": "Smart allocation reducing cost and time",
  "matching.f4": "Continuous route and assignment optimization",

  // Business Model
  "business.badge": "Business Model",
  "business.title": "Sustainable Business Model",
  "business.commission": "Driver Commission",
  "business.rental": "Vehicle Rental Revenue",
  "business.contracts": "Corporate Contracts",
  "business.subscriptions": "Subscription Fees",

  // Common
  "common.comingSoon": "Coming Soon!",
  "common.comingSoonDesc": "The app will be launched soon",
  "common.driverComingSoon": "Driver registration will open soon",
  "common.learnMore": "Learn More",
  "common.daily": "Daily",
  "common.weekly": "Weekly",
  "common.monthly": "Monthly",
  "common.passengers": "Passengers",

  // Driver Registration Page
  "driverReg.personalInfo": "Personal Information",
  "driverReg.selectCity": "Select City",
  "driverReg.selectVehicle": "Select Vehicle Type",
  "driverReg.uploadHint": "Click to upload file (PDF, JPG, PNG)",
  "driverReg.submitting": "Submitting...",
  "driverReg.successDesc": "We will contact you soon",

  // Coverage Map Page
  "coverage.expansion": "Future Expansion Plan",
  "coverage.expansionDesc": "We are working to expand our services to cover all cities in the Kingdom. You can join the waitlist for upcoming cities",
};

const translations: Record<Language, Record<string, string>> = { ar, en };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("wasalni-lang") as Language) || "ar";
    }
    return "ar";
  });

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next = prev === "ar" ? "en" : "ar";
      localStorage.setItem("wasalni-lang", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string) => translations[lang][key] || key,
    [lang],
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
