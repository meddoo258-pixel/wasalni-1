import { useRef, useEffect } from "react";
import { MapView } from "@/components/Map";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, CheckCircle } from "lucide-react";

const CITIES = [
  { name: "الرياض", nameEn: "Riyadh", lat: 24.7136, lng: 46.6753, status: "active" },
  { name: "جدة", nameEn: "Jeddah", lat: 21.5433, lng: 39.1728, status: "active" },
  { name: "الدمام", nameEn: "Dammam", lat: 26.4124, lng: 50.1971, status: "active" },
  { name: "مكة", nameEn: "Makkah", lat: 21.4225, lng: 39.8262, status: "coming" },
  { name: "المدينة", nameEn: "Madinah", lat: 24.5247, lng: 39.5692, status: "coming" },
  { name: "الخبر", nameEn: "Khobar", lat: 26.1551, lng: 50.2084, status: "active" },
  { name: "تبوك", nameEn: "Tabuk", lat: 28.3938, lng: 36.5627, status: "planned" },
  { name: "أبها", nameEn: "Abha", lat: 18.2155, lng: 42.5054, status: "planned" },
  { name: "الطائف", nameEn: "Taif", lat: 21.2716, lng: 40.4158, status: "planned" },
  { name: "حائل", nameEn: "Hail", lat: 27.5136, lng: 41.7208, status: "planned" },
];

export default function CoverageMap() {
  const { t, lang } = useLanguage();
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    map.setCenter({ lat: 24.7136, lng: 46.6753 });
    map.setZoom(5);

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for each city
    CITIES.forEach((city) => {
      const pinColor = city.status === "active" ? "10B981" : city.status === "coming" ? "F59E0B" : "9CA3AF";
      const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#${pinColor}" width="32" height="32"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>`;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: city.lat, lng: city.lng },
        title: lang === "ar" ? city.name : city.nameEn,
        content: new DOMParser().parseFromString(pinSvg, "text/xml").documentElement as unknown as HTMLElement,
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="padding: 8px; font-family: Arial; text-align: center;">
          <strong>${lang === "ar" ? city.name : city.nameEn}</strong><br/>
          <small>${t(`coverage.${city.status}`)}</small>
        </div>`,
      });

      marker.addEventListener("click", () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });
  };

  const activeCities = CITIES.filter((c) => c.status === "active");
  const comingCities = CITIES.filter((c) => c.status === "coming");
  const plannedCities = CITIES.filter((c) => c.status === "planned");

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background pt-20 pb-12">
      <div className="container">
        <SectionHeading title={t("coverage.title")} subtitle={t("coverage.subtitle")} />

        {/* Map */}
        <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
          <MapView
            initialCenter={{ lat: 24.7136, lng: 46.6753 }}
            initialZoom={5}
            onMapReady={handleMapReady}
            className="w-full h-[500px]"
          />
        </div>

        {/* Cities by Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Active */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{t("coverage.active")}</h3>
              </div>
              <div className="space-y-2">
                {activeCities.map((city) => (
                  <div key={city.name} className="text-sm text-muted-foreground">
                    {lang === "ar" ? city.name : city.nameEn}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{t("coverage.coming")}</h3>
              </div>
              <div className="space-y-2">
                {comingCities.map((city) => (
                  <div key={city.name} className="text-sm text-muted-foreground">
                    {lang === "ar" ? city.name : city.nameEn}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Planned */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{t("coverage.planned")}</h3>
              </div>
              <div className="space-y-2">
                {plannedCities.map((city) => (
                  <div key={city.name} className="text-sm text-muted-foreground">
                    {lang === "ar" ? city.name : city.nameEn}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expansion Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-sky-50 to-mint-50">
          <CardContent className="pt-8">
            <h3 className="text-lg font-bold text-foreground mb-3">{t("coverage.expansion")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("coverage.expansionDesc")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
