import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { StatusLevel } from '@/lib/data';
import { useState } from 'react';

interface Alert {
  message: string;
  level: StatusLevel;
  zone: string;
}

interface AlertBannerProps {
  alerts: Alert[];
}

export default function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = alerts.filter(a => !dismissed.has(a.message));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {visible.map((alert) => (
          <motion.div
            key={alert.message}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
              alert.level === 'hazardous'
                ? 'bg-status-hazardous/15 border-purple-500/30'
                : 'bg-status-poor/15 border-red-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${alert.level === 'hazardous' ? 'status-hazardous' : 'status-poor'}`} />
              <span className="text-sm text-foreground">{alert.message}</span>
            </div>
            <button onClick={() => setDismissed(p => new Set(p).add(alert.message))} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
