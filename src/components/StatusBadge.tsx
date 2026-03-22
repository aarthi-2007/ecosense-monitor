import { StatusLevel, getStatusLabel } from '@/lib/data';

interface StatusBadgeProps {
  status: StatusLevel;
  size?: 'sm' | 'md';
}

const statusClasses: Record<StatusLevel, string> = {
  good: 'bg-status-good/15 status-good',
  moderate: 'bg-status-moderate/15 status-moderate',
  poor: 'bg-status-poor/15 status-poor',
  hazardous: 'bg-status-hazardous/15 status-hazardous',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${statusClasses[status]} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
      <span className={`w-2 h-2 rounded-full ${status === 'good' ? 'bg-status-good' : status === 'moderate' ? 'bg-status-moderate' : status === 'poor' ? 'bg-status-poor' : 'bg-status-hazardous'}`} />
      {getStatusLabel(status)}
    </span>
  );
}
