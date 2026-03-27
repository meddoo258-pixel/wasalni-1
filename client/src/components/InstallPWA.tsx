/**
 * InstallPWA - زر تثبيت التطبيق على الجهاز
 * يظهر تلقائياً عند توفر حدث beforeinstallprompt (Android/Chrome)
 * ويعرض تعليمات iOS للأجهزة Apple
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, Plus, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem("pwa-banner-dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed);
      const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return; // Don't show for 7 days after dismiss
    }

    // Detect iOS
    const ua = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) && !(window as { MSStream?: unknown }).MSStream;
    setIsIOS(iOS);

    if (iOS) {
      // Show iOS install guide after 3 seconds
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    // Android/Chrome: listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      setShowBanner(false);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem("pwa-banner-dismissed", Date.now().toString());
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Install Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 safe-area-bottom"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-sky-brand/20 p-4 max-w-sm mx-auto">
              <div className="flex items-start gap-3">
                {/* App Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-brand to-mint-brand flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Smartphone className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-foreground text-sm">ثبّت تطبيق وصلني</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        أضف التطبيق لشاشتك الرئيسية للوصول السريع
                      </p>
                    </div>
                    <button
                      onClick={handleDismiss}
                      className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={handleInstall}
                      className="flex-1 bg-gradient-to-r from-sky-brand to-mint-brand text-white border-0 text-xs h-8 gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      تثبيت الآن
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDismiss}
                      className="text-xs h-8 px-3"
                    >
                      لاحقاً
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Install Guide Modal */}
      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4"
            onClick={handleDismiss}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-brand to-mint-brand flex items-center justify-center shadow-md">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">تثبيت وصلني</h3>
                    <p className="text-xs text-muted-foreground">على جهاز iPhone/iPad</p>
                  </div>
                </div>
                <button onClick={handleDismiss} className="p-2 rounded-full hover:bg-muted">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sky-brand font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">اضغط على زر المشاركة</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Share className="w-4 h-4 text-sky-brand" />
                      <span className="text-xs text-muted-foreground">أسفل شريط المتصفح في Safari</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sky-brand font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">اختر "إضافة إلى الشاشة الرئيسية"</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Plus className="w-4 h-4 text-sky-brand" />
                      <span className="text-xs text-muted-foreground">من القائمة التي تظهر</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-mint-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-mint-brand font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">اضغط "إضافة" للتأكيد</p>
                    <p className="text-xs text-muted-foreground mt-0.5">سيظهر التطبيق على شاشتك الرئيسية</p>
                  </div>
                </div>
              </div>

              {/* Arrow pointing down to Safari bar */}
              <div className="mt-5 p-3 bg-sky-brand/5 rounded-xl border border-sky-brand/15 text-center">
                <p className="text-xs text-sky-brand font-medium">
                  تأكد من استخدام متصفح Safari لتثبيت التطبيق
                </p>
              </div>

              <Button
                onClick={handleDismiss}
                className="w-full mt-4 bg-gradient-to-r from-sky-brand to-mint-brand text-white border-0"
              >
                فهمت، شكراً
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
