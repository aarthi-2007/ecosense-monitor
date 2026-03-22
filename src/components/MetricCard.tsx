import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import { StatusLevel } from '@/lib/data';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  status: StatusLevel;
  icon: React.ReactNode;
  subtitle?: string;
  delay?: number;
}

export default function MetricCard({ title, value, unit, status, icon, subtitle, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">{title}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold font-mono tracking-tight text-foreground">{value}</span>
        <span className="text-muted-foreground text-sm mb-1">{unit}</span>
      </div>
      <div className="flex items-center justify-between">
        <StatusBadge status={status} size="sm" />
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
    </motion.div>
  );
}
