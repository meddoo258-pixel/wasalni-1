/**
 * Footer - Smart Route Futurism Design
 * Bilingual footer with updated contact info and services
 */
import { Link } from "wouter";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-brand text-white/90 relative overflow-hidden">
      {/* Decorative route lines */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1200 400" fill="none">
          <path d="M0 200 Q300 100 600 200 T1200 200" stroke="currentColor" strokeWidth="2" />
          <path d="M0 250 Q300 150 600 250 T1200 250" stroke="currentColor" strokeWidth="1" />
          <path d="M0 150 Q300 50 600 150 T1200 150" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="container relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-brand to-mint-brand flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-[Readex_Pro]">وصلني</h3>
                <span className="text-[10px] text-white/50 tracking-wider">WASALNI</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold font-[Readex_Pro] text-white">{t("footer.links")}</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: t("nav.home") },
                { href: "/services", label: t("nav.services") },
                { href: "/pricing", label: t("nav.pricing") },
                { href: "/about", label: t("nav.about") },
                { href: "/contact", label: t("nav.contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-white/60 hover:text-mint-brand transition-colors duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold font-[Readex_Pro] text-white">{t("footer.services")}</h4>
            <ul className="space-y-2">
              {[
                t("footer.employees"),
                t("footer.students"),
                t("footer.corporate"),
                t("footer.airport"),
                t("footer.joinDriver"),
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-white/60">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold font-[Readex_Pro] text-white">{t("footer.contact")}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-brand flex-shrink-0" />
                <a href="tel:0510660620" className="text-sm text-white/60 hover:text-white transition-colors" dir="ltr">0510660620</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-brand flex-shrink-0" />
                <span className="text-sm text-white/60">info@wasalni.sa</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-sky-brand flex-shrink-0" />
                <a href="https://wa.me/966510660620" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors">
                  {t("footer.whatsapp")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {["mada", "Apple Pay", "tabby", "tamara"].map((method) => (
              <div key={method} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs text-white/70 font-medium">{method === "mada" ? "مدى | Mada" : method === "tabby" ? "تابي | Tabby" : method === "tamara" ? "تمارا | Tamara" : "Apple Pay"}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-white/40 mt-3">{t("payment.note")}</p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            {t("footer.rights")} &copy; {new Date().getFullYear()} وصلني - Wasalni
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/40 hover:text-white/60 transition-colors cursor-pointer">
              {t("footer.privacy")}
            </span>
            <span className="text-xs text-white/40 hover:text-white/60 transition-colors cursor-pointer">
              {t("footer.terms")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
