import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { zones, generateHistoricalData, getAQIStatus, getWQIStatus, getStatusColor, getStatusLabel } from '@/lib/data';
import 'leaflet/dist/leaflet.css';

function SetView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 12); }, [center, map]);
  return null;
}

interface ZoneMapProps {
  selectedZone: string;
  onSelectZone: (id: string) => void;
}

export default function ZoneMap({ selectedZone, onSelectZone }: ZoneMapProps) {
  const selected = zones.find(z => z.id === selectedZone) || zones[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card p-2 overflow-hidden"
    >
      <div className="rounded-lg overflow-hidden" style={{ height: 360 }}>
        <MapContainer center={[selected.lat, selected.lng]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <SetView center={[selected.lat, selected.lng]} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {zones.map(zone => {
            const { aqiData, wqiData } = generateHistoricalData(zone.id, 1);
            const aqi = aqiData[aqiData.length - 1].aqi;
            const wqi = wqiData[wqiData.length - 1].wqi;
            const status = getAQIStatus(aqi);
            const color = getStatusColor(status);
            const isSelected = zone.id === selectedZone;

            return (
              <CircleMarker
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={isSelected ? 18 : 12}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.5 : 0.3,
                  weight: isSelected ? 3 : 1.5,
                }}
                eventHandlers={{ click: () => onSelectZone(zone.id) }}
              >
                <Popup>
                  <div style={{ color: '#1a1a2e', minWidth: 160 }}>
                    <strong>{zone.name}</strong>
                    <div style={{ marginTop: 4 }}>AQI: <strong>{aqi}</strong> — {getStatusLabel(status)}</div>
                    <div>WQI: <strong>{wqi}</strong> — {getStatusLabel(getWQIStatus(wqi))}</div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </motion.div>
  );
}
