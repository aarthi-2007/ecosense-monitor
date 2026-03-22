import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { LogOut, User, Shield } from 'lucide-react';
import { zones } from '@/lib/data';

interface DashboardHeaderProps {
  selectedZone: string;
  onSelectZone: (id: string) => void;
  timePeriod: string;
  onTimePeriodChange: (p: string) => void;
}

export default function DashboardHeader({ selectedZone, onSelectZone, timePeriod, onTimePeriodChange }: DashboardHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          AQI & WQI Monitor
        </h1>
        <p className="text-sm text-muted-foreground">Multi-Zone Environmental Analysis</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={selectedZone}
          onChange={e => onSelectZone(e.target.value)}
          className="bg-secondary text-secondary-foreground border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {zones.map(z => (
            <option key={z.id} value={z.id}>{z.name}</option>
          ))}
        </select>

        <div className="flex bg-secondary rounded-lg p-0.5">
          {['daily', 'weekly', 'monthly'].map(p => (
            <button
              key={p}
              onClick={() => onTimePeriodChange(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timePeriod === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
          {user?.role === 'admin' ? <Shield className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-muted-foreground" />}
          <span className="text-sm text-foreground">{user?.name}</span>
          <button onClick={logout} className="text-muted-foreground hover:text-destructive ml-1 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
