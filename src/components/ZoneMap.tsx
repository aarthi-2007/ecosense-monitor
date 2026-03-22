import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { zones, generateHistoricalData, getAQIStatus, getWQIStatus, getStatusColor, getStatusLabel } from '@/lib/data';

interface ZoneMapProps {
  selectedZone: string;
  onSelectZone: (id: string) => void;
}

export default function ZoneMap({ selectedZone, onSelectZone }: ZoneMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: false }).setView([28.6139, 77.209], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when zone changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    zones.forEach(zone => {
      const { aqiData, wqiData } = generateHistoricalData(zone.id, 1);
      const aqi = aqiData[aqiData.length - 1].aqi;
      const wqi = wqiData[wqiData.length - 1].wqi;
      const status = getAQIStatus(aqi);
      const color = getStatusColor(status);
      const isSelected = zone.id === selectedZone;

      const marker = L.circleMarker([zone.lat, zone.lng], {
        radius: isSelected ? 18 : 12,
        color,
        fillColor: color,
        fillOpacity: isSelected ? 0.5 : 0.3,
        weight: isSelected ? 3 : 1.5,
      }).addTo(map);

      marker.bindPopup(`
        <div style="color:#1a1a2e;min-width:160px">
          <strong>${zone.name}</strong>
          <div style="margin-top:4px">AQI: <strong>${aqi}</strong> — ${getStatusLabel(status)}</div>
          <div>WQI: <strong>${wqi}</strong> — ${getStatusLabel(getWQIStatus(wqi))}</div>
        </div>
      `);

      marker.on('click', () => onSelectZone(zone.id));
      markersRef.current.push(marker);
    });

    const selected = zones.find(z => z.id === selectedZone) || zones[0];
    map.setView([selected.lat, selected.lng], 12, { animate: true });
  }, [selectedZone, onSelectZone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card p-2 overflow-hidden"
    >
      <div ref={containerRef} className="rounded-lg overflow-hidden" style={{ height: 360 }} />
    </motion.div>
  );
}
