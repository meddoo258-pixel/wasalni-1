/**
 * RideTrackingMap - خريطة تفاعلية لتتبع الرحلات
 * تعرض نقطة الانطلاق والوجهة والمسار بين النقطتين
 * تدعم تتبع موقع السائق في الوقت الفعلي (محاكاة)
 */
/// <reference types="@types/google.maps" />
import { useRef, useEffect, useState } from "react";
import { MapView } from "@/components/Map";
import { Navigation, MapPin, Clock, Car } from "lucide-react";
import { motion } from "framer-motion";

interface RideTrackingMapProps {
  startLocation: string;
  endLocation: string;
  startLat?: number | string | null;
  startLng?: number | string | null;
  endLat?: number | string | null;
  endLng?: number | string | null;
  rideStatus?: "scheduled" | "in_progress" | "completed" | "cancelled";
  estimatedTime?: number | null;
  className?: string;
  mode?: "passenger" | "driver";
}

// Saudi Arabia major cities coordinates
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "الرياض": { lat: 24.7136, lng: 46.6753 },
  "جدة": { lat: 21.4858, lng: 39.1925 },
  "مكة المكرمة": { lat: 21.3891, lng: 39.8579 },
  "المدينة المنورة": { lat: 24.5247, lng: 39.5692 },
  "الدمام": { lat: 26.4207, lng: 50.0888 },
  "الخبر": { lat: 26.2172, lng: 50.1971 },
  "الطائف": { lat: 21.2854, lng: 40.4149 },
  "تبوك": { lat: 28.3998, lng: 36.5715 },
  "أبها": { lat: 18.2164, lng: 42.5053 },
  "القصيم": { lat: 26.3260, lng: 43.9750 },
};

function guessCoords(location: string): { lat: number; lng: number } | null {
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (location.includes(city)) return coords;
  }
  return null;
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-sky-100 text-sky-700 border-sky-200",
  in_progress: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  scheduled: "مجدولة",
  in_progress: "جارية الآن",
  completed: "مكتملة",
  cancelled: "ملغاة",
};

export default function RideTrackingMap({
  startLocation,
  endLocation,
  startLat,
  startLng,
  endLat,
  endLng,
  rideStatus = "scheduled",
  estimatedTime,
  className = "",
  mode = "passenger",
}: RideTrackingMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  // Resolve coordinates
  const resolveCoords = (lat: number | string | null | undefined, lng: number | string | null | undefined, location: string) => {
    if (lat && lng) {
      return { lat: parseFloat(String(lat)), lng: parseFloat(String(lng)) };
    }
    return guessCoords(location);
  };

  const startCoords = resolveCoords(startLat, startLng, startLocation);
  const endCoords = resolveCoords(endLat, endLng, endLocation);

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);
  };

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;

    // Clear existing markers and renderer
    markersRef.current.forEach((m) => { m.map = null; });
    markersRef.current = [];
    if (rendererRef.current) {
      rendererRef.current.setMap(null);
      rendererRef.current = null;
    }

    const createMarkerContent = (emoji: string, label: string) => {
      const div = document.createElement("div");
      div.style.cssText = `
        display: flex; flex-direction: column; align-items: center; cursor: pointer;
      `;
      const pin = document.createElement("div");
      pin.style.cssText = `
        width: 40px; height: 40px; border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;
        background: ${emoji === "🚗" ? "#10B981" : emoji === "📍" ? "#0EA5E9" : "#F59E0B"};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid white;
      `;
      const inner = document.createElement("span");
      inner.style.cssText = "transform: rotate(45deg); font-size: 18px;";
      inner.textContent = emoji;
      pin.appendChild(inner);
      const lbl = document.createElement("span");
      lbl.style.cssText = `
        margin-top: 4px; background: white; padding: 2px 6px; border-radius: 4px;
        font-size: 11px; font-weight: bold; color: #1f2937; white-space: nowrap;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
      `;
      lbl.textContent = label;
      div.appendChild(pin);
      div.appendChild(lbl);
      return div;
    };

    if (startCoords && endCoords) {
      // Use Directions Service to draw route
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: rideStatus === "in_progress" ? "#10B981" : "#0EA5E9",
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });
      rendererRef.current = directionsRenderer;

      directionsService.route(
        {
          origin: startCoords,
          destination: endCoords,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsRenderer.setDirections(result);
            const leg = result.routes[0]?.legs[0];
            if (leg) {
              setRouteInfo({
                distance: leg.distance?.text ?? "",
                duration: leg.duration?.text ?? "",
              });
            }
          } else {
            // Fallback: just show markers and fit bounds
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(startCoords);
            bounds.extend(endCoords);
            map.fitBounds(bounds, 80);
          }
        }
      );

      // Add custom markers
      const startMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: startCoords,
        title: startLocation,
        content: createMarkerContent("📍", "الانطلاق"),
      });
      const endMarker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: endCoords,
        title: endLocation,
        content: createMarkerContent("🏁", "الوجهة"),
      });
      markersRef.current = [startMarker, endMarker];

      // If in_progress, add animated driver marker near start
      if (rideStatus === "in_progress") {
        const driverMarker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: {
            lat: startCoords.lat + (endCoords.lat - startCoords.lat) * 0.3,
            lng: startCoords.lng + (endCoords.lng - startCoords.lng) * 0.3,
          },
          title: "السائق",
          content: createMarkerContent("🚗", "السائق"),
        });
        markersRef.current.push(driverMarker);
      }
    } else if (startCoords) {
      // Only start location
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: startCoords,
        title: startLocation,
        content: createMarkerContent("📍", startLocation),
      });
      markersRef.current = [marker];
      map.setCenter(startCoords);
      map.setZoom(13);
    } else {
      // Default: Riyadh
      map.setCenter({ lat: 24.7136, lng: 46.6753 });
      map.setZoom(11);
    }
  }, [mapReady, startLocation, endLocation, rideStatus]);

  return (
    <div className={`rounded-2xl overflow-hidden border border-gray-200 shadow-lg ${className}`}>
      {/* Map header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-sky-600" />
          <span className="font-bold text-sm text-gray-800">
            {mode === "driver" ? "خريطة المسار" : "تتبع رحلتك"}
          </span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${STATUS_COLORS[rideStatus]}`}>
          {STATUS_LABELS[rideStatus]}
        </span>
      </div>

      {/* Route info bar */}
      <div className="bg-gradient-to-r from-sky-50 to-teal-50 px-4 py-2 flex items-center gap-4 text-xs border-b border-sky-100">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
          <span className="text-gray-600 truncate">{startLocation}</span>
        </div>
        <div className="text-gray-400 flex-shrink-0">←</div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="text-gray-600 truncate">{endLocation}</span>
        </div>
        {(routeInfo || estimatedTime) && (
          <div className="flex items-center gap-1 text-teal-700 font-semibold flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>{routeInfo?.duration ?? `${estimatedTime} دقيقة`}</span>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative">
        <MapView
          className="w-full h-64"
          initialCenter={
            startCoords ?? { lat: 24.7136, lng: 46.6753 }
          }
          initialZoom={startCoords && endCoords ? 10 : 11}
          onMapReady={handleMapReady}
        />

        {/* In-progress pulse indicator */}
        {rideStatus === "in_progress" && (
          <motion.div
            className="absolute top-3 right-3 flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Car className="w-3.5 h-3.5" />
            جارية الآن
          </motion.div>
        )}

        {/* Route distance */}
        {routeInfo?.distance && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full shadow border border-gray-100 text-gray-700">
            المسافة: {routeInfo.distance}
          </div>
        )}
      </div>
    </div>
  );
}
