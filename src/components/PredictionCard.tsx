import { motion } from 'framer-motion';
import { Prediction, getAQIStatus, getWQIStatus } from '@/lib/data';
import StatusBadge from './StatusBadge';
import { Brain } from 'lucide-react';

interface PredictionCardProps {
  predictions: Prediction[];
}

export default function PredictionCard({ predictions }: PredictionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-400" />
        <h3 className="text-foreground font-semibold">ML Forecast (7 Days)</h3>
      </div>
      <div className="space-y-2">
        {predictions.map((p, i) => (
          <motion.div
            key={p.date}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50"
          >
            <span className="text-sm font-mono text-muted-foreground">{p.date.slice(5)}</span>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-muted-foreground">AQI </span>
                <span className="font-mono text-sm text-foreground">{p.aqiPredicted}</span>
              </div>
              <StatusBadge status={getAQIStatus(p.aqiPredicted)} size="sm" />
              <div className="text-right">
                <span className="text-xs text-muted-foreground">WQI </span>
                <span className="font-mono text-sm text-foreground">{p.wqiPredicted}</span>
              </div>
              <StatusBadge status={getWQIStatus(p.wqiPredicted)} size="sm" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
