import { motion } from 'framer-motion';
import { AQIReading, WQIReading } from '@/lib/data';
import { Wind, Droplets } from 'lucide-react';

interface ParameterDetailsProps {
  aqi: AQIReading;
  wqi: WQIReading;
}

export default function ParameterDetails({ aqi, wqi }: ParameterDetailsProps) {
  const aqiParams = [
    { label: 'PM2.5', value: aqi.pm25, unit: 'µg/m³' },
    { label: 'PM10', value: aqi.pm10, unit: 'µg/m³' },
    { label: 'CO', value: aqi.co, unit: 'mg/m³' },
  ];

  const wqiParams = [
    { label: 'pH', value: wqi.ph, unit: '' },
    { label: 'Turbidity', value: wqi.turbidity, unit: 'NTU' },
    { label: 'DO', value: wqi.dissolvedOxygen, unit: 'mg/L' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-5"
    >
      <h3 className="text-foreground font-semibold mb-4">Parameter Details</h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wind className="w-4 h-4" style={{ color: 'hsl(200, 90%, 50%)' }} />
            <span className="text-sm font-medium text-muted-foreground">Air Quality</span>
          </div>
          <div className="space-y-2">
            {aqiParams.map(p => (
              <div key={p.label} className="flex justify-between items-center py-1.5 px-3 rounded bg-secondary/50">
                <span className="text-sm text-muted-foreground">{p.label}</span>
                <span className="font-mono text-sm text-foreground">{p.value} <span className="text-xs text-muted-foreground">{p.unit}</span></span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Water Quality</span>
          </div>
          <div className="space-y-2">
            {wqiParams.map(p => (
              <div key={p.label} className="flex justify-between items-center py-1.5 px-3 rounded bg-secondary/50">
                <span className="text-sm text-muted-foreground">{p.label}</span>
                <span className="font-mono text-sm text-foreground">{p.value} <span className="text-xs text-muted-foreground">{p.unit}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
